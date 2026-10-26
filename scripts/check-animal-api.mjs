import {appendFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {request} from 'node:https';

// Explicit IPv4 avoids unavailable IPv6 routes on hosted runners; TLS verification stays on.
export function apiFetch(url,{signal}={}){
 return new Promise((resolve,reject)=>{
  const req=request(url,{family:4,signal,headers:{accept:'application/json'}},res=>{
   const chunks=[];let size=0;
   res.on('data',chunk=>{size+=chunk.length;if(size>2000000){req.destroy(Object.assign(new Error('response limit'),{code:'RESPONSE_TOO_LARGE'}));}else chunks.push(chunk);});
   res.on('end',()=>resolve({ok:res.statusCode>=200&&res.statusCode<300,status:res.statusCode,text:async()=>Buffer.concat(chunks).toString('utf8')}));
   res.on('error',reject);
  });
  req.on('error',reject);req.end();
 });
}

// Never log request URLs, keys, raw provider errors, or animal/owner records.
export function normalizeServiceKey(value){
 const key=String(value||'').trim();
 if(!key)return null;
 if(/\s|https?:\/\/|serviceKey=/i.test(key))throw new Error('invalid-key-format');
 try{return /%[0-9a-f]{2}/i.test(key)?decodeURIComponent(key):key;}catch{throw new Error('invalid-key-format');}
}
export function providerResult(text){
 let json;try{json=JSON.parse(text);}catch{}
 const header=json?.response?.header||json?.header;
 const xml=tag=>text.match(new RegExp('<'+tag+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+tag+'>','i'))?.[1]?.trim();
 const rawCode=String(header?.resultCode??xml('resultCode')??xml('returnReasonCode')??'');
 const code=/^[A-Z0-9_-]{1,12}$/i.test(rawCode)?rawCode:'unrecognized';
 const message=String(header?.resultMsg||header?.errorMsg||xml('returnAuthMsg')||xml('errMsg')||'');
 const rows=json?.response?.body?.items?.item??json?.body?.items?.item;
 const itemCount=rows?Array.isArray(rows)?rows.length:1:(text.match(/<item(?:\s[^>]*)?>/g)||[]).length;
 const authReason=['SERVICE_ACCESS_DENIED_ERROR','SERVICE_KEY_IS_NOT_REGISTERED_ERROR','DEADLINE_HAS_EXPIRED_ERROR','PERMISSION_DENIED','SERVICE_KEY_IS_NULL'].find(value=>text.includes(value));
 return {code,itemCount,authReason,parameterError:/PARAMETER|PARAM|필수|입력|등록번호|소유자/i.test(message),
  denied:/ACCESS_DENIED|PERMISSION_DENIED|NOT_REGISTERED|SERVICE_KEY|인증키|접근 권한/i.test(message)};
}
export async function checkOperation({label,path,key,params={},requiresIdentity=false},fetcher=apiFetch){
 let normalized;try{normalized=normalizeServiceKey(key);}catch{return {label,status:'invalid-key-format'};}
 if(!normalized)return {label,status:'missing-secret'};
 const url=new URL('https://apis.data.go.kr/1543061/'+path);
 url.searchParams.set('serviceKey',normalized);url.searchParams.set('_type','json');
 for(const [name,value] of Object.entries(params))url.searchParams.set(name,String(value));
 try{
  const response=await fetcher(url,{signal:AbortSignal.timeout(25000),redirect:'error'});
  const text=await response.text();
  if(text.length>2000000)return {label,status:'response-too-large'};
  const result=providerResult(text);
  if(result.denied||result.authReason||['20','22','23','29','30','31'].includes(result.code))return {label,status:'provider-rejected',http:response.status,code:result.code,reason:result.authReason};
  if(!response.ok)return {label,status:'http-error',http:response.status};
  if(['00','0','NORMAL_CODE','NORMAL_SERVICE'].includes(result.code))return {label,status:'success',code:result.code,itemCount:requiresIdentity?undefined:result.itemCount,scope:requiresIdentity?'No owner identity supplied; no ownership verification performed.':undefined};
  if(requiresIdentity&&result.parameterError)return {label,status:'identity-required',code:result.code,scope:'Provider requests identity fields. Real registration lookup and ownership were not verified.'};
  return {label,status:'provider-response',code:result.code};
 }catch(error){
  const raw=String(error?.cause?.code||error?.code||error?.name||'unknown');
  const reason=['TimeoutError','AbortError'].includes(error?.name)||raw==='ABORT_ERR'?'timeout':/^[A-Z0-9_]{1,60}$/i.test(raw)?raw:'unknown';
  return {label,status:'connection-failed',reason};
 }
}
export function animalOperations(env=process.env){
 return [
  {label:'등록 API · 필수 입력 확인',path:'animalInfoSrvc_v3/animalInfo_v3',key:env.ANIMAL_REGISTER_API_KEY,requiresIdentity:true},
  {label:'구조 API · 시도 목록',path:'abandonmentPublicService_v2/sido_v2',key:env.ANIMAL_RESCUE_API_KEY||env.ANIMAL_GO_KR_API_KEY,params:{numOfRows:30,pageNo:1}}
 ];
}
export async function runAnimalChecks(env=process.env){
 const operations=animalOperations(env);
 const results=[];for(const operation of operations)results.push(await checkOperation(operation));
 const report={checkedAt:new Date().toISOString(),results,notice:'Only sanitized status and counts. No service keys, raw responses, owner names, phone numbers or registration IDs are logged or saved.'};
 await writeFile('animal-api-health.json',JSON.stringify(report,null,2)+'\n');
 if(env.GITHUB_STEP_SUMMARY)await appendFile(env.GITHUB_STEP_SUMMARY,'## Animal API connection checks\n\n|API|Status|Code|Returned items|\n|---|---|---|---|\n'+results.map(r=>`|${r.label}|${r.status}|${r.code||r.http||''}|${r.itemCount??''}|`).join('\n')+'\n\nRegistration lookup was not performed with real owner identity.\n');
 console.log(JSON.stringify(report));
 if(results.some(result=>!['success','identity-required'].includes(result.status)))process.exitCode=1;
 return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await runAnimalChecks();
