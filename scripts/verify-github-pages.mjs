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
  ["policy/privacy/index.html", "Google AdSense 스크립트"],
  ["policy/contact/index.html", "jungdo63@gmail.com"],
  ["guides/food-emergency/index.html", "연락 전에 정리할 정보"],
  ["guides/read-a-verdict/index.html", "네 가지 상태"],
  ["guides/new-food-checklist/index.html", "새 음식을 주기 전"],
  ["guides/processed-food-label/index.html", "제품명보다 성분표"],
  ["guides/xylitol-product-check/index.html", "자일리톨부터 확인"],
  ["guides/main-meal-or-treat/index.html", "주식과 간식"],
  ["guides/food-storage-record/index.html", "남겨둘 정보"],
  ["guides/changing-foods-safely/index.html", "무엇이 달라졌는지"],
  ["ads.txt", "google.com, pub-2911341623586356, DIRECT, f08c47fec0942fa0"],
];

for (const [file, expected] of required) {
  const path = join(docs, file);
  await stat(path);
  const contents = await readFile(path, "utf8");
  if (!contents.includes(expected)) throw new Error(`Expected content is missing from docs/${file}`);
}

const sitemap = await readFile(join(docs, "sitemap.xml"), "utf8");
const count = (sitemap.match(/<loc>/g) ?? []).length;
if (count !== 515) throw new Error(`Expected 515 sitemap URLs, found ${count}`);
if (/\/(강아지|safe|Food search)</.test(sitemap)) throw new Error("Sitemap contains a non-route value.");
console.log(`GitHub Pages deployment files verified: ${count} sitemap URLs.`);
