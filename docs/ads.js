const PETNYAM_AD_CLIENT='ca-pub-2911341623586356';
const PETNYAM_AD_SLOT='8732570902';

function mountPetNyamAds(){
 document.querySelectorAll('.ad').forEach(container=>{
  if(container.querySelector('.adsbygoogle'))return;
  const unit=document.createElement('ins');
  unit.className='adsbygoogle';
  unit.style.display='block';
  unit.dataset.adClient=PETNYAM_AD_CLIENT;
  unit.dataset.adSlot=PETNYAM_AD_SLOT;
  unit.dataset.adFormat='auto';
  unit.dataset.fullWidthResponsive='true';
  container.replaceChildren(unit);
  try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(error){console.warn('AdSense slot is not ready yet.',error)}
 });
}

const petNyamApp=document.querySelector('#app');
if(petNyamApp)new MutationObserver(mountPetNyamAds).observe(petNyamApp,{childList:true,subtree:true});
mountPetNyamAds();
