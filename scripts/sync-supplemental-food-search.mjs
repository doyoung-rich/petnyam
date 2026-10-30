import {readFile,writeFile} from 'node:fs/promises';
import {extraFoodEntries} from '../docs/extra-food-index.js';
for(const file of ['docs/convenience.js','site-static/convenience.js']){const url=new URL('../'+file,import.meta.url),source=await readFile(url,'utf8');if(!source.startsWith('const supplementalFoodArticles='))throw Error('Missing supplemental search block');await writeFile(url,source.replace(/^const supplementalFoodArticles=.*?;\r?\n/,()=>`const supplementalFoodArticles=${JSON.stringify(extraFoodEntries)};\n`));}
const snapshot=JSON.parse(await readFile(new URL('../docs/data/feed-materials.json',import.meta.url),'utf8'));
const ids=['1101','1100','1103','1192','1196','1198','1197','1193','1295','1195'];
const items=ids.map(id=>snapshot.items.find(i=>i.feedSeqNo===id));if(items.some(i=>!i))throw Error('Missing referenced meat ingredient');
await writeFile(new URL('../docs/meat-material-reference.js',import.meta.url),'// Public Nongsaro fields only; source values retained.\nexport const meatMaterialReference='+JSON.stringify({updatedAt:snapshot.updatedAt,items},null,2)+';\n');
