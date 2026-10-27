// Numeric comparisons from AAHA's publicly available physiological age chart (2019).
// Monthly values between chart points are PetNyam linear interpolations, not clinical measurements.
export const ageSource='https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/canine-life-stage-2019/canine_and_feline_age_chart_poster.pdf';
export const dogAges={
 small:[15,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96],
 medium:[15,24,28,33,37,42,47,51,56,60,65,69,74,78,83,87,92,96,101,105],
 large:[15,24,30,35,40,45,50,55,61,66,72,77,82,88,93,99,104,109,115,120],
 giant:[15,24,32,37,42,49,56,64,71,78,86,93,101,108,115,123]
};
export const speciesNames={dog:['강아지','Dog'],cat:['고양이','Cat'],rabbit:['토끼','Rabbit'],hamster:['햄스터','Hamster'],parrot:['앵무새','Parrot']};
export function convertPetAge({species='dog',size='small',years,months=0}){
 if(!Object.hasOwn(speciesNames,species)||!Number.isInteger(years)||!Number.isInteger(months)||years<0||years>30||months<0||months>11)throw new RangeError('invalid-age');
 const age=years+months/12;
 if(!['dog','cat'].includes(species))return {age,humanAge:null,reason:'species',interpolated:false};
 if(species==='dog'&&!Object.hasOwn(dogAges,size))throw new RangeError('invalid-size');
 const points=species==='cat'?[[.5,10],[1,15],...Array.from({length:20},(_,i)=>[i+2,24+i*4])]:dogAges[size].map((value,i)=>[i+1,value]);
 if(age<points[0][0]||age>points.at(-1)[0])return {age,humanAge:null,reason:'range',minAge:points[0][0],maxAge:points.at(-1)[0],interpolated:false};
 const exact=points.find(([x])=>x===age);if(exact)return {age,humanAge:exact[1],interpolated:false,points:[exact]};
 const end=points.findIndex(([x])=>x>age),left=points[end-1],right=points[end];
 return {age,humanAge:Math.round((left[1]+(age-left[0])/(right[0]-left[0])*(right[1]-left[1]))*10)/10,interpolated:true,points:[left,right]};
}
