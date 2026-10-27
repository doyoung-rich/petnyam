import {convertPetAge} from './pet-age-model.js?v=1';
import {ageFoodKeywordsView} from './age-food-keywords.js?v=1';
export function mountPetAge(root){
 const en=root.dataset.lang==='en',form=root.querySelector('form'),species=form.elements.species,size=form.elements.size,years=form.elements.years,months=form.elements.months,output=root.querySelector('[data-age-output]'),error=root.querySelector('[data-age-error]'),sizeField=root.querySelector('[data-age-size]');
 function inputChanged(){sizeField.hidden=species.value!=='dog';size.disabled=species.value!=='dog';output.hidden=true;error.textContent='';}
 function render(event){event?.preventDefault();output.hidden=true;error.textContent='';
  try{
   if(!years.value.trim()||!months.value.trim()||!form.checkValidity())throw Error();
   const result=convertPetAge({species:species.value,size:size.value,years:Number(years.value),months:Number(months.value)});
   root.querySelector('[data-age-actual]').textContent=en?`Actual age: ${Number(years.value)} years ${Number(months.value)} months`:`실제 나이 ${Number(years.value)}세 ${Number(months.value)}개월`;
   const number=root.querySelector('[data-age-number]'),note=root.querySelector('[data-age-note]');
   if(result.humanAge===null){number.textContent=en?'No estimate shown':'사람 나이 환산값을 표시하지 않아요';note.textContent=result.reason==='species'?(en?'This calculator has no supported human-age comparison for this species. Keep records of actual age and ask a veterinarian familiar with the species about care.':'이 종에는 이 계산기에서 적용할 사람 나이 비교 기준이 없습니다. 실제 나이와 성장·생활 기록을 남기고 해당 동물을 진료하는 수의사와 관리 계획을 확인하세요.'):(en?`Outside this chart’s range (${result.minAge}–${result.maxAge} years). We do not extrapolate beyond the published values.`:`선택한 기준표의 지원 범위(${result.minAge}~${result.maxAge}세)를 벗어났습니다. 자료에 없는 나이를 임의로 늘려 계산하지 않습니다.`);}
   else{number.textContent=en?`About ${result.humanAge} human years`:`사람 나이로 약 ${result.humanAge}세`;note.textContent=result.interpolated?(en?'Monthly estimate: interpolated between the two nearest chart ages. Rounded to one decimal; this is not a medical measurement.':'월 단위 값은 기준표의 인접 나이 사이를 비례 계산한 추정치입니다. 소수 첫째 자리까지 반올림하며 의학적 측정값은 아닙니다.'):(en?'An approximate comparison from the AAHA age chart, not a diagnosis or prediction of remaining lifespan.':'AAHA 나이 비교표를 바탕으로 한 대략적인 비교입니다. 건강 진단이나 남은 수명 예측이 아닙니다.');}
   root.querySelector('[data-age-foods]').innerHTML=ageFoodKeywordsView({species:species.value,size:size.value,years:Number(years.value),months:Number(months.value)},en);output.hidden=false;
  }catch{error.textContent=en?'Enter whole years from 0 to 30 and months from 0 to 11.':'나이는 0~30세, 개월은 0~11의 정수로 입력해 주세요.';}
 }
 form.addEventListener('input',inputChanged);form.addEventListener('change',inputChanged);form.addEventListener('submit',render);form.addEventListener('reset',()=>{setTimeout(()=>{inputChanged();render();},0);});inputChanged();render();
}
if(typeof document!=='undefined')for(const root of document.querySelectorAll('[data-pet-age]'))mountPetAge(root);
