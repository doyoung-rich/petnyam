import {readFile,writeFile,readdir,mkdir,access} from 'node:fs/promises';
import {getFoodRecord,foodPageMeta} from '../docs/food-page-content.js';
import {siteTitles,titleWithBrand,foodTitleParts,titleStrategyVersion} from '../docs/title-strategy.js';
const docs=new URL('../docs/',import.meta.url),reports=new URL('../reports/',import.meta.url);
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const plain=s=>decode(s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const files=(await readdir(docs,{recursive:true})).filter(f=>f.endsWith('.html')).sort();
await mkdir(reports,{recursive:true});
const baselineFile=new URL('title-baseline.json',reports);
if(process.argv.includes('--capture')){
 try{await access(baselineFile);throw Error('Baseline already exists; preserve the original comparison.');}catch(error){if(error.code!=='ENOENT')throw error;}
 const baseline={};for(const file of files){const html=await readFile(new URL(file.replaceAll('\\','/'),docs),'utf8');baseline[file.replaceAll('\\','/')]=plain(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]||'');}
 await writeFile(baselineFile,JSON.stringify(baseline,null,2)+'\n');console.log(`Captured ${files.length} original titles.`);
}else{
 let baseline={};try{baseline=JSON.parse(await readFile(baselineFile,'utf8'));}catch{}
 const review=[];
 for(const native of files){
  const file=native.replaceAll('\\','/'),url=new URL(file,docs);let html=await readFile(url,'utf8');
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const path=file==='404.html'?'/404.html':canonical?new URL(canonical).pathname:null;
  if(!path)throw Error('Missing canonical for '+file);
  const match=path.match(/^\/(ko|en)\/([^/]+\/[^/]+)\/$/),en=html.includes('<html lang="en"');
  const record=match&&getFoodRecord(match[2]);
  const heading=record?foodPageMeta(record.key,en).title.replace(' | PetNyam',''):siteTitles[path];
  if(!heading)throw Error('Unreviewed page: '+path);
  const title=titleWithBrand(heading),old=baseline[file]||plain(html.match(/<title>(.*?)<\/title>/)?.[1]||'');
  if(file==='404.html'&&!/<h1\b/.test(html))html=html.replace('<main id="app"></main>',`<main id="app"><article class="policy"><h1>${esc(heading)}</h1><p>찾으시는 페이지의 주소를 확인해 주세요. 반려동물별 음식 목록에서 필요한 설명을 다시 찾거나 홈페이지의 음식 검색을 이용할 수 있습니다.</p><p><a href="/foods/">음식 목록 보기</a> · <a href="/">펫냠 홈으로</a></p></article></main>`);
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)}</title>`)
   .replace(/(<meta property="og:title" content=")[^"]*(")/,`$1${esc(title)}$2`)
   .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/,`<h1>${esc(heading)}</h1>`);
  if(html.includes('name="twitter:title"'))html=html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,`$1${esc(title)}$2`);
  else html=html.replace('</head>',`<meta name="twitter:title" content="${esc(title)}"></head>`);
  await writeFile(url,html);
  const body=html.match(/<main\b[\s\S]*?<\/main>/)?.[0]||html;
  const paragraphs=[...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m=>plain(m[1])).filter(p=>p.length>35&&!p.startsWith('PetNyam •')).slice(0,3);
  const parts=record?foodTitleParts(record,en):null;
  const keyword=parts?.keyword||heading.split(/[,:?，]/)[0];
  const candidates=record?[
   {type:'검색 + 궁금증형',title:heading},
   {type:'검색 + 비교형',title:en?`${parts.question} Preparation and Product Differences`:`${keyword}, 준비·가공 형태에 따라 다를까? 확인할 조건`},
   {type:'검색 + 해결형',title:en?`${parts.question} What to Check Before Feeding`:`${parts.question} 급여 전 확인할 조건과 출처`},
   {type:'검색 + 숫자형',title:record.faq?.[en?'en':'ko']?.length?(en?`${parts.question} ${record.faq[en?'en':'ko'].length} Common Questions Answered`:`${parts.question} 자주 묻는 질문 ${record.faq[en?'en':'ko'].length}가지`):null,note:'본문에서 확인되는 문답 개수만 사용. 고정 급여량·성과 숫자는 생성하지 않음.'},
   {type:'종합 추천형',title:heading}
  ]:[{type:'종합 추천형',title:heading},{type:'숫자형',title:null,note:'정책·소개·안내에 인위적인 숫자나 질문을 넣지 않음.'}];
  review.push({path,language:en?'en':'ko',keyword,intent:record?(en?'Check whether this species can eat this food, preparation, exclusions and next action.':'선택한 동물의 섭취 가능 여부·손질·제외 조건·다음 행동 확인'):'본문의 안내·도구·운영 정보를 찾는 검색',before:old,final:heading,changed:old!==title,candidates,reason:['핵심 주제를 앞에 배치','기존 본문이 답하는 궁금증과 해결 정보만 사용','모바일에서 앞부분만 보여도 주제 확인','클릭률·순위 향상을 보장하지 않음'],bodyOpening:paragraphs,thumbnail:{ratio:'1:1',subject:record?`${record.pet.en} and ${record.food.en}`:'본문의 실제 대상 또는 도구 화면',action:'음식의 상태·손질 부위를 보여 주는 구도. 섭취 실험이나 수의사 감수 장면 연출 금지.',composition:'대상과 문구는 중앙 안전 영역에 배치',expression:'자연스러운 표정, 위험 상황 과장 금지',text:record?record.food[en?'en':'ko']+' · '+(en?'Check first':'급여 전 확인'):keyword},proof:parts?.proof||'page-content'});
 }
 await writeFile(new URL('title-review.json',reports),JSON.stringify({strategy:titleStrategyVersion,pages:review.length,review},null,2)+'\n');
 const csv=rows=>rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
 await writeFile(new URL('title-review.csv',reports),'\uFEFF'+csv([['URL','언어','기존 제목','최종 제목','수정 여부'],...review.map(r=>['https://petnyam.com'+r.path,r.language,r.before,r.final,r.changed?'수정':'유지'])]));
 console.log(`Applied ${titleStrategyVersion} to ${review.length} pages; ${review.filter(r=>r.changed).length} differ from the original titles.`);
}
