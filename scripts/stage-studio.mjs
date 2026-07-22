// Copies the built Sanity Studio from .studiobuild into public/admin, taking
// ONLY the studio's own files (Sanity's build also copies /public into its
// output — we skip that duplicate). Cross-platform (Node fs), runs in the
// Vercel build. See package.json "build".
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";

const SRC = ".studiobuild";
const DEST = "public/admin";
const KEEP = ["index.html", "static", "vendor", "favicon.ico"];

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });

for (const name of KEEP) {
  const from = `${SRC}/${name}`;
  if (existsSync(from)) {
    cpSync(from, `${DEST}/${name}`, { recursive: true });
  }
}

console.log(`Staged studio → ${DEST}`);
