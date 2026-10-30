import {readFile,writeFile,readdir} from 'node:fs/promises';
import {shoppingGroups} from '../site-static/affiliate-catalog.js';
const root=new URL('../',import.meta.url),docs=new URL('docs/',root);
const settings=JSON.parse(await readFile(new URL('site-static/affiliate-settings.json',root),'utf8'));
if(typeof settings.enabled!=='boolean')throw Error('Affiliate display setting must be boolean');
const active=settings.enabled;
const block=`// AFFILIATE_DISPLAY_CONFIG_START\nconst affiliateDisplayEnabled=${active};\nconst shoppingGroups=${JSON.stringify(active?shoppingGroups:{coupang:[],amazon:[]})};\n// AFFILIATE_DISPLAY_CONFIG_END`;
for(const file of ['docs/convenience.js','site-static/convenience.js']){
 const path=new URL(file,root),source=await readFile(path,'utf8');
 if(!source.includes('// AFFILIATE_DISPLAY_CONFIG_START'))throw Error(`Missing affiliate settings block in ${file}`);
 await writeFile(path,source.replace(/\/\/ AFFILIATE_DISPLAY_CONFIG_START[\s\S]*?\/\/ AFFILIATE_DISPLAY_CONFIG_END/,()=>block));
}
if(!active)await writeFile(new URL('coupang-products.json',docs),JSON.stringify({affiliateDisplay:'paused',products:[]},null,2)+'\n');
let updated=0;
for(const file of await readdir(docs,{recursive:true})){
 if(!file.endsWith('.html'))continue;
 const path=new URL(file.replaceAll('\\','/'),docs),source=await readFile(path,'utf8');
 const html=source.replace(/convenience\.js\?v=\d+/g,'convenience.js?v=10');
 if(source!==html){await writeFile(path,html);updated++;}
}
console.log(`Affiliate shopping ${active?'enabled':'paused for all visitors'}; refreshed ${updated} script references.`);
