import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {ageFoodContext,ageFoodKeywordsView} from '../docs/age-food-keywords.js';
const docs=new URL('../docs/',import.meta.url);
assert.equal(ageFoodContext({species:'dog',size:'small',years:1}).group,'adult');
assert.equal(ageFoodContext({species:'dog',size:'large',years:1}).group,'growth');
assert.equal(ageFoodContext({species:'dog',size:'large',years:1,months:4}).group,'adult');
assert.equal(ageFoodContext({species:'cat',years:0,months:11}).group,'growth');
assert.equal(ageFoodContext({species:'cat',years:8}).group,'older');
for(const species of ['dog','cat','rabbit','hamster','parrot'])for(const years of [0,3,10])for(const en of [false,true]){
 const html=ageFoodKeywordsView({species,years,months:0},en);
 const foodLinks=[...html.matchAll(/href="(\/(?:ko|en)\/[^"#]+)"/g)].map(m=>m[1]);assert.equal(foodLinks.length,4);
 for(const link of foodLinks){assert.ok(link.includes('/'+species+'/'));await access(new URL('.'+link+'index.html',docs));}
}
const guide=await readFile(new URL('guides/index.html',docs),'utf8');assert.ok(guide.includes('guide-library.css?v=1'));assert.ok(guide.includes('guide-tile-grid'));assert.ok(guide.includes('guide-spotlight'));
for(const match of guide.matchAll(/(?:src|href)="(\/images\/[^"?]+|\/guides\/[^"#]+)"/g)){const path=match[1];await access(new URL('.'+path+(path.endsWith('/')?'index.html':''),docs));}
for(const path of ['guides/pet-age-calculator/index.html','guides/pet-age-calculator-en/index.html']){const html=await readFile(new URL(path,docs),'utf8');assert.ok(html.includes('data-age-foods'));assert.ok(!html.includes('data-age-food href'));}
let pages=0;for(const path of (await readdir(docs,{recursive:true})).filter(p=>p.endsWith('.html'))){const html=await readFile(new URL(path.replaceAll('\\','/'),docs),'utf8'),header=html.match(/<header\b[\s\S]*?<\/header>/)?.[0];if(!header)continue;assert.ok(!/>검증 원칙<|>Our (?:approach|method)</.test(header),path);assert.ok(header.includes('data-nav="age"'),path);const en=html.includes('<html lang="en"');assert.ok(header.includes(`href="/guides/pet-age-calculator${en?'-en':''}/"`),path);pages++;}
console.log(`Visitor flow verified: ${pages} headers, bilingual actual-age keyword groups, four valid species-specific links per result, and all guide card covers/destinations.`);
