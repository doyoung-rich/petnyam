import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateTreatCost, mountTreatCalculator} from '../docs/treat-cost-calculator.js';
import {getFoodRecord} from '../docs/food-page-content.js';
import {featureArticles} from '../docs/feature-articles.js';
const read = path => readFile(new URL('../docs/' + path, import.meta.url), 'utf8');

// Check the reader's worked examples, purchase rounding, fractional grams and zero use.
assert.deepEqual(calculateTreatCost({price:12000, grams:200, dailyGrams:5, days:30}), {
  unitCost:60, dailyCost:300, periodCost:9000, usedGrams:150, bags:1, purchaseCost:12000, leftoverGrams:50, bagDays:40
});
assert.equal(calculateTreatCost({price:8000, grams:100, dailyGrams:5, days:30}).periodCost,12000);
const two = calculateTreatCost({price:12000, grams:200, dailyGrams:10, days:30});
assert.equal(two.bags,2); assert.equal(two.purchaseCost,24000); assert.equal(two.leftoverGrams,100);
assert.equal(calculateTreatCost({price:100, grams:0.3, dailyGrams:0.1, days:3}).bags,1);
const zero = calculateTreatCost({price:12000, grams:200, dailyGrams:0, days:30});
assert.equal(zero.bags,0); assert.equal(zero.bagDays,null); assert.equal(zero.periodCost,0);
assert.equal(calculateTreatCost({price:0, grams:200, dailyGrams:5, days:30}).purchaseCost,0);
for (const invalid of [{grams:0},{grams:-1},{dailyGrams:-1},{price:-1},{days:1.5},{days:0},{days:3661},{price:NaN},{grams:Infinity}]) {
  assert.throws(() => calculateTreatCost({price:12000, grams:200, dailyGrams:5, days:30,...invalid}),RangeError);
}
assert.throws(() => calculateTreatCost({price:Number.MAX_VALUE,grams:0.1,dailyGrams:100,days:30}),RangeError);

// Exercise the real form handlers without networking or a browser dependency.
const inputs = Object.entries({aPrice:'8000',aGrams:'100',bPrice:'12000',bGrams:'200',daily:'5',days:'30'}).map(([name,value]) => ({
  name,value,valid:true,attrs:{},checkValidity(){return this.valid;},
  setAttribute(name,value){this.attrs[name]=value;},removeAttribute(name){delete this.attrs[name];},getAttribute(){return this.name;}
}));
const handlers = {}, form = {querySelectorAll(){return inputs;},addEventListener(name,fn){handlers[name]=fn;}};
const nodes = {form,'[data-cost-results]':{hidden:true},'[data-cost-error]':{textContent:''},'[data-cost-summary]':{textContent:''},'[data-cost-table]':{children:[],replaceChildren(){this.children=[];},append(child){this.children.push(child);}}};
const root = {querySelector(selector){assert.ok(nodes[selector]);return nodes[selector];}};
globalThis.document = {createElement(){return {children:[],append(child){this.children.push(child);}};}};
try {
  mountTreatCalculator(root);
  assert.equal(nodes['[data-cost-results]'].hidden,false);
  assert.ok(nodes['[data-cost-summary]'].textContent.includes('B가 3,000원 낮습니다'));
  assert.equal(nodes['[data-cost-table]'].children.length,8);
  handlers.input(); assert.equal(nodes['[data-cost-results]'].hidden,true);
  inputs[0].value=''; handlers.submit({preventDefault(){}});
  assert.equal(nodes['[data-cost-results]'].hidden,true);
  assert.ok(nodes['[data-cost-error]'].textContent.includes('빈칸'));
  inputs[0].value='8000'; inputs[4].value='0'; handlers.submit();
  assert.equal(nodes['[data-cost-error]'].textContent,'');
  assert.ok(nodes['[data-cost-summary]'].textContent.includes('같습니다'));
  handlers.reset(); assert.equal(nodes['[data-cost-results]'].hidden,true);
} finally {delete globalThis.document;}

const calculator=await read('guides/pet-treat-cost-calculator/index.html');
assert.ok(calculator.includes('data-treat-calculator'));
assert.ok(calculator.includes('src="/treat-cost-calculator.js?v=1"'));
assert.ok(calculator.includes('href="/treat-cost-calculator.css?v=1"'));
assert.ok(calculator.includes('권장 급여량·실제 상품 가격이 아닙니다'));
assert.ok(calculator.includes('<noscript>'));
const module=await read('treat-cost-calculator.js');
assert.ok(!/fetch\(|localStorage|sessionStorage|sendBeacon|XMLHttpRequest/.test(module));
const map=await read('sitemap.xml');
assert.ok(map.includes('<loc>https://petnyam.com/guides/pet-treat-cost-calculator/</loc><lastmod>2026-10-25</lastmod>'));
for(const [route,a] of Object.entries(featureArticles)){
  if(a.schemaType!=='AboutPage')continue;
  const html=await read(route.slice(1)+'index.html');
  assert.ok(html.includes('jungdo63@gmail.com'));assert.ok(html.includes('AboutPage'));
  assert.ok(html.includes(`data-about-link="1" href="${a.alternates[a.lang]}"`));
  for(const [lang,path] of Object.entries(a.alternates))assert.ok(html.includes(`hreflang="${lang}" href="https://petnyam.com${path}"`));
}
assert.equal(getFoodRecord('cat/mango').evidence,'direct');
assert.equal(getFoodRecord('hamster/milk').evidence,'limited');
assert.ok(getFoodRecord('hamster/milk').ko.why.includes('모든 햄스터의 유당'));
for(const key of ['cat/mango','hamster/milk'])for(const lang of ['ko','en']){
  const html=await read(`${lang}/${key}/index.html`);
  assert.ok(html.includes('Content updated: 2026-10-25')||html.includes('본문 업데이트: 2026-10-25'));
  assert.ok(map.includes(`<loc>https://petnyam.com/${lang}/${key}/</loc><lastmod>2026-10-25</lastmod>`));
}
for(const file of ['index.html','en/index.html']){
  const html=await read(file);assert.ok(html.includes('/guides/pet-treat-cost-calculator/'));assert.ok(html.includes('data-about-link="1"'));
}
console.log('Content-value checks passed: real calculator handlers, arithmetic, errors, zero use, privacy, bilingual sources/dates and discovery links.');
