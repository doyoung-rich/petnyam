import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {finalAddress} from '../docs/addresses.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
let changed=0,checked=0;
for(const dir of ['docs','site-static'])for(const relative of readdirSync(resolve(root,dir),{recursive:true})){
 if(!relative.endsWith('.html'))continue;
 const path=resolve(root,dir,relative);let s=readFileSync(path,'utf8');const previous=s;
 s=s.replace(/href=(["'])([^"']+)\1/g,(all,q,url)=>`href=${q}${finalAddress(url)}${q}`)
 .replace(/(property="og:url" content=")([^"]+)(")/g,(_,a,url,b)=>a+finalAddress(url)+b)
 .replace(/editorial\.js\?v=\d+/g,'editorial.js?v=6');
 if(s!==previous){writeFileSync(path,s);changed++;}
 checked++;
}
const sitemap=resolve(root,'docs/sitemap.xml');let xml=readFileSync(sitemap,'utf8');
xml=xml.replace(/<loc>([^<]+)<\/loc>/g,(_,url)=>`<loc>${finalAddress(url)}</loc>`);writeFileSync(sitemap,xml);
console.log(`Normalized final addresses in ${checked} HTML pages (${changed} changed).`);
