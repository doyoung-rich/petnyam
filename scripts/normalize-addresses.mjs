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
 .replace(/editorial\.js\?v=\d+/g,'editorial.js?v=10').replace(/editorial\.css\?v=\d+/g,'editorial.css?v=3');
 const aboutLink=`<a data-about-link="1" href="${s.includes('<html lang="en"')?'/guides/about-petnyam-en/':'/guides/about-petnyam/'}">${s.includes('<html lang="en"')?'About &amp; editorial process':'운영·작성 기준'}</a>`;
 if(s.includes('data-about-link="1"'))s=s.replace(/<a data-about-link="1"[^>]*>[\s\S]*?<\/a>/g,aboutLink);
 else s=s.replace(/<\/footer>/,aboutLink+'</footer>');
 if(s!==previous){writeFileSync(path,s);changed++;}
 checked++;
}
const sitemap=resolve(root,'docs/sitemap.xml');let xml=readFileSync(sitemap,'utf8');
xml=xml.replace(/<loc>([^<]+)<\/loc>/g,(_,url)=>`<loc>${finalAddress(url)}</loc>`);writeFileSync(sitemap,xml);
console.log(`Normalized final addresses in ${checked} HTML pages (${changed} changed).`);
