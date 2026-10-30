import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseMaterials} from './sync-feed-materials.mjs';
import {filterMaterials,feedTable} from '../docs/feed-material-view.js';
const d=JSON.parse(await readFile(new URL('../docs/data/feed-materials.json',import.meta.url),'utf8'));
assert.equal(d.schemaVersion,1);assert.ok(d.items.length>0);assert.equal(new Set(d.items.map(i=>i.feedSeqNo)).size,d.items.length);
assert.ok(filterMaterials(d.items,'닭').every(i=>(i.feedNm+i.feedClCodeNm).includes('닭')));assert.ok(filterMaterials(d.items,'','402003').every(i=>i.upperFeedClCode==='402003'));
const x='<response><resultCode>00</resultCode><item><feedSeqNo>1</feedSeqNo><feedNm><![CDATA[A & B]]></feedNm><protQy>0</protQy><fatQy></fatQy></item></response>';
const [row]=parseMaterials(x);assert.equal(row.feedNm,'A & B');assert.equal(row.protQy,'0');assert.equal(row.fatQy,'');assert.throws(()=>parseMaterials(x.replace('00','99')));assert.throws(()=>parseMaterials('<!DOCTYPE x>'+x));
assert.ok(feedTable(row).includes('0%'));assert.ok(feedTable(row).includes('미제공'));assert.ok(feedTable({...row,feedNm:'<img onerror=x>'}).includes('&lt;img'));
for(const suffix of ['','-en']){const html=await readFile(new URL('../docs/guides/feed-ingredients'+suffix+'/index.html',import.meta.url),'utf8');assert.ok(html.includes('data-feed-browser'));assert.ok(html.includes('/feed-materials.js?v=1'));assert.ok(html.includes(d.sourceUrl));assert.ok(!html.includes('NONGSARO_FEED_API_KEY'));}
const workflow=await readFile(new URL('../.github/workflows/sync-feed-materials.yml',import.meta.url),'utf8');assert.ok(workflow.includes('secrets.NONGSARO_FEED_API_KEY'));assert.ok(!workflow.includes('set -x'));
console.log('Feed ingredients verified: snapshot, XML rejection, escaped values, zero/missing distinction, filters, bilingual pages and secret separation.');
