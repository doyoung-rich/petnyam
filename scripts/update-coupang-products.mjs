import { createHmac } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

const accessKey=process.env.COUPANG_ACCESS_KEY;
const secretKey=process.env.COUPANG_SECRET_KEY;
if(!accessKey||!secretKey)throw new Error('COUPANG_ACCESS_KEY and COUPANG_SECRET_KEY are required');

const method='GET';
const path='/v2/providers/affiliate_open_api/apis/openapi/products/search';
const query='keyword='+encodeURIComponent('반려동물 용품')+'&limit=10';
const now=new Date();
const datetime=String(now.getUTCFullYear()).slice(2)+String(now.getUTCMonth()+1).padStart(2,'0')+String(now.getUTCDate()).padStart(2,'0')+'T'+String(now.getUTCHours()).padStart(2,'0')+String(now.getUTCMinutes()).padStart(2,'0')+String(now.getUTCSeconds()).padStart(2,'0')+'Z';
const signature=createHmac('sha256',secretKey).update(datetime+method+path+query).digest('hex');
const authorization=`CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
const response=await fetch(`https://api-gateway.coupang.com${path}?${query}`,{headers:{Authorization:authorization}});
if(!response.ok)throw new Error(`Coupang API returned ${response.status}: ${await response.text()}`);
const payload=await response.json();
const products=(payload?.data?.productData||[]).slice(0,10).map(p=>({
 name:p.productName,
 price:p.productPrice,
 image:p.productImage,
 url:p.productUrl,
 rocket:Boolean(p.isRocket)
})).filter(p=>p.name&&p.image&&p.url);
if(!products.length)throw new Error('Coupang API returned no usable products');
await mkdir('docs',{recursive:true});
await writeFile('docs/coupang-products.json',JSON.stringify({generatedAt:new Date().toISOString(),products},null,2)+'\n');
console.log(`Saved ${products.length} Coupang products`);
