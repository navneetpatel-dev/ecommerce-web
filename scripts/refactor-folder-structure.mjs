#!/usr/bin/env node
/**
 * Safe folder-structure migrator.
 * Usage:
 *   node scripts/refactor-folder-structure.mjs --plan <plan.json> [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const planIdx = args.indexOf("--plan");
if (planIdx === -1) {
  console.error("Missing --plan <file>");
  process.exit(1);
}
const planPath = path.resolve(process.cwd(), args[planIdx + 1]);
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));

/** @type {{ from: string, to: string }[]} */
const moves = plan.moves.map((m) => ({
  from: path.normalize(m.from).replace(/\\/g, "/"),
  to: path.normalize(m.to).replace(/\\/g, "/"),
}));

function stripExt(p) {
  return p.replace(/\.(tsx?|jsx?|mjs|cjs)$/, "");
}

function toAlias(rootRelNoExtOrWith) {
  const normalized = stripExt(rootRelNoExtOrWith).replace(/\\/g, "/");
  if (!normalized.startsWith("src/")) return null;
  return "@/" + normalized.slice(4);
}

/** oldRootRel -> newRootRel (with extensions) */
const fileMap = new Map();
/** oldAlias (@/...) -> newAlias */
const aliasMap = new Map();
/** stripExt(oldRootRel) -> stripExt(newRootRel) for resolution */
const moduleMap = new Map();

for (const { from, to } of moves) {
  fileMap.set(from, to);
  moduleMap.set(stripExt(from), stripExt(to));
  const oldAlias = toAlias(from);
  const newAlias = toAlias(to);
  if (oldAlias && newAlias) aliasMap.set(oldAlias, newAlias);
}

const sortedAliases = [...aliasMap.keys()].sort((a, b) => b.length - a.length);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(ent.name)) out.push(p);
  }
  return out;
}

/**
 * Resolve an import specifier to a root-relative module id (no extension),
 * using path math + move map (works even after files were moved).
 * `fromRootRel` is the file's location at the time the import was written
 * (pre-move path when rewriting moved files' original content).
 */
function resolveSpecToModuleId(fromRootRel, spec) {
  if (spec.startsWith("@/")) {
    return stripExt("src/" + spec.slice(2)).replace(/\\/g, "/");
  }
  if (spec.startsWith(".")) {
    const fromAbs = path.join(ROOT, fromRootRel);
    const joined = path.normalize(path.join(path.dirname(fromAbs), spec));
    return stripExt(path.relative(ROOT, joined)).replace(/\\/g, "/");
  }
  return null;
}

function mapModuleId(moduleId) {
  if (!moduleId) return null;
  if (moduleMap.has(moduleId)) return moduleMap.get(moduleId);
  // index imports: ./foo -> foo/index
  if (moduleMap.has(moduleId + "/index")) return moduleMap.get(moduleId + "/index");
  return moduleId;
}

