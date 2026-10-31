// Explicit editorial scope: only the 33 generic research-gap combinations.
// Specific disagreements and food-specific explanations remain separate pages.
export const consolidatedFoods={
 hamster:['blueberry','avocado','cheese','sweet-potato','watermelon','pineapple','mango','potato','lettuce','garlic','green-onion','mushroom','chicken','pork','beef','salmon','tuna','yogurt','rice','bread','coffee','alcohol'],
 parrot:['potato','tomato','green-onion','mushroom','chicken','pork','beef','salmon','tuna','peanut','almond']
};
export function consolidatedFoodHref(key,english=false){const [pet,food]=String(key).split('/');return consolidatedFoods[pet]?.includes(food)?`/guides/${pet}-food-evidence${english?'-en':''}/#${food}`:null;}
export function resolveConsolidatedHref(value){
 let url;try{url=new URL(value,'https://petnyam.com');}catch{return value;}
 if(url.origin!=='https://petnyam.com')return value;
 const match=url.pathname.match(/^\/(ko|en)\/([^/]+\/[^/]+)\/$/),target=match&&consolidatedFoodHref(match[2],match[1]==='en');
 if(!target)return value;
 return /^https?:/.test(value)?'https://petnyam.com'+target:target;
}
