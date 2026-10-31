import {featureArticles} from './feature-articles.js?v=13';
export const siteIdentity={
 name:'PetNyam',alternateName:['펫냠','PetNyam 펫냠','petnyam.com'],
 logo:{'@type':'ImageObject',url:'https://petnyam.com/logo.svg',width:256,height:256}
};
export function languagePair(path){
 if(path==='/'||path==='/en/')return {ko:'/',en:'/en/'};
 const food=path.match(/^\/(?:ko|en)\/((?:dog|cat|rabbit|hamster|parrot)\/[^/]+)\/$/);
 if(food)return {ko:'/ko/'+food[1]+'/',en:'/en/'+food[1]+'/'};
 return featureArticles[path]?.alternates||null;
}
