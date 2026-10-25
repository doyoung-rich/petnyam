import {foodCatalog,petCatalog} from './food-page-catalog.js';
export const savedFoodsKey='petnyam:saved-foods:v1';
export const savedFoodsLimit=8;
const foods=new Map(foodCatalog.map(food=>[food.slug,food]));
const groups=[
 ['apple','banana','blueberry','strawberry','watermelon','pear','peach','orange','lemon','pineapple','mango','grape','avocado'],
 ['carrot','sweet-potato','cabbage','potato','tomato','broccoli','cucumber','pumpkin','lettuce','spinach','mushroom'],
 ['egg','chicken','pork','beef','salmon','tuna'],
 ['milk','yogurt','cheese','peanut','almond','macadamia'],
 ['rice','bread','ramen','kimchi','fried-chicken','sausage','ham'],
 ['onion','garlic','green-onion','chocolate','xylitol','coffee','alcohol']
];
export function isFoodKey(key){return typeof key==='string'&&key.split('/').length===2&&Object.hasOwn(petCatalog,key.split('/')[0])&&foods.has(key.split('/')[1]);}
export function parseSavedFoods(raw){
 try {const value=JSON.parse(raw);return Array.isArray(value)?[...new Set(value.filter(isFoodKey))].slice(0,savedFoodsLimit):[];} catch {return [];}
}
export function changeSavedFoods(saved,key){
 if(!isFoodKey(key))throw new RangeError('Unknown food');
 const clean=parseSavedFoods(JSON.stringify(saved));
 if(clean.includes(key))return clean.filter(item=>item!==key);
 if(clean.length>=savedFoodsLimit)throw new RangeError('Saved-food limit reached');
 return [...clean,key];
}
export function findNextFoods(pet,query='',currentSlug='apple'){
 if(!Object.hasOwn(petCatalog,pet))return [];
 const normalized=String(query).trim().toLocaleLowerCase().replace(/\s+/g,'');
 if(!normalized){
  const candidates=groups.find(group=>group.includes(currentSlug))||groups[0];
  return [...candidates,...foodCatalog.map(food=>food.slug)].filter((slug,index,all)=>slug!==currentSlug&&all.indexOf(slug)===index).slice(0,4).map(slug=>pet+'/'+slug);
 }
 return foodCatalog.filter(food=>[food.ko,food.en,food.slug].some(value=>value.toLocaleLowerCase().replace(/[\s-]+/g,'').includes(normalized.replace(/-/g,'')))).slice(0,8).map(food=>pet+'/'+food.slug);
}
