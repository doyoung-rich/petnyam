import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {siteTitles} from '../docs/title-strategy.js';
import {foodPageMeta} from '../docs/food-page-content.js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docs = join(root, "docs");
const origin = "https://petnyam.com";
const required = [
  ["index.html", "<link rel=\"canonical\" href=\"https://petnyam.com/\">"],
  ["robots.txt", `Sitemap: ${origin}/sitemap.xml`],
  ["foods/index.html", siteTitles['/foods/']],
  ["sitemap.xml", `${origin}/ko/dog/grape`],
  ["ko/dog/grape/index.html", foodPageMeta('dog/grape').title],
  ["en/cat/onion/index.html", "Can cats eat onions?"],
  ["policy/terms/index.html", "이용약관"],
  ["policy/privacy/index.html", "Google AdSense 스크립트"],
  ["policy/contact/index.html", "jungdo63@gmail.com"],
  ["guides/food-emergency/index.html", "연락 전에 정리할 정보"],
  ["guides/read-a-verdict/index.html", "네 가지 상태"],
  ["guides/new-food-checklist/index.html", siteTitles['/guides/new-food-checklist/']],
  ["guides/processed-food-label/index.html", siteTitles['/guides/processed-food-label/']],
  ["guides/xylitol-product-check/index.html", siteTitles['/guides/xylitol-product-check/']],
  ["guides/main-meal-or-treat/index.html", siteTitles['/guides/main-meal-or-treat/']],
  ["guides/food-storage-record/index.html", siteTitles['/guides/food-storage-record/']],
  ["guides/changing-foods-safely/index.html", siteTitles['/guides/changing-foods-safely/']],
  ["guides/coton-de-tulear-life/index.html", "실제 보호자 메모"],
  ["guides/coton-de-tulear-life-en/index.html", "The real caregiver's note"],
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
if (count !== 528) throw new Error(`Expected 528 sitemap URLs, found ${count}`);
const icon = await readFile(join(docs, "favicon.ico"));
if (icon.readUInt16LE(2) !== 1 || icon.readUInt16LE(4) !== 1) throw new Error("Invalid ICO header.");
const directory = await readFile(join(docs, "foods/index.html"), "utf8");
const foodLinks = [...directory.matchAll(/href="(\/ko\/[^\"]+)"/g)];
if (foodLinks.length !== 250) throw new Error("Expected 250 food directory links.");
for (const [, route] of foodLinks) await stat(join(docs, route.slice(1), "index.html"));
if (/\/(강아지|safe|Food search)</.test(sitemap)) throw new Error("Sitemap contains a non-route value.");
console.log(`GitHub Pages deployment files verified: ${count} sitemap URLs.`);
