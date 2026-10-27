import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {convertPetAge} from '../docs/pet-age-model.js';
const age=(years,months=0,size='small',species='dog')=>convertPetAge({years,months,size,species});
assert.equal(age(1).humanAge,15);assert.equal(age(2).humanAge,24);
assert.equal(age(10).humanAge,56);assert.equal(age(10,0,'medium').humanAge,60);assert.equal(age(10,0,'large').humanAge,66);assert.equal(age(10,0,'giant').humanAge,78);
assert.equal(age(3,6).humanAge,30);assert.equal(age(2,6,'giant').humanAge,28);
assert.equal(age(16,0,'giant').humanAge,123);assert.equal(age(16,1,'giant').humanAge,null);assert.equal(age(0,11).humanAge,null);assert.equal(age(20,1).humanAge,null);
assert.equal(age(0,6,'small','cat').humanAge,10);assert.equal(age(0,9,'small','cat').humanAge,12.5);assert.equal(age(2,0,'small','cat').humanAge,24);assert.equal(age(21,0,'small','cat').humanAge,100);assert.equal(age(21,1,'small','cat').humanAge,null);
for(const species of ['rabbit','hamster','parrot'])assert.equal(age(3,0,'small',species).reason,'species');
for(const [years,months] of [[-1,0],[NaN,0],[3.5,0],[3,-1],[3,12],[31,0],[3,Infinity]])assert.throws(()=>age(years,months),RangeError);
assert.throws(()=>age(3,0,'invalid'),RangeError);assert.throws(()=>age(3,0,'small','unknown'),RangeError);
for(const path of ['guides/pet-age-calculator/index.html','guides/pet-age-calculator-en/index.html']){const html=await readFile(new URL('../docs/'+path,import.meta.url),'utf8');assert.ok(html.includes('data-pet-age'));assert.ok(html.includes('pet-age-calculator.js?v=2'));assert.ok(html.includes('pet-age-calculator.css?v=2'));assert.ok(html.includes('2026-10-28'));assert.ok(html.includes('canine_and_feline_age_chart_poster.pdf'));}
for(const path of ['index.html','en/index.html','foods/index.html']){const html=await readFile(new URL('../docs/'+path,import.meta.url),'utf8');assert.ok(html.includes('data-pet-age-banner'));}
const code=await readFile(new URL('../docs/pet-age-calculator.js',import.meta.url),'utf8');assert.ok(!/fetch\(|localStorage|sessionStorage|sendBeacon|XMLHttpRequest/.test(code));
console.log('Pet age verified: source-chart anchors, monthly interpolation, juvenile/upper limits, unsupported species, invalid inputs, privacy and bilingual discovery links.');
