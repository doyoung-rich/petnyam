import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {priorityContent} from '../docs/priority-content.js';
const docs=resolve(dirname(fileURLToPath(import.meta.url)),'../docs');let count=0,limited=0;
for(const relative of readdirSync(docs,{recursive:true})){
 if(!relative.endsWith('.html')||relative==='404.html')continue;
 const html=readFileSync(resolve(docs,relative),'utf8'),canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];if(!canonical)continue;
 if(!/<h1[ >]/.test(html))throw Error(`Missing H1: ${relative}`);
 if(!/name="description" content="[^"\s]/.test(html))throw Error(`Missing description: ${relative}`);
 if(/name="robots" content="[^"]*noindex/.test(html))throw Error(`Unexpected noindex: ${relative}`);
 const raw=html.match(/id="petnyam-search-metadata">([\s\S]*?)<\/script>/)?.[1];
 const graph=JSON.parse(raw)['@graph'];const page=graph.find(n=>n['@id']===canonical+'#page');
 if(!page||page.url!==canonical)throw Error(`Schema URL mismatch: ${relative}`);
 const plain=html.replace(/<script[\s\S]*?<\/script>/g,'');
 for(const faq of graph.filter(n=>n['@type']==='FAQPage'))for(const q of faq.mainEntity){if(!plain.includes(q.name)||!plain.includes(q.acceptedAnswer.text))throw Error(`FAQ not visible: ${relative}`);}
 if(plain.includes('상세 근거 설명이 아직 충분하지')||plain.includes('has not yet been established'))limited++;
 count++;
}
for(const [key,r] of Object.entries(priorityContent))for(const lang of ['ko','en']){
 const html=readFileSync(resolve(docs,lang,key,'index.html'),'utf8');
 if(!html.includes(r[lang][1])||!r.sources.every(([,url])=>html.includes(url)))throw Error(`Missing source or answer: ${lang}/${key}`);
}
console.log(JSON.stringify({checkedPages:count,detailedBilingualTopics:Object.keys(priorityContent).length,pagesStillNeedingSpecificEvidence:limited,note:'Technical checks passed; this is not a ranking or AI-citation score.'}));
