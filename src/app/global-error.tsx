"use client";

import { useEffect } from "react";
import { reportError } from "@/shared/lib/errorReporting";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Catches errors thrown by RootLayout itself (font loading, the Providers tree) — `error.tsx`
 * only covers its sibling `children` segment tree and can never catch a failure in the layout
 * that renders it. This file replaces the entire `<html>/<body>`, so it deliberately avoids
 * depending on anything RootLayout sets up (fonts, Providers, shared UI components) that might
 * itself be the thing that failed.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    reportError(error, { boundary: "global", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          background: "#faf9f7",
          color: "#1a1a1a",
        }}
      >
        <h1 style={{ fontSize: "1.375rem", fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: "28rem", textAlign: "center", color: "#666" }}>
          Please try again. If the problem continues, contact support.
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #1a1a1a",
              background: "#1a1a1a",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {/*
            Deliberate plain anchor, not next/link: this file replaces the entire root layout
            when RootLayout itself has thrown, so it must not depend on Next's client-side
            router possibly being part of what's broken. A plain anchor always works via a hard
            navigation.
          */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc",
              color: "#1a1a1a",
              textDecoration: "none",
            }}
          >
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