function relImport(fromRootRel, targetModuleId) {
  const fromAbs = path.join(ROOT, fromRootRel);
  const targetAbs = path.join(ROOT, targetModuleId);
  let rel = path.relative(path.dirname(fromAbs), targetAbs);
  rel = rel.replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

/**
 * @param fromRootRelBefore - where the file lived when content was authored (for resolving relative specs)
 * @param fromRootRelAfter - where the file lives/will live (for emitting new relative paths)
 */
function rewriteContent(content, fromRootRelBefore, fromRootRelAfter) {
  const importRe =
    /(from\s+|import\s*\(|export\s+\*\s+from\s+)(['"])([^'"]+)\2/g;

  return content.replace(importRe, (full, prefix, quote, spec) => {
    if (spec.startsWith("@/")) {
      for (const oldAlias of sortedAliases) {
        if (spec === oldAlias) {
          return `${prefix}${quote}${aliasMap.get(oldAlias)}${quote}`;
        }
      }
      const mod = resolveSpecToModuleId(fromRootRelBefore, spec);
      const mapped = mapModuleId(mod);
      if (mapped && mod && mapped !== mod) {
        const alias = toAlias(mapped);
        if (alias) return `${prefix}${quote}${alias}${quote}`;
      }
      return full;
    }

    if (spec.startsWith(".")) {
      const mod = resolveSpecToModuleId(fromRootRelBefore, spec);
      if (!mod) return full;
      const mapped = mapModuleId(mod);
      const targetMoved = mapped !== mod;
      const selfMoved = fromRootRelBefore !== fromRootRelAfter;
      if (!targetMoved && !selfMoved) return full;
      const newRel = relImport(fromRootRelAfter, mapped);
      return `${prefix}${quote}${newRel}${quote}`;
    }

    return full;
  });
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) removeEmptyDirs(path.join(dir, ent.name));
  }
  try {
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  } catch {
    /* ignore */
  }
}

console.log(
  `Plan: ${moves.length} moves, ${aliasMap.size} alias rewrites, dryRun=${dryRun}`,
);

// Validate sources
let missing = 0;
for (const { from, to } of moves) {
  const fromAbs = path.join(ROOT, from);
  const toAbs = path.join(ROOT, to);
  if (!fs.existsSync(fromAbs) && !fs.existsSync(toAbs)) {
    console.warn(`missing: ${from}`);
    missing++;
  }
}
if (missing) {
  console.error(`Abort: ${missing} missing sources`);
  process.exit(1);
}

if (dryRun) {
  for (const { from, to } of moves) console.log(`MOVE ${from} -> ${to}`);
  process.exit(0);
}

// 1. Read all moved file contents, rewrite for new location, write to destination
const movedContents = new Map(); // to -> content
for (const { from, to } of moves) {
  const fromAbs = path.join(ROOT, from);
  if (!fs.existsSync(fromAbs)) continue;
  const content = fs.readFileSync(fromAbs, "utf8");
  const rewritten = rewriteContent(content, from, to);
  movedContents.set(to, rewritten);
}

// 2. Write ALL destinations into a unique staging tree first (avoids macOS
//    case-insensitive collisions like Header/ vs header/), then swap into place.
const stagingRoot = path.join(
  SRC,
  `.refactor-staging-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
);
fs.mkdirSync(stagingRoot, { recursive: true });

for (const { from, to } of moves) {
  const fromAbs = path.join(ROOT, from);
  if (!movedContents.has(to)) continue;
  const stagedAbs = path.join(stagingRoot, to);
  fs.mkdirSync(path.dirname(stagedAbs), { recursive: true });
  fs.writeFileSync(stagedAbs, movedContents.get(to));
  if (fs.existsSync(fromAbs)) fs.unlinkSync(fromAbs);
}

// Remove emptied source dirs so case-colliding destination names can be created
removeEmptyDirs(path.join(SRC, "features"));
removeEmptyDirs(path.join(SRC, "shared"));

// Promote staging -> final
function promote(dir, relBase = "") {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    const rel = path.join(relBase, ent.name).replace(/\\/g, "/");
    if (ent.isDirectory()) {
      promote(abs, rel);
    } else {
      const dest = path.join(ROOT, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(abs, dest);
    }
  }
}
promote(stagingRoot);
fs.rmSync(stagingRoot, { recursive: true, force: true });

// 3. Rewrite all remaining source files (barrels, consumers)
//    For these, before===after (they didn't move). Relative specs still use
//    old paths in source text; resolveSpecToModuleId uses those old paths.
const files = walk(SRC);
let changed = 0;
for (const file of files) {
  const rootRel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (movedContents.has(rootRel)) continue;
  // skip any leftover staging
  if (rootRel.includes(".refactor-staging-")) continue;

  const content = fs.readFileSync(file, "utf8");
  const next = rewriteContent(content, rootRel, rootRel);
  if (next !== content) {
    fs.writeFileSync(file, next);
    changed++;
  }
}

removeEmptyDirs(path.join(SRC, "features"));
removeEmptyDirs(path.join(SRC, "shared"));

console.log(`Updated imports in ${changed} non-moved files`);
console.log("Done.");
