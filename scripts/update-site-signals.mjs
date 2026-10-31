import {readFile,writeFile,readdir,access} from 'node:fs/promises';
import {featureArticles} from '../docs/feature-articles.js';
import {languagePair} from '../docs/site-signals.js';
const docs=new URL('../docs/',import.meta.url),origin='https://petnyam.com';
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
for(const file of (await readdir(docs,{recursive:true})).filter(f=>f.endsWith('.html'))){
 const target=new URL(file.replaceAll('\\','/'),docs);let html=await readFile(target,'utf8');
 if(file==='404.html')continue;
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];if(!canonical)continue;
 const path=new URL(canonical).pathname,english=html.includes('<html lang="en"'),pair=languagePair(path);
 html=html.replace(/<meta\b[^>]*property="og:(?:site_name|locale(?::alternate)?)"[^>]*>/g,'')
  .replace(/<link\b[^>]*hreflang="[^"]*"[^>]*>/g,'');
 let tags=`<meta property="og:site_name" content="PetNyam 펫냠"><meta property="og:locale" content="${english?'en_US':'ko_KR'}">`;
 if(pair){
  for(const route of Object.values(pair))await access(new URL('.'+route+'index.html',docs));
  tags+=Object.entries({...pair,'x-default':pair.ko}).map(([language,route])=>`<link rel="alternate" hreflang="${language}" href="${origin}${route}">`).join('');
  tags+=`<meta property="og:locale:alternate" content="${english?'ko_KR':'en_US'}">`;
 }
 html=html.replace(/<link\b[^>]*type="application\/rss\+xml"[^>]*>/g,'');
 tags+=`<link rel="alternate" type="application/rss+xml" title="${english?'PetNyam English guides':'펫냠 새 정보 글'}" href="${origin}/${english?'rss-en.xml':'rss.xml'}">`;
 html=html.replace('</head>',tags+'</head>');
 const link=`<a data-rss-link="1" href="/${english?'rss-en.xml':'rss.xml'}">${english?'Latest guides RSS':'새 글 RSS'}</a>`;
 html=html.replace(/<a data-rss-link="1"[^>]*>[\s\S]*?<\/a>/g,'').replace('</footer>',link+'</footer>');
 await writeFile(target,html);
}
for(const language of ['ko','en']){
 const feed=language==='en'?'rss-en.xml':'rss.xml';
 // Only articles with a declared publication date enter the feed. Food matrices
 // and undated legacy guides are not presented as newly published stories.
 const items=Object.entries(featureArticles).filter(([,a])=>a.lang===language&&/^\d{4}-\d{2}-\d{2}$/.test(a.published||''))
  .sort(([p,a],[q,b])=>b.published.localeCompare(a.published)||p.localeCompare(q));
 const latest=items.map(([,a])=>a.modified||a.published).sort().at(-1);
 const rss=`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${language==='en'?'PetNyam — Latest guides':'펫냠 — 새 정보 글'}</title><link>${origin}/${language==='en'?'en/':''}</link><description>${language==='en'?'Pet food questions, safety guides and life with animals.':'반려동물 음식·안전 정보와 함께 알아가는 반려생활.'}</description><language>${language}</language><atom:link href="${origin}/${feed}" rel="self" type="application/rss+xml"/>${latest?`<lastBuildDate>${new Date(latest+'T00:00:00Z').toUTCString()}</lastBuildDate>`:''}${items.map(([path,a])=>`<item><title>${xml(a.title)}</title><link>${origin}${path}</link><guid isPermaLink="true">${origin}${path}</guid><description>${xml(a.description)}</description><pubDate>${new Date(a.published+'T00:00:00Z').toUTCString()}</pubDate></item>`).join('')}</channel></rss>\n`;
 await writeFile(new URL(feed,docs),rss);
 console.log(`Prepared ${feed}: ${items.length} dated ${language} articles.`);
}
console.log('Updated reciprocal language links, Open Graph site details and RSS discovery.');
