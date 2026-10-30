import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {newInformationArticles} from '../docs/new-information-articles.js';
const docs=new URL('../docs/',import.meta.url);
assert.equal(Object.keys(newInformationArticles).length,6);
for(const [path,a]of Object.entries(newInformationArticles)){
 const html=await readFile(new URL('.'+path+'index.html',docs),'utf8');assert.ok(html.includes(a.title));assert.ok(html.includes('2026-10-28'));
 for(const url of a.sources)assert.ok(html.includes(url));
 for(const route of Object.values(a.alternates))assert.ok(html.includes('https://petnyam.com'+route));
 for(const m of html.matchAll(/href="(\/(?:guides|ko|en|foods)\/[^"#?]*)"/g))await access(new URL('.'+m[1]+(m[1].endsWith('/')?'index.html':''),docs));
}
for(const path of ['index.html','en/index.html']){const html=await readFile(new URL(path,docs),'utf8');assert.ok(html.includes('data-home-information'));for(const name of ['hong-apple','seol-apple'])assert.ok(html.includes('/images/owner/'+name+'.webp'));}
const foods=await readFile(new URL('foods/index.html',docs),'utf8');assert.ok(foods.includes('/guides/can-dogs-eat-kiwi/'));assert.ok(foods.includes('/guides/can-dogs-eat-raspberries/'));
const guide=await readFile(new URL('guides/index.html',docs),'utf8');assert.ok(guide.includes('id="guide-travel"'));
for(const file of ['convenience.js']){const text=await readFile(new URL(file,docs),'utf8');assert.ok(text.includes("pet==='dog'"));assert.ok(text.includes('matchingSupplementalFoods(q)'));}
console.log('New information verified: six bilingual pages, primary sources, alternates, working internal links, home photo cards, travel category and dog-only food-guide discovery.');
