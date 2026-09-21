import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docs = join(root, "docs");
const origin = "https://petnyam.com";
const required = [
  ["index.html", "<link rel=\"canonical\" href=\"https://petnyam.com/\">"],
  ["robots.txt", `Sitemap: ${origin}/sitemap.xml`],
  ["sitemap.xml", `${origin}/ko/dog/grape`],
  ["ko/dog/grape/index.html", "<h1>먹이면 안 돼요</h1>"],
  ["en/cat/onion/index.html", "Can a cat eat onion?"],
  ["policy/terms/index.html", "이용약관"],
];

for (const [file, expected] of required) {
  const path = join(docs, file);
  await stat(path);
  const contents = await readFile(path, "utf8");
  if (!contents.includes(expected)) throw new Error(`Expected content is missing from docs/${file}`);
}

const sitemap = await readFile(join(docs, "sitemap.xml"), "utf8");
const count = (sitemap.match(/<loc>/g) ?? []).length;
if (count !== 505) throw new Error(`Expected 505 sitemap URLs, found ${count}`);
if (/\/(강아지|safe|Food search)</.test(sitemap)) throw new Error("Sitemap contains a non-route value.");
console.log(`GitHub Pages deployment files verified: ${count} sitemap URLs.`);
