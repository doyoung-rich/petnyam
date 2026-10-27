import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {apiFetch,normalizeServiceKey} from './check-animal-api.mjs';
import {safePhoto,rescuePanel} from '../docs/rescue-home.js';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const text=(value,max=100)=>String(value??'').replace(/[\u0000-\u001f]/g,'').slice(0,max);
const date=value=>/^\d{8}$/.test(String(value))?String(value).replace(/^(\d{4})(\d{2})(\d{2})$/,'$1-$2-$3'):'';
// Public notice fields only. Official legacy photo URLs are upgraded to HTTPS.
// No owner names, contact numbers, RFID or animal registration IDs.
export function publicAnimal(item){return {notice:text(item.noticeNo,50),kind:text(item.kindFullNm||item.kindNm||item.kindCd),region:text(item.orgNm),foundDate:date(item.happenDt),age:text(item.age,50),status:text(item.processState,40),photo:safePhoto(item.popfile1||item.popfile||item.filename)};}
export async function syncRescueAnimals(env=process.env,fetcher=apiFetch){
 const key=normalizeServiceKey(env.ANIMAL_RESCUE_API_KEY||env.ANIMAL_GO_KR_API_KEY);if(!key)throw Error('Rescue credential missing');
 const url=new URL('https://apis.data.go.kr/1543061/abandonmentPublicService_v2/abandonmentPublic_v2');
 url.search=new URLSearchParams({serviceKey:key,_type:'json',numOfRows:'100',pageNo:'1'}).toString();
 const response=await fetcher(url,{signal:AbortSignal.timeout(45000)});if(!response.ok)throw Error('Rescue provider HTTP failure');
 let data;try{data=JSON.parse(await response.text());}catch{throw Error('Invalid provider format');}
 if(!['00','0'].includes(String(data.response?.header?.resultCode)))throw Error('Rescue provider did not return success');
 const rows=data.response?.body?.items?.item;const items=(Array.isArray(rows)?rows:rows?[rows]:[]).map(publicAnimal).filter(i=>i.notice&&i.region);
 if(!items.length)throw Error('No usable public notices; retaining previous snapshot');
 const snapshot={schemaVersion:1,updatedAt:new Date().toISOString(),scope:'First page of up to 100 recent public rescue notices; not nationwide totals or owner-submitted missing reports.',items};
 await mkdir(join(root,'docs/data'),{recursive:true});await writeFile(join(root,'docs/data/rescue-animals.json'),JSON.stringify(snapshot,null,2)+'\n');
 for(const [path,english] of [['index.html',false],['en/index.html',true]]){
  const file=join(root,'docs',path),html=await readFile(file,'utf8');
  const updated=html.replace(/<div class="visual rescue-visual">[\s\S]*?<\/section><\/div>/,`<div class="visual rescue-visual">${rescuePanel(english,snapshot)}</div>`);
  if(updated===html&&!html.includes('data-rescue-panel'))throw Error('Homepage panel missing');
  await writeFile(file,updated);
 }
 console.log(JSON.stringify({status:'success',count:items.length,photos:items.filter(i=>i.photo).length,updatedAt:snapshot.updatedAt}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){try{await syncRescueAnimals();}catch{console.error('Public rescue refresh failed; previous snapshot retained. No credentials or raw response logged.');process.exitCode=1;}}
