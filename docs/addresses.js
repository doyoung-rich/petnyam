export function finalAddress(value,base='https://petnyam.com/'){
 if(!value||value.startsWith('#')||value.includes('${'))return value;
 let u;try{u=new URL(value,base);}catch{return value;}
 if(u.origin!==new URL(base).origin)return value;
 if(/^\/(?:en|foods|(?:ko|en)\/[^/]+\/[^/]+|guides(?:\/[^/]+)?|policy\/[^/]+)\/?$/.test(u.pathname)&&!u.pathname.endsWith('/'))u.pathname+='/';
 return /^https?:/.test(value)?u.href:u.pathname+u.search+u.hash;
}
export function normalizeVisibleAddresses(){
 for(const a of document.querySelectorAll('a[href]')){const old=a.getAttribute('href');const next=finalAddress(old,location.href);if(old!==next)a.setAttribute('href',next);}
 for(const link of document.querySelectorAll('link[rel="canonical"],link[rel="alternate"][hreflang]'))link.href=finalAddress(link.href,location.href);
 const og=document.querySelector('meta[property="og:url"]');if(og)og.content=finalAddress(og.content,location.href);
}
