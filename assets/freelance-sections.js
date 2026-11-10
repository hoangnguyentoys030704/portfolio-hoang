(()=>{
 'use strict';
 const modal=document.getElementById('caseModal');
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 let observer,section,userPaused=reduce.matches;
 const visible=new Set();
 const videos=()=>section?[...section.querySelectorAll('video')]:[];
 const allowed=v=>visible.has(v)&&!userPaused&&!document.hidden&&modal.classList.contains('open')&&modal.classList.contains('case-theme-freelance')&&!document.documentElement.classList.contains('portfolio-lightbox-open');
 function syncPlayback(){videos().forEach(v=>{if(allowed(v)){v.play().then(()=>{if(!allowed(v))v.pause();}).catch(()=>{});}else v.pause();});}
 function updateButton(){const b=section?.querySelector('[data-video-toggle]');if(b){b.textContent=userPaused?'Phát video':'Tạm dừng video';b.setAttribute('aria-pressed',String(userPaused));}}
 const photo=(src,alt)=>`<button class="freelance-photo" type="button" data-freelance-photo="${src}" aria-label="Xem ảnh: ${alt}"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"><span>${alt} <i aria-hidden="true">+</i></span></button>`;
 const clip=n=>`<figure class="freelance-clip"><video muted loop playsinline preload="metadata" poster="assets/freelance-wedding-${n}-poster.webp" aria-label="Hậu trường điều phối tiệc cưới ${n}, không âm thanh"><source src="assets/freelance-wedding-${n}.mp4" type="video/mp4"></video><figcaption>Điều phối onsite · ${String(n).padStart(2,'0')}</figcaption></figure>`;
 window.veRenderFreelanceSections=function(key){
  observer?.disconnect();visible.clear();videos().forEach(v=>v.pause());
  if(key!=='freelance'){if(section)section.hidden=true;return;}
  if(!section){
   section=document.createElement('div');section.id='freelanceDisciplines';
   section.innerHTML=`<nav class="freelance-index" aria-label="Hạng mục Freelance"><a href="#freelance-content">01 / Photo & Content</a><a href="#freelance-production">02 / Production</a><a href="#freelance-wedding">03 / Wedding & Event</a></nav>
   <section class="freelance-discipline" id="freelance-content" aria-labelledby="freelance-content-title"><header><span class="freelance-number">01</span><div><p class="freelance-eyebrow">PHOTOGRAPHY / SOCIAL CONTENT</p><h3 id="freelance-content-title">Chụp ảnh & nội dung social.</h3><p>Trao đổi brief, thực hiện hình ảnh và nội dung bài đăng theo yêu cầu từng job.</p></div></header><div class="freelance-content-layout"><div class="freelance-role"><span>VAI TRÒ</span><p>Chụp ảnh theo yêu cầu<br>Hình ảnh & nội dung bài đăng</p></div>${photo('assets/img-f841ba7c4913.webp','Hậu trường buổi chụp tại studio')}</div></section>
   <section class="freelance-discipline" id="freelance-production" aria-labelledby="freelance-production-title"><header><span class="freelance-number">02</span><div><p class="freelance-eyebrow">PRODUCTION / ONSITE SUPPORT</p><h3 id="freelance-production-title">Hỗ trợ ekip sản xuất.</h3><p>Phối hợp setup livestream, chuẩn bị ánh sáng, thiết bị và hỗ trợ ekip tại buổi quay.</p></div></header><div class="freelance-media production-media">${photo('assets/img-4b8672385955.webp','Phối hợp ekip tại buổi quay')}${photo('assets/portfolio-dfa183c16129.png','Tư liệu setup production & livestream')}</div></section>
   <section class="freelance-discipline" id="freelance-wedding" aria-labelledby="freelance-wedding-title"><header><span class="freelance-number">03</span><div><p class="freelance-eyebrow">WEDDING / EVENT COORDINATION</p><h3 id="freelance-wedding-title">Điều phối tiệc cưới.</h3><p>Bám timeline; điều phối và giám sát phối hợp giữa media, makeup, âm thanh–ánh sáng.</p></div></header><div class="freelance-wedding-bar"><span>HẬU TRƯỜNG / ONSITE</span><button type="button" data-video-toggle aria-pressed="false">Tạm dừng video</button></div><div class="freelance-media wedding-media">${photo('assets/freelance-wedding-floor.webp','Trao đổi tại hiện trường')}${photo('assets/freelance-wedding-coordination.webp','Phối hợp bộ phận kỹ thuật')}${clip(1)}${clip(2)}</div></section>`;
   modal.querySelector('.case-body').prepend(section);
   section.querySelectorAll('[data-freelance-photo]').forEach(b=>b.addEventListener('click',()=>veOpenMedia(b.dataset.freelancePhoto,b.querySelector('img').alt)));
   section.querySelectorAll('.freelance-index a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();section.querySelector(a.getAttribute('href')).scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});}));
   section.querySelector('[data-video-toggle]').addEventListener('click',()=>{userPaused=!userPaused;updateButton();syncPlayback();});
  }
  section.hidden=false;updateButton();
  observer=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));syncPlayback();},{root:modal,threshold:.3});
  videos().forEach(v=>{v.muted=true;v.defaultMuted=true;v.volume=0;observer.observe(v);});
 };
 new MutationObserver(syncPlayback).observe(modal,{attributes:true,attributeFilter:['class']});
 new MutationObserver(syncPlayback).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',syncPlayback);
 reduce.addEventListener('change',e=>{userPaused=e.matches;updateButton();syncPlayback();});
})();
