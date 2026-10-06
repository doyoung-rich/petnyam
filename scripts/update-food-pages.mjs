import {readFile,writeFile} from 'node:fs/promises';
import {foodCatalog,petCatalog} from '../docs/food-page-catalog.js';
import {foodPageInner,foodPageMeta} from '../docs/food-page-content.js';
const docs=new URL('../docs/',import.meta.url);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tidy=html=>html.replace(/\r\n?/g,'\n').replace(/[ \t]+$/gm,'').trimEnd()+'\n';
let count=0;
for(const lang of ['ko','en'])for(const pet of Object.keys(petCatalog))for(const food of foodCatalog){
 const key=pet+'/'+food.slug, file=new URL(lang+'/'+key+'/index.html',docs), meta=foodPageMeta(key,lang==='en');
 let html=await readFile(file,'utf8');
 html=html.replace(/<main id="app">[\s\S]*?<\/main>/,`<main id="app"><section class="detail food-detail">${foodPageInner(key,lang==='en')}</section></main>`)
  .replace(/<title>[^<]*<\/title>/,`<title>${esc(meta.title)}</title>`)
  .replace(/(name="description"|property="og:description") content="[^"]*"/g,`$1 content="${esc(meta.description)}"`)
  .replace(/property="og:title" content="[^"]*"/,`property="og:title" content="${esc(meta.title)}"`)
  .replace(/editorial\.js\?v=\d+/g,'editorial.js?v=8').replace(/editorial\.css\?v=\d+/g,'editorial.css?v=2')
  .replace(/app\.js\?v=\d+/g,'app.js?v=8').replace(/convenience\.js\?v=\d+/g,'convenience.js?v=7');
 await writeFile(file,tidy(html));count++;
}
for(const name of ['index.html','en/index.html','404.html']){
 const file=new URL(name,docs);let html=await readFile(file,'utf8');
 html=html.replace(/editorial\.js\?v=\d+/g,'editorial.js?v=8').replace(/editorial\.css\?v=\d+/g,'editorial.css?v=2')
  .replace(/app\.js\?v=\d+/g,'app.js?v=8').replace(/convenience\.js\?v=\d+/g,'convenience.js?v=7');
 if(name==='en/index.html')html=html.replace('<html lang="ko"','<html lang="en"');
 await writeFile(file,tidy(html));
}
const sitemapFile=new URL('sitemap.xml',docs);
let sitemap=await readFile(sitemapFile,'utf8');
sitemap=sitemap.replace(/(<url><loc>https:\/\/petnyam\.com\/(?:ko|en)\/(?:dog|cat|rabbit|hamster|parrot)\/[^<]+<\/loc>)(?:<lastmod>[^<]*<\/lastmod>)?/g,'$1<lastmod>2026-10-07</lastmod>');
await writeFile(sitemapFile,sitemap);
console.log(`Prepared plain-language decisions and explanations for ${count} food pages.`);
