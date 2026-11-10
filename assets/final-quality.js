(()=>{
 'use strict';
 // Restoring an exported layout must not bring back older CTA text.
 document.querySelectorAll('.project-actions [data-open-case]').forEach(button=>{button.textContent='Xem dự án →';button.setAttribute('aria-label','Xem dự án '+({miyako:'Miyako Home',boss:'Boss Pets Shop',optibac:'Optibac',miiu:'MIIU.ORDER',coach:'Jiu-jitsu Hoàng Kim',freelance:'Freelance'}[button.dataset.openCase]||''));});
 document.querySelectorAll('.project[data-project]').forEach(card=>{card.removeAttribute('role');card.removeAttribute('tabindex');card.querySelector('.project-btn')?.setAttribute('tabindex','-1');});
 const selector='#caseMediaLightbox.open,#graduationModal.open,.certificate-modal.open,#caseModal.open';
 const openDialogs=()=>[...document.querySelectorAll(selector)].filter(el=>getComputedStyle(el).display!=='none');
 const topDialog=()=>{const list=openDialogs();return list.find(el=>el.id!=='caseModal')||list[0];};
 let previous=new Set(),returns=new WeakMap();
 function syncDialogs(){const list=openDialogs(),current=new Set(list);list.forEach(el=>{el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');if(!previous.has(el)){returns.set(el,document.activeElement);const close=el.querySelector('button');close?.focus({preventScroll:true});}});previous.forEach(el=>{if(!current.has(el)){const back=returns.get(el);if(back?.isConnected)back.focus({preventScroll:true});}});previous=current;document.documentElement.classList.toggle('portfolio-lightbox-open',list.some(el=>el.id!=='caseModal'));document.getElementById('skills').classList.toggle('skills-ambient-suspended',list.length>0);syncWorkAmbient();}
 new MutationObserver(syncDialogs).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 document.addEventListener('keydown',event=>{const dialog=topDialog();if(!dialog)return;if(event.key==='Escape'&&dialog.id!=='caseModal'){event.preventDefault();event.stopImmediatePropagation();dialog.querySelector('button')?.click();return;}if(event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(e=>!e.disabled&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');if(!items.length)return;const first=items[0],last=items[items.length-1],active=document.activeElement;if(event.shiftKey&&(active===first||!dialog.contains(active))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(active===last||!dialog.contains(active))){event.preventDefault();first.focus();}},true);
 // Ambient Work layers are composited only when visible and unobstructed.
 const work=document.getElementById('work'),workReduced=matchMedia('(prefers-reduced-motion:reduce)');let workVisible=false;
 function syncWorkAmbient(){if(!work)return;const live=workVisible&&document.body.classList.contains('entered')&&!document.hidden&&!workReduced.matches&&!topDialog();work.classList.toggle('work-ambient-live',live);}
 if(work){new IntersectionObserver(entries=>{workVisible=entries[0].isIntersecting;syncWorkAmbient();},{threshold:0}).observe(work);document.addEventListener('visibilitychange',syncWorkAmbient);workReduced.addEventListener('change',syncWorkAmbient);}

})();
