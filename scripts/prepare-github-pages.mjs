import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root=new URL('..',import.meta.url).pathname.replace(/^\/(.:)/,'$1');
const source=join(root,'site-static');
const docs=join(root,'docs');
await rm(docs,{recursive:true,force:true});
await mkdir(docs,{recursive:true});
await cp(source,docs,{recursive:true});

let html=await readFile(join(docs,'index.html'),'utf8');
html=html.replaceAll('href="/','href="/petnyam/').replaceAll('src="/','src="/petnyam/');
html=html.replace('https://petnyam-v1.jungdo63.chatgpt.site/','https://doyoung-rich.github.io/petnyam/');
await writeFile(join(docs,'index.html'),html);
await writeFile(join(docs,'404.html'),html);

let app=await readFile(join(docs,'app.js'),'utf8');
app=app.replace("function route(){const p=location.pathname.split('/').filter(Boolean);","function route(){let p=location.pathname.split('/').filter(Boolean);if(p[0]==='petnyam')p=p.slice(1);");
app=app.replace("function go(url){history.pushState({},'',url);","function go(url){if(location.hostname.endsWith('github.io')&&url.startsWith('/')&&!url.startsWith('/petnyam/'))url='/petnyam'+url;history.pushState({},'',url);");
await writeFile(join(docs,'app.js'),app);

let css=await readFile(join(docs,'style.css'),'utf8');
css=css.replace("url('/petnyam-hero.png')","url('/petnyam/petnyam-hero.png')");
await writeFile(join(docs,'style.css'),css);

const convenience=await readFile(join(docs,'convenience.js'),'utf8');
const foods=[...(app+'\n'+convenience).matchAll(/\['([^']+)','([^']+)','([^']+)'/g)].map(m=>m[1]);
const uniqueFoods=[...new Set(foods)].slice(0,50);
const pets=['dog','cat','rabbit','hamster','parrot'];
const origin='https://doyoung-rich.github.io/petnyam';
const urls=[origin+'/',...['ko','en'].flatMap(lang=>pets.flatMap(pet=>uniqueFoods.map(food=>`${origin}/${lang}/${pet}/${food}`)))];
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>`<url><loc>${url}</loc><changefreq>monthly</changefreq></url>`).join('')+'</urlset>\n';
await writeFile(join(docs,'sitemap.xml'),sitemap);
await writeFile(join(docs,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(join(docs,'.nojekyll'),'');
console.log(`Prepared GitHub Pages with ${urls.length-1} searchable result URLs.`);
