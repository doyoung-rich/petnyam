import {readFileSync,writeFileSync} from 'node:fs';
import {priorityContent,priorityArticle} from '../docs/priority-content.js';
export const updated=[];
for(const [key,r] of Object.entries(priorityContent))for(const lang of ['ko','en']){
 const path=`docs/${lang}/${key}/index.html`, c=r[lang], title=c[0]+' | PetNyam';
 let page=readFileSync(path,'utf8');
 page=page.replace(/<article[^>]*>[\s\S]*?<\/article>/,`<article data-editorial="1">${priorityArticle(key,lang==='en')}</article>`)
 .replace(/<title>[^<]*<\/title>/,`<title>${title}</title>`)
 .replace(/(name="description"|property="og:description") content="[^"]*"/g,`$1 content="${c[1]}"`)
 .replace(/property="og:title" content="[^"]*"/,`property="og:title" content="${title}"`)
 .replace(/<h1>[^<]*<\/h1>/,`<h1>${c[0]}</h1>`)
 .replace(/Reviewed Sep 2026|최종 검토 2026\.09/g,lang==='en'?'Sources checked Oct 2, 2026':'자료 확인 2026.10.02')
 .replace(/editorial\.js\?v=\d+/g,'editorial.js?v=4');
 writeFileSync(path,page);updated.push(path);
 if(!page.includes(c[1])||!page.includes('rel="canonical"'))throw Error(`Page validation failed: ${path}`);
}
for(const path of ['docs/index.html','docs/en/index.html','docs/404.html']){
 writeFileSync(path,readFileSync(path,'utf8').replace(/editorial\.js\?v=\d+/g,'editorial.js?v=4'));updated.push(path);
}
console.log(`Updated and checked ${updated.length} pages; 5 topics in two languages.`);
