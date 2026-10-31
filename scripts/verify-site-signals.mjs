import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {rescueCards} from '../docs/rescue-home.js';
import {featureArticles} from '../docs/feature-articles.js';
const docs=new URL('../docs/',import.meta.url),origin='https://petnyam.com';
const pages=new Map();
for(const f of (await readdir(docs,{recursive:true})).filter(f=>f.endsWith('.html')&&f!=='404.html')){
 const h=await readFile(new URL(f.replaceAll('\\','/'),docs),'utf8');
 const url=h.match(/rel="canonical" href="([^"]+)"/)?.[1];if(url)pages.set(url,h);
}
let paired=0,images=0;
for(const [url,h]of pages){
 const english=h.includes('<html lang="en"');
 assert.equal((h.match(/property="og:site_name"/g)||[]).length,1,url);
 assert.ok(h.includes(`property="og:locale" content="${english?'en_US':'ko_KR'}"`),url);
 assert.ok(h.includes('type="application/rss+xml"'),url);
 const graph=JSON.parse(h.match(/id="petnyam-search-metadata">([\s\S]*?)<\/script>/)[1])['@graph'];
 const organization=graph.find(n=>n['@type']==='Organization'),site=graph.find(n=>n['@type']==='WebSite');
 assert.equal(organization.name,'PetNyam');assert.equal(organization.alternateName,'펫냠');
 assert.equal(organization.logo.url,origin+'/logo.svg');assert.ok(site.alternateName.includes('펫냠'));
 const links=[...h.matchAll(/<link\b[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"[^>]*>/g)].map(m=>[m[1],m[2]]);
 assert.equal(new Set(links.map(([lang])=>lang)).size,links.length,url);
 for(const [lang,target]of links){
  const other=pages.get(target);assert.ok(other,`${url}: missing ${target}`);
  if(lang==='x-default')continue;
  assert.ok(other.includes(`<link rel="alternate" hreflang="${english?'en':'ko'}" href="${url}">`),`${url}: nonreciprocal ${target}`);
 }
 if(links.length)paired++;
 for(const tag of h.match(/<img\b[^>]*>/g)||[]){assert.ok(/\bwidth="\d+"/.test(tag)&&/\bheight="\d+"/.test(tag),url+': missing dimensions');images++;}
}
for(const url of [origin+'/',origin+'/en/']){const h=pages.get(url);for(const [lang,path]of [['ko','/'],['en','/en/'],['x-default','/']])assert.ok(h.includes(`hreflang="${lang}" href="${origin}${path}"`));}
const rendered=rescueCards([{photo:'https://www.animal.go.kr/photo.jpg',kind:'Dog'}]);assert.ok(rendered.includes('width="240" height="190"'));
for(const lang of ['ko','en']){
 const file=lang==='en'?'rss-en.xml':'rss.xml',rss=await readFile(new URL(file,docs),'utf8');
 assert.ok(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));assert.ok(rss.includes(`<language>${lang}</language>`));
 assert.ok(rss.includes(`atom:link href="${origin}/${file}"`));
 const items=[...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>m[1]);
 assert.equal(items.length,Object.values(featureArticles).filter(a=>a.lang===lang&&a.published).length);
 const seen=new Set();let previous=Infinity;
 for(const item of items){const url=item.match(/<link>([^<]+)<\/link>/)[1],date=Date.parse(item.match(/<pubDate>([^<]+)<\/pubDate>/)[1]);assert.ok(pages.has(url));assert.ok(!seen.has(url));seen.add(url);assert.ok(date<=previous);previous=date;assert.equal(featureArticles[new URL(url).pathname].lang,lang);}
 assert.ok(seen.has(origin+`/guides/halloween-pet-safety${lang==='en'?'-en':''}/`));
}
await access(new URL('logo.svg',docs));
console.log(`Site signals verified: ${pages.size} canonical pages, ${paired} pages with reciprocal language links, ${images} dimensioned images, brand/logo data and two dated RSS feeds.`);
