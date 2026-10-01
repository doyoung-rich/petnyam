import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pageGraph,evidenceOverview} from '../docs/search-metadata.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
let count=0;
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
for(const relative of readdirSync(resolve(root,'docs'),{recursive:true})){
 if(!relative.endsWith('.html')||relative==='404.html')continue;
 const path=resolve(root,'docs',relative);let html=readFileSync(path,'utf8');
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];if(!canonical)continue;
 const limited=html.includes('상세 근거 설명이 아직 충분하지')||html.includes('has not yet been established');
 if(limited){
  const english=html.includes('<html lang="en"');
  const notice=english?'Legacy classification; detailed species-specific evidence is incomplete. Not verified feeding advice.':'기존 데이터 분류 · 동물종별 상세 근거 보강 필요 · 개별 급여의 안전 보증 아님';
  html=html.replace(/Reviewed Sep 2026|최종 검토 2026\.09/g,notice);
  html=html.replace(/(name="description"|property="og:description") content="([^"]*)"/g,(_,attribute,text)=>`${attribute} content="${text.replace(/, and reviewed sources\./, '. Detailed evidence for this combination is incomplete.').replace(/, 검토 출처를 확인하세요\./,'. 이 조합의 상세 근거는 보강 중입니다.')}"`);
 }
 const title=decode(html.match(/<title>([^<]+)<\/title>/)?.[1]||'');
 const description=decode(html.match(/name="description" content="([^"]*)"/)?.[1]||'');
 const lang=html.match(/<html lang="([^"]+)"/)?.[1]||'ko';
 const json=JSON.stringify(pageGraph(canonical,title,description,lang)).replace(/</g,'\\u003c');
 if(relative==='index.html'||relative.replaceAll('\\','/')==='en/index.html'){
  html=html.replace(/<section class="section" data-search-overview="1">[\s\S]*?<\/section>/g,'');
  html=html.replace('</main>',evidenceOverview(lang==='en')+'</main>');
 }
 html=html.replace(/<script[^>]*id="petnyam-search-metadata"[^>]*>[\s\S]*?<\/script>/g,'');
 html=html.replace('</head>',`<script type="application/ld+json" id="petnyam-search-metadata">${json}</script></head>`);
 writeFileSync(path,html);count++;
}
console.log(`Added body-aligned search metadata to ${count} canonical pages (excluding 404).`);
