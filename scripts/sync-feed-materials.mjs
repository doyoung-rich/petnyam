import {request} from 'node:https';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {normalizeServiceKey} from './check-animal-api.mjs';
const output=new URL('../docs/data/feed-materials.json',import.meta.url);
const decode=s=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const v=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return v>0&&v<=0x10ffff?String.fromCodePoint(v):'';}).replace(/&(amp|lt|gt|quot|apos);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[n]));
const tag=(xml,name)=>decode(xml.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+name+'>'))?.[1]||'').trim();
export const fields=['feedSeqNo','feedNm','feedClCodeNm','upperFeedClCode','originNm','dryMatter','mitrQy','protQy','fatQy','crbQy','crfbQy','ashsQy','clciQy','phphQy','naQy','ptssQy'];
export function parseMaterials(xml){
 if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('unsupported-xml');
 const code=tag(xml,'resultCode');if(!['00','0'].includes(code))throw Error('provider-rejected');
 const items=[...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/g)].map(m=>Object.fromEntries(fields.map(f=>[f,tag(m[1],f).replace(/[\u0000-\u001f]/g,'').slice(0,250)]))).filter(i=>i.feedSeqNo&&i.feedNm);
 if(!items.length)throw Error('no-usable-data');
 if(new Set(items.map(i=>i.feedSeqNo)).size!==items.length)throw Error('duplicate-identifiers');
 return items;
}
function fetchXml(url){return new Promise((resolve,reject)=>{
 const req=request(url,{family:4,signal:AbortSignal.timeout(60000),headers:{accept:'application/xml'}},res=>{const chunks=[];let size=0;res.on('data',c=>{size+=c.length;if(size>8000000)req.destroy(Error('response-limit'));else chunks.push(c);});res.on('end',()=>res.statusCode===200?resolve(Buffer.concat(chunks).toString('utf8')):reject(Error('http-'+res.statusCode)));res.on('error',reject);});req.on('error',reject);req.end();
});}
export async function syncFeedMaterials(env=process.env,fetcher=fetchXml){
 const key=normalizeServiceKey(env.NONGSARO_FEED_API_KEY);if(!key)throw Error('missing-secret');
 const url=new URL('https://api.nongsaro.go.kr/service/feedRawMaterial/feedRawMaterialAllList');url.searchParams.set('apiKey',key);
 const items=parseMaterials(await fetcher(url));
 if(JSON.stringify(items).includes(key))throw Error('unexpected-credential-in-response');
 const snapshot={schemaVersion:1,updatedAt:new Date().toISOString(),source:'농촌진흥청 농사로 · 반려동물 집밥원료',sourceUrl:'https://www.data.go.kr/data/15059270/openapi.do',scope:'Raw ingredient composition, not commercial feed products, safety certification or a feeding prescription. Values retained as provided; blanks are not zero.',items};
 await mkdir(new URL('../docs/data/',import.meta.url),{recursive:true});await writeFile(output,JSON.stringify(snapshot,null,2)+'\n');
 console.log(JSON.stringify({status:'success',count:items.length,updatedAt:snapshot.updatedAt}));return snapshot;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){try{await syncFeedMaterials();}catch(e){const reason=['missing-secret','provider-rejected','no-usable-data','duplicate-identifiers','unsupported-xml','response-limit'].includes(e.message)?e.message:/^http-\d{3}$/.test(e.message)?e.message:'connection-or-format-failure';console.error(JSON.stringify({status:'failed',reason,retainedPreviousSnapshot:true}));process.exitCode=1;}}
