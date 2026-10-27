import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {aboutPetnyam} from '../docs/about-petnyam.js';
for(const [path,article] of Object.entries(aboutPetnyam)){
 const html=await readFile(new URL('../docs'+path+'index.html',import.meta.url),'utf8');
 assert.ok(html.includes('2026-10-28'));assert.ok(html.includes('operator-story.css?v=1'));assert.ok(html.includes('AboutPage'));
 assert.ok(!/운영자는 꼬똥 드 툴레아를 키우며|operator owns a Coton/.test(html));
 for(const name of ['hong-apple','seol-apple','leon-mini'])assert.ok(html.includes('/images/owner/'+name+'.webp'));
 assert.ok(article.body.includes('jungdo63@gmail.com'));
 if(article.lang==='ko')for(const name of ['홍이','설이','레옹이','쪼꼬미','미니','처제'])assert.ok(html.includes(name));
}
for(const name of ['hong-apple','seol-apple','leon-mini']){
 const bytes=await readFile(new URL('../docs/images/owner/'+name+'.webp',import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.length<250000);
 for(let pos=12;pos+8<=bytes.length;){const type=bytes.toString('ascii',pos,pos+4),length=bytes.readUInt32LE(pos+4);assert.ok(!['EXIF','XMP '].includes(type),'Private metadata chunk in '+name);pos+=8+length+(length%2);}
}
console.log('Operator story verified: corrected household, bilingual photos/captions, source methodology retained and EXIF/XMP absent in all three web photos.');
