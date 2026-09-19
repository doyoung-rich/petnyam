export type PetKey = "dog" | "cat" | "rabbit" | "hamster" | "parrot";
export type Status = "safe" | "caution" | "danger" | "unknown";
export const pets: Record<PetKey,{ko:string;en:string;emoji:string}>={dog:{ko:"강아지",en:"Dog",emoji:"🐶"},cat:{ko:"고양이",en:"Cat",emoji:"🐱"},rabbit:{ko:"토끼",en:"Rabbit",emoji:"🐰"},hamster:{ko:"햄스터",en:"Hamster",emoji:"🐹"},parrot:{ko:"앵무새",en:"Parrot",emoji:"🦜"}};
type Food={slug:string;ko:string;en:string;emoji:string;aliases:string[];results:Record<PetKey,Status>};
export const foods:Food[]=[
{slug:"apple",ko:"사과",en:"Apple",emoji:"🍎",aliases:["apple","애플"],results:{dog:"safe",cat:"caution",rabbit:"safe",hamster:"safe",parrot:"safe"}},
{slug:"grape",ko:"포도",en:"Grape",emoji:"🍇",aliases:["grape","건포도","raisin"],results:{dog:"danger",cat:"danger",rabbit:"caution",hamster:"caution",parrot:"caution"}},
{slug:"chocolate",ko:"초콜릿",en:"Chocolate",emoji:"🍫",aliases:["chocolate","초코"],results:{dog:"danger",cat:"danger",rabbit:"danger",hamster:"danger",parrot:"danger"}},
{slug:"onion",ko:"양파",en:"Onion",emoji:"🧅",aliases:["onion"],results:{dog:"danger",cat:"danger",rabbit:"caution",hamster:"caution",parrot:"caution"}},
{slug:"carrot",ko:"당근",en:"Carrot",emoji:"🥕",aliases:["carrot"],results:{dog:"safe",cat:"caution",rabbit:"safe",hamster:"safe",parrot:"safe"}},
{slug:"blueberry",ko:"블루베리",en:"Blueberry",emoji:"🫐",aliases:["blueberry"],results:{dog:"safe",cat:"safe",rabbit:"safe",hamster:"safe",parrot:"safe"}},
{slug:"avocado",ko:"아보카도",en:"Avocado",emoji:"🥑",aliases:["avocado"],results:{dog:"caution",cat:"caution",rabbit:"danger",hamster:"caution",parrot:"danger"}},
{slug:"cheese",ko:"치즈",en:"Cheese",emoji:"🧀",aliases:["cheese"],results:{dog:"caution",cat:"caution",rabbit:"danger",hamster:"caution",parrot:"caution"}},
{slug:"sweet-potato",ko:"고구마",en:"Sweet potato",emoji:"🍠",aliases:["sweet potato"],results:{dog:"safe",cat:"caution",rabbit:"caution",hamster:"safe",parrot:"safe"}},
{slug:"xylitol",ko:"자일리톨",en:"Xylitol",emoji:"⚠️",aliases:["xylitol"],results:{dog:"danger",cat:"unknown",rabbit:"unknown",hamster:"unknown",parrot:"unknown"}}];
export const statusCopy={safe:{ko:"먹을 수 있어요",en:"Generally safe",shortKo:"가능",color:"#15836d",bg:"#e8f7f1"},caution:{ko:"조심해서 주세요",en:"Use caution",shortKo:"주의",color:"#9a6500",bg:"#fff5d8"},danger:{ko:"먹이면 안 돼요",en:"Do not feed",shortKo:"금지",color:"#c33c43",bg:"#fff0f0"},unknown:{ko:"정보가 부족해요",en:"Not enough evidence",shortKo:"정보부족",color:"#5c6573",bg:"#eef1f4"}};
export function findFood(slug:string){return foods.find(f=>f.slug===slug)}
export function reason(status:Status,pet:string,food:string){if(status==="safe")return `${food}은(는) ${pet}에게 독성이 알려진 음식은 아니지만, 간식은 소량만 주는 것이 좋아요.`;if(status==="caution")return `${pet}의 소화 특성과 조리 상태에 따라 문제가 될 수 있어요. 처음이라면 아주 적은 양부터 확인하세요.`;if(status==="danger")return `${pet}에게 중독이나 심각한 소화기 문제를 일으킬 수 있어 급여하지 않는 것이 안전해요.`;return `신뢰할 수 있는 자료만으로 ${pet}의 안전성을 단정하기 어려워요. 억지로 판단하지 않았어요.`}
