import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const docs=resolve(root,'docs');
const source=readFileSync(resolve(root,'site-static/app.js'),'utf8')+readFileSync(resolve(root,'site-static/convenience.js'),'utf8');
const foods=[...new Map([...source.matchAll(/\['([^']+)','([^']+)','([^']+)','([^']+)',\['([^']+)','([^']+)','([^']+)','([^']+)','([^']+)'\]\]/g)].map(m=>[m[1],{slug:m[1],name:m[2],emoji:m[4]}])).values()];
const pets={dog:'강아지',cat:'고양이',rabbit:'토끼',hamster:'햄스터',parrot:'앵무새'};
const escape=v=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const template=readFileSync(resolve(docs,'guides/index.html'),'utf8');
const content=`<article class="policy"><h1>반려동물별 음식 찾아보기</h1><p>반려동물 종류를 먼저 고른 다음 음식별 설명을 읽어주세요. 같은 음식도 동물종·손질·첨가물에 따라 판단이 달라집니다.</p><p>이 목록은 기존 음식 페이지를 찾는 안내입니다. 모든 조합의 상세 근거가 충분한 것은 아니며, 목록에 있다는 이유만으로 급여 가능하다는 뜻은 아닙니다.</p><nav aria-label="반려동물별 음식 목록">${Object.entries(pets).map(([key,name])=>`<a href="#${key}">${name}</a>`).join(' · ')}</nav>${Object.entries(pets).map(([key,name])=>`<section id="${key}"><h2>${name} 음식 정보</h2><ul style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;padding-left:22px">${foods.map(f=>`<li><a href="/ko/${key}/${f.slug}/">${f.emoji} ${escape(name)} ${escape(f.name)}</a></li>`).join('')}</ul></section>`).join('')}<h2>판단하기 전에 함께 읽기</h2><p><a href="/guides/read-a-verdict/">판정의 의미와 한계</a> · <a href="/guides/processed-food-label/">제품 성분표 확인법</a> · <a href="/guides/food-emergency/">위험 음식 섭취 후 확인할 정보</a></p></article>`;
const title='강아지·고양이·토끼·햄스터·앵무새 음식 목록 | 펫냠';
const description='반려동물 종류별 음식 설명을 찾아보세요. 음식마다 급여 전 주의사항과 참고 자료를 확인하고, 판정의 한계를 함께 읽어주세요.';
const page=template.replace(/<title>.*?<\/title>/,`<title>${title}</title>`).replace(/(name="description"|property="og:description") content="[^"]*"/g,`$1 content="${description}"`).replace(/property="og:title" content="[^"]*"/,`property="og:title" content="${title}"`).replace(/https:\/\/petnyam.com\/guides(?=["'])/g,'https://petnyam.com/foods/').replace(/<main id="app">[\s\S]*?<\/main>/,`<main id="app">${content}</main>`);
mkdirSync(resolve(docs,'foods'),{recursive:true});writeFileSync(resolve(docs,'foods/index.html'),page);
// Native ICO bitmap matching the existing SVG's colors and paw silhouette.
const size=32, stride=size*4, pixels=Buffer.alloc(stride*size),mask=Buffer.alloc(4*size);
const polygon=[];const points=[[20,35,20,25,26,17,32,17],[32,17,38,17,44,25,44,35],[44,35,44,43,39,48,32,48],[32,48,25,48,20,43,20,35]];
for(const p of points)for(let i=0;i<32;i++){const t=i/32,s=1-t;polygon.push([s*s*s*p[0]+3*s*s*t*p[2]+3*s*t*t*p[4]+t*t*t*p[6],s*s*s*p[1]+3*s*s*t*p[3]+3*s*t*t*p[5]+t*t*t*p[7]]);}
const inside=(x,y)=>{let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
for(let y=0;y<size;y++)for(let x=0;x<size;x++){const X=x*2+1,Y=y*2+1;let rgb=[24,59,89],alpha=255;const dx=Math.max(18-X,0,X-46),dy=Math.max(18-Y,0,Y-46);if(dx*dx+dy*dy>324){alpha=0;mask[(size-1-y)*4+(x>>3)]|=128>>(x%8);}if(inside(X,Y))rgb=[157,228,210];if([[22,19,6],[42,19,6],[15,30,5],[49,30,5]].some(([cx,cy,r])=>(X-cx)**2+(Y-cy)**2<=r*r))rgb=[255,215,105];const offset=((size-1-y)*size+x)*4;pixels.set([rgb[2],rgb[1],rgb[0],alpha],offset);}
const header=Buffer.alloc(22),dib=Buffer.alloc(40);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=size;header[7]=size;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(dib.length+pixels.length+mask.length,14);header.writeUInt32LE(22,18);dib.writeUInt32LE(40);dib.writeInt32LE(size,4);dib.writeInt32LE(size*2,8);dib.writeUInt16LE(1,12);dib.writeUInt16LE(32,14);dib.writeUInt32LE(pixels.length+mask.length,20);writeFileSync(resolve(docs,'favicon.ico'),Buffer.concat([header,dib,pixels,mask]));
console.log(`Generated compatible favicon and food directory: ${foods.length*5} existing food links.`);
