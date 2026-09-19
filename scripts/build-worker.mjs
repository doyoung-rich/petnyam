import { readFile, readdir, mkdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root=new URL('..',import.meta.url).pathname.replace(/^\/(.:)/,'$1');
const source=join(root,'site-static');
const output=join(root,'dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
await rm(output,{recursive:true,force:true});
await mkdir(join(output,'server'),{recursive:true});
await mkdir(join(output,'.openai'),{recursive:true});
const files={};
for(const name of await readdir(source)){
 const data=await readFile(join(source,name));
 files['/'+name]={type:mime[extname(name)]||'application/octet-stream',body:data.toString('base64')};
}
files['/']=files['/index.html'];
const worker=`const files=${JSON.stringify(files)};
const fallbackLinks=${JSON.stringify([
 'https://link.coupang.com/a/g9Q1lG65y8','https://link.coupang.com/a/g9Q4suqYc8','https://link.coupang.com/a/g9Q5FjzTDE','https://link.coupang.com/a/g9Q68seDZY','https://link.coupang.com/a/g9Q8uAbbqe','https://link.coupang.com/a/g9Q9GJ928y','https://link.coupang.com/a/g9RaXRhBhl','https://link.coupang.com/a/g9RcpUwnkq','https://link.coupang.com/a/g9RdKJhDye','https://link.coupang.com/a/g9RfB7d0Me'
])};
const encoder=new TextEncoder();
function bytes(base64){const raw=atob(base64);return Uint8Array.from(raw,c=>c.charCodeAt(0))}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=900'}})}
async function coupang(env){
 if(!env.COUPANG_ACCESS_KEY||!env.COUPANG_SECRET_KEY)return json({error:'Coupang credentials unavailable'},503);
 const method='GET',path='/v2/providers/affiliate_open_api/apis/openapi/products/search',query='keyword='+encodeURIComponent('반려동물 용품')+'&limit=10';
 const now=new Date(),datetime=String(now.getUTCFullYear()).slice(2)+String(now.getUTCMonth()+1).padStart(2,'0')+String(now.getUTCDate()).padStart(2,'0')+'T'+String(now.getUTCHours()).padStart(2,'0')+String(now.getUTCMinutes()).padStart(2,'0')+String(now.getUTCSeconds()).padStart(2,'0')+'Z';
 const key=await crypto.subtle.importKey('raw',encoder.encode(env.COUPANG_SECRET_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signed=await crypto.subtle.sign('HMAC',key,encoder.encode(datetime+method+path+query));
 const signature=[...new Uint8Array(signed)].map(v=>v.toString(16).padStart(2,'0')).join('');
 const authorization='CEA algorithm=HmacSHA256, access-key='+env.COUPANG_ACCESS_KEY+', signed-date='+datetime+', signature='+signature;
 const response=await fetch('https://api-gateway.coupang.com'+path+'?'+query,{headers:{Authorization:authorization}});
 if(!response.ok)return json({error:'Coupang API '+response.status},502);
 const payload=await response.json();
 const products=(payload?.data?.productData||[]).slice(0,10).map((p,i)=>({name:p.productName,price:p.productPrice,image:p.productImage,url:p.productUrl||fallbackLinks[i%fallbackLinks.length],rocket:Boolean(p.isRocket)})).filter(p=>p.name&&p.image&&p.url);
 return json({products});
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/coupang-products.json')return coupang(env);
 const file=files[url.pathname]||(url.pathname.startsWith('/ko/')||url.pathname.startsWith('/en/')?files['/index.html']:null);
 if(!file)return new Response('Not found',{status:404});
 return new Response(bytes(file.body),{headers:{'content-type':file.type,'cache-control':file.type.startsWith('text/html')?'no-cache':'public, max-age=86400'}});
}};`;
await writeFile(join(output,'server','index.js'),worker);
await copyFile(join(root,'.openai','hosting.json'),join(output,'.openai','hosting.json'));
console.log('Built worker site');
