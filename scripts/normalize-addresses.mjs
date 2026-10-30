import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {finalAddress} from '../docs/addresses.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
let changed=0,checked=0;
for(const dir of ['docs','site-static'])for(const relative of readdirSync(resolve(root,dir),{recursive:true})){
 if(!relative.endsWith('.html'))continue;
 const path=resolve(root,dir,relative);let s=readFileSync(path,'utf8');const previous=s;
 const english=s.includes('<html lang="en"');
 s=s.replace(/<header\b[\s\S]*?<\/header>/,header=>header.replace(/<a\b[^>]*>(?:검증 원칙|Our (?:approach|method))<\/a>/g,`<a data-nav="age" href="${english?'/guides/pet-age-calculator-en/':'/guides/pet-age-calculator/'}">${english?'Pet age calculator':'동물 나이 계산기'}</a>`));
 s=s.replace(/<header\b[\s\S]*?<\/header>/,header=>header.replace(/<a\b(?=[^>]*data-nav="age")[^>]*>[\s\S]*?<\/a>/g,`<a data-nav="age" href="${english?'/guides/pet-age-calculator-en/':'/guides/pet-age-calculator/'}">${english?'Pet age calculator':'동물 나이 계산기'}</a>`));
 s=s.replace(/app\.js\?v=\d+/g,'app.js?v=9');
 s=s.replace(/href=(["'])([^"']+)\1/g,(all,q,url)=>`href=${q}${finalAddress(url)}${q}`)
 .replace(/(property="og:url" content=")([^"]+)(")/g,(_,a,url,b)=>a+finalAddress(url)+b)
 .replace(/editorial\.js\?v=\d+/g,'editorial.js?v=16').replace(/editorial\.css\?v=\d+/g,'editorial.css?v=7');
 const aboutLink=`<a data-about-link="1" href="${s.includes('<html lang="en"')?'/guides/about-petnyam-en/':'/guides/about-petnyam/'}">${s.includes('<html lang="en"')?'About &amp; editorial process':'운영·작성 기준'}</a>`;
 if(s.includes('data-about-link="1"'))s=s.replace(/<a data-about-link="1"[^>]*>[\s\S]*?<\/a>/g,aboutLink);
 else s=s.replace(/<\/footer>/,aboutLink+'</footer>');
 if(s!==previous){writeFileSync(path,s);changed++;}
 checked++;
}
const sitemap=resolve(root,'docs/sitemap.xml');let xml=readFileSync(sitemap,'utf8');
xml=xml.replace(/<loc>([^<]+)<\/loc>/g,(_,url)=>`<loc>${finalAddress(url)}</loc>`);writeFileSync(sitemap,xml);
console.log(`Normalized final addresses in ${checked} HTML pages (${changed} changed).`);
