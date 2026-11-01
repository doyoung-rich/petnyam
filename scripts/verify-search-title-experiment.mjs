import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {searchTitleExperiment,searchTitleControls} from '../docs/search-title-experiment.js';
const keys=Object.keys(searchTitleExperiment);
assert.equal(keys.length,3);
const plain=s=>s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const field=(html,tag)=>html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1];
const baseline=JSON.parse((await readFile(new URL('./search-title-baseline.json',import.meta.url),'utf8')).replace(/^\uFEFF/,''));
for(const key of [...keys,...searchTitleControls])for(const lang of ['ko','en']){
 const file=`docs/${lang}/${key}/index.html`,html=(await readFile(new URL('../'+file,import.meta.url),'utf8')).replace(/\r\n/g,'\n'),old=baseline.find(r=>r.file===file);
 const selected=lang==='ko'&&keys.includes(key);
 if(selected){
  const value=searchTitleExperiment[key].ko,title=value.title+' | PetNyam';
  assert.equal(plain(field(html,'title')),title);
  assert.equal(plain(field(html,'h1')),value.title);
  assert.ok(html.includes(`name="description" content="${value.description}"`));
  for(const name of ['og:title','twitter:title'])assert.ok(html.includes(`="${name}" content="${title}"`));
  assert.ok(html.includes(`="og:description" content="${value.description}"`));
  const graph=JSON.parse(html.match(/id="petnyam-search-metadata">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph.find(n=>n['@id']?.endsWith('#page')).name,title);
 }else{
  assert.equal(field(html,'title'),old.title,file+' control title');
  assert.equal(html.match(/name="description" content="([^"]*)"/)[1],old.description,file+' control description');
 }
 const article=h=>h.match(/<article\b[\s\S]*?<\/article>/)?.[0];
 assert.ok(article(html),file+' article');
 // Only the headline may change inside the food article. Feeding advice,
 // evidence, sources, and safety labels must remain identical.
 assert.equal(createHash('sha256').update(article(html).replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/,'')).digest('hex'),old.articleHash,file+' feeding content');
}
console.log('Verified 3 Korean title/description experiments, English and 2 controls, and unchanged feeding articles.');
