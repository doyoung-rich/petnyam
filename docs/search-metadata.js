import {priorityContent} from './priority-content.js';
import {featureArticles} from './feature-articles.js';
export function pageGraph(url,title,description,lang){
 const origin='https://petnyam.com', path=new URL(url).pathname;
 const match=path.match(/^\/(ko|en)\/([^/]+\/[^/]+)\/$/);
 const record=match&&priorityContent[match[2]], content=record?.[match[1]];
 const page={'@type':content?'Article':'WebPage','@id':url+'#page',url,name:title,inLanguage:lang,description,isPartOf:{'@id':origin+'/#website'},publisher:{'@id':origin+'/#publisher'}};
 if(content)Object.assign(page,{headline:content[0],dateModified:'2026-10-02',citation:record.sources.map(([,source])=>source)});
 const feature=featureArticles[path];
 if(feature)Object.assign(page,{'@type':'Article',headline:feature.title,datePublished:feature.published || '2026-10-05',dateModified:feature.published || '2026-10-05',citation:feature.sources});
 const graph=[{'@type':'Organization','@id':origin+'/#publisher',name:'PetNyam',url:origin+'/'},{'@type':'WebSite','@id':origin+'/#website',name:'PetNyam',url:origin+'/',publisher:{'@id':origin+'/#publisher'}},page];
 if(path!=='/')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'PetNyam',item:origin+'/'},{'@type':'ListItem',position:2,name:title,item:url}]});
 if(content)graph.push({'@type':'FAQPage','@id':url+'#questions',mainEntity:[2,4].map(i=>({'@type':'Question',name:content[i],acceptedAnswer:{'@type':'Answer',text:content[i+1]}}))});
 return {'@context':'https://schema.org','@graph':graph};
}
export function syncSearchMetadata(){
 const canonical=document.querySelector('link[rel="canonical"]')?.href;
 if(!canonical)return;
 let script=document.getElementById('petnyam-search-metadata');
 if(!script){script=document.createElement('script');script.type='application/ld+json';script.id='petnyam-search-metadata';document.head.append(script);}
 script.textContent=JSON.stringify(pageGraph(canonical,document.title,document.querySelector('meta[name="description"]')?.content||'',document.documentElement.lang));
}
export function evidenceOverview(english=false){
 const keys=['dog/grape','dog/chocolate','dog/xylitol','cat/onion','cat/grape','rabbit/carrot'];
 const lang=english?'en':'ko';
 return `<section class="section" data-search-overview="1"><div class="label">${english?'Start with the evidence':'출처와 함께 먼저 확인하세요'}</div><h2>${english?'Food safety depends on the animal and ingredients':'동물종·성분·섭취 상황을 함께 확인하세요'}</h2><p>${english?'PetNyam summarizes public veterinary and animal-welfare references. It is not a veterinary clinic, emergency service or individualized feeding plan. A food name alone cannot establish safety.':'펫냠은 공개된 수의학·동물복지 자료를 정리하는 음식 정보 사이트입니다. 동물병원이나 응급 상담 서비스가 아니며 개별 급여를 처방하지 않습니다. 음식 이름만으로 안전을 확정하지 않습니다.'}</p><div class="cards">${keys.map(key=>`<a class="card" href="/${lang}/${key}/"><div><h3>${priorityContent[key][lang][0]}</h3><p>${priorityContent[key][lang][1]}</p></div></a>`).join('')}</div><p>${english?'Read the linked references and their limits. Advertising links are not evidence of food safety.':'각 글의 원문 출처와 설명의 한계를 확인하세요. 광고·제휴 상품은 안전 판정의 근거가 아닙니다.'} <a href="/guides/read-a-verdict/">${english?'Method and limitations (Korean)':'판정 기준과 한계'} →</a></p></section>`;
}
