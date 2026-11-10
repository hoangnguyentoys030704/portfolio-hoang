(()=>{
 const card=document.querySelector('#work .project.miyako');
 if(card){
  const feature=cases.miyako.feature;
  const numbers=document.createElement('div');numbers.className='work-miyako-numbers';
  for(const row of feature.stats.slice(0,2)){const box=document.createElement('div'),b=document.createElement('b'),span=document.createElement('span');b.textContent=row[0];span.textContent=row[1];box.append(b,span);numbers.append(box);}
  card.querySelector('.project-actions').before(numbers);
  const sweep=document.createElement('span');sweep.className='work-featured-sweep';sweep.setAttribute('aria-hidden','true');card.append(sweep);
 }
 const modal=document.getElementById('caseModal');
 function enhance(){
  if(!modal.classList.contains('open')||!modal.classList.contains('case-theme-miyako'))return;
  let nav=modal.querySelector('.miyako-case-nav');
  if(!nav){nav=document.createElement('nav');nav.className='miyako-case-nav';nav.setAttribute('aria-label','Điều hướng case Miyako');
   [['Vai trò','#caseStoryBlock'],['Thành phẩm','#miyakoShortformBlock'],['Tăng trưởng','#caseChannelGrowthBlock'],['Tài trợ','#casePartnershipBlock']].forEach(([label,target])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{const destination=modal.querySelector(target);if(!destination)return;destination.classList.add('pm-in','case-jump-target');destination.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});};nav.append(b);});modal.prepend(nav);
  }
  let summary=modal.querySelector('.miyako-executive-summary');
  if(!summary){summary=document.createElement('aside');summary.className='miyako-executive-summary';const f=cases.miyako.feature;const title=document.createElement('h2');title.textContent=f.title;summary.append(title);const description=document.createElement('p');description.className='summary-description';description.textContent=f.copy;summary.append(description);const stats=document.createElement('div');stats.className='summary-stats';f.stats.forEach(([value,label])=>{const box=document.createElement('div'),b=document.createElement('b'),span=document.createElement('span');b.textContent=value;span.textContent=label;box.append(b,span);stats.append(box);});summary.append(stats);const visuals=document.createElement('div');visuals.className='summary-visuals';[1,4].forEach(n=>{const im=document.createElement('img');im.src=`assets/miyako-shortform-${n}.jpg`;im.alt=`Miyako Home — sản phẩm short-form ${n}`;im.loading='lazy';visuals.append(im);});summary.append(visuals);modal.querySelector('.case-wrap').append(summary);}
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
   summary.animate([{opacity:0,translate:'0 28px'},{opacity:1,translate:'0 0'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)'});
   summary.querySelectorAll('.summary-stats b').forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(15px) scale(.9)'},{opacity:1,transform:'none'}],{duration:850,delay:100+i*90,fill:'backwards',easing:'cubic-bezier(.16,1,.3,1)'}));
  }

 }
 new MutationObserver(enhance).observe(modal,{attributes:true,attributeFilter:['class']});
})();
