import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {finalAddress} from '../docs/addresses.js';
const docs=resolve(dirname(fileURLToPath(import.meta.url)),'../docs');let count=0;
for(const relative of readdirSync(docs,{recursive:true})){
 if(!relative.endsWith('.html'))continue;const html=readFileSync(resolve(docs,relative),'utf8');
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];
 if(!canonical)continue;
 if(canonical!==finalAddress(canonical))throw Error(`Non-final canonical: ${relative}`);
 for(const [,value] of html.matchAll(/href="([^"]+)"/g))if(value!==finalAddress(value))throw Error(`Non-final link in ${relative}: ${value}`);
 count++;
}
const xml=readFileSync(resolve(docs,'sitemap.xml'),'utf8');
for(const [,url] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){
 if(url!==finalAddress(url))throw Error(`Non-final sitemap URL: ${url}`);
 const path=new URL(url).pathname;
 if(!existsSync(resolve(docs,'.'+path,'index.html')))throw Error(`Missing sitemap page: ${url}`);
}
console.log(`Final canonical, internal links and sitemap verified across ${count} pages.`);
