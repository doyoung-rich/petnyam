import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {rescuePanel,rescueCards,registrationBanner,safePhoto} from '../docs/rescue-home.js';
import {publicAnimal,syncRescueAnimals} from './sync-rescue-animals.mjs';
const record=publicAnimal({noticeNo:'TEST-1',kindFullNm:'<script>',orgNm:'서울',happenDt:'20261027',age:'2025',processState:'보호중',popfile1:'https://www.animal.go.kr/photo.jpg',careTel:'private',chargeNm:'private',rfidCd:'private',dogRegNo:'private'});
assert.equal(record.foundDate,'2026-10-27');assert.ok(!JSON.stringify(record).includes('private'));
assert.ok(rescueCards([record]).includes('&lt;script&gt;'));assert.ok(!rescueCards([record]).includes('<script>'));
for(const bad of ['javascript:alert(1)','https://animal.go.kr.evil.test/a','https://evil.test/a'])assert.equal(safePhoto(bad),'');
assert.equal(safePhoto('http://openapi.animal.go.kr/a'),'https://openapi.animal.go.kr/a');
assert.ok(safePhoto('https://www.animal.go.kr/a'));
for(const en of [false,true]){const panel=rescuePanel(en);assert.ok(panel.includes('data-rescue-next'));assert.ok(panel.includes('data-rescue-region'));assert.ok(panel.includes('publicList.do'));assert.ok(registrationBanner(en).includes('recordAgencyList.do'));}
// Provider failure cannot replace a last successful public snapshot.
await assert.rejects(syncRescueAnimals({ANIMAL_GO_KR_API_KEY:'test'},async()=>({ok:false})),/HTTP/);
for(const path of ['docs/index.html','docs/en/index.html']){const html=await readFile(new URL('../'+path,import.meta.url),'utf8');assert.ok(html.includes('data-rescue-panel'));assert.ok(html.includes('data-registration-banner'));assert.ok(html.includes('editorial.js?v=14'));}
console.log('Rescue homepage: safe public fields, image hosts, escaped cards, bilingual controls, registration destination and failure retention verified.');
