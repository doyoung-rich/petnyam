import { access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docs = join(root, "docs");

for (const file of ["index.html", "CNAME", "robots.txt", ".nojekyll"]) {
  await access(join(docs, file));
}

await import("./generate-static-details.mjs");
console.log("Prepared the existing GitHub Pages deployment files without replacing domain-specific assets or settings.");
