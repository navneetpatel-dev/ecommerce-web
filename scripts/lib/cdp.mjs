/** Minimal Chrome DevTools Protocol client over the installed Chrome (no dependency). */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

/** A command that never answers must fail its page, not hang the whole run. */
const COMMAND_TIMEOUT_MS = 30_000;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launchChrome() {
  const binary = CHROME_PATHS.find((candidate) => existsSync(candidate));
  if (!binary) throw new Error("Chrome not found; set CHROME_PATH.");
  const profile = mkdtempSync(path.join(os.tmpdir(), "responsive-audit-"));
  const child = spawn(
    binary,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const endpoint = await new Promise((resolve, reject) => {
    let output = "";
    child.stderr.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) resolve(match[1]);
    });
    child.on("exit", () => reject(new Error("Chrome exited early.")));
  });
  const connection = await connect(endpoint);
  return {
    ...connection,
    close() {
      child.kill();
      try {
        rmSync(profile, { recursive: true, force: true });
      } catch {
        /* the OS temp folder is cleaned up later */
      }
    },
  };
}

async function connect(endpoint) {
  const socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let nextId = 0;
  const pending = new Map();
  const listeners = new Set();
  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.id) {
      const waiter = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) waiter?.reject(new Error(data.error.message));
      else waiter?.resolve(data.result);
      return;
    }
    listeners.forEach((listener) => listener(data));
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`${method} did not answer`));
      }, COMMAND_TIMEOUT_MS);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  return { send, on: (listener) => listeners.add(listener) };
}
