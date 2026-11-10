(()=>{
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),skills=document.getElementById('skills'),stage=skills.querySelector('.skill-stage'),modal=document.getElementById('caseModal');
 const focus={social:['50% 4%','50% 20%'],content:['12% 40%','50% 32%'],shortform:['50% 60%','50% 0%'],partnership:['50% 52%','50% 37%']};
 const photos=[...stage.querySelectorAll('.skill-photo')];let motion=[];
 function setScene(key,animate){
  stage.dataset.skill=key;const positions=focus[key]||focus.content;
  photos.forEach((photo,i)=>{photo.style.setProperty('--skill-focus',positions[i]);photo.setAttribute('role','button');photo.tabIndex=0;photo.setAttribute('aria-label','Xem ảnh '+(i?'bổ sung':'chính')+' — '+document.getElementById('skillStageTitle').textContent);});
  skills.querySelectorAll('.skill-btn').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.skill===key)));
  motion.forEach(a=>a.cancel());motion=[];
  if(animate&&!reduced.matches){[...photos,stage.querySelector('.skill-note')].forEach((el,i)=>motion.push(el.animate([{transform:'perspective(1000px) rotateY(12deg) rotateX(-3deg) translate3d(16px,5px,-28px)',opacity:.55},{transform:'perspective(1000px) rotateY(0deg) rotateX(0deg) translate3d(0,0,'+(i===2?8:14)+'px)',opacity:1}],{duration:680,delay:i*45,easing:'cubic-bezier(.22,.61,.36,1)'})));}
 }
 photos.forEach(photo=>{photo.style.cursor='zoom-in';const open=()=>{const img=photo.querySelector('img');if(img?.src)veOpenMedia(img.src,document.getElementById('skillStageTitle').textContent);};photo.addEventListener('click',open);photo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
 document.addEventListener('portfolio:skillchange',e=>setScene(e.detail.key,true));setScene(skills.querySelector('.skill-btn.active')?.dataset.skill||'content',false);
 let pointerFrame=0,pointer;
 stage.addEventListener('pointermove',e=>{if(reduced.matches||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;pointer=e;if(pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const r=stage.getBoundingClientRect(),x=(pointer.clientX-r.left)/r.width-.5,y=(pointer.clientY-r.top)/r.height-.5;stage.style.setProperty('--studio-rx',(-y*3).toFixed(2)+'deg');stage.style.setProperty('--studio-ry',(x*4).toFixed(2)+'deg');});},{passive:true});
 stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--studio-rx','0deg');stage.style.setProperty('--studio-ry','0deg');});
 new IntersectionObserver(es=>{skills.classList.toggle('skills-in-view',es[0].isIntersecting);document.body.classList.toggle('studio-view',es[0].isIntersecting);},{threshold:.08}).observe(skills);
 const toolObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!reduced.matches)e.target.animate([{opacity:0,transform:'perspective(1000px) rotateX(28deg) translateY(24px) translateZ(-40px)'},{opacity:1,transform:'perspective(1000px) rotateX(5deg) rotateY(-2deg) translateY(0) translateZ(0)'}],{duration:750,delay:Number(e.target.dataset.toolDepth||0)*45,easing:'cubic-bezier(.22,.61,.36,1)'});toolObserver.unobserve(e.target);}}),{threshold:.15});
 skills.querySelectorAll('.tool').forEach((el,i)=>{el.dataset.toolDepth=i%5;toolObserver.observe(el);});
 const title=document.querySelector('.hero-title');let heroVisible=false;
 function liveTitle(){title.classList.toggle('is-name-live',heroVisible&&!document.hidden&&!modal.classList.contains('open')&&!reduced.matches);}
 new IntersectionObserver(es=>{heroVisible=es[0].isIntersecting;liveTitle();},{threshold:.1}).observe(title);
 document.addEventListener('visibilitychange',liveTitle);reduced.addEventListener('change',liveTitle);new MutationObserver(liveTitle).observe(modal,{attributes:true,attributeFilter:['class']});
 // Motion runs only while its section is visible and the page is active.
 const about=document.getElementById('about');let aboutVisible=false,artVisible=false,ambientVisible=false;
 function syncArtMotion(){const play=!document.hidden&&!modal.classList.contains('open')&&!reduced.matches;about.classList.toggle('about-motion-on',aboutVisible&&play);skills.classList.toggle('art-motion-on',artVisible&&play);skills.classList.toggle('skills-ambient-live',ambientVisible&&play);}
 new IntersectionObserver(es=>{aboutVisible=es[0].isIntersecting;syncArtMotion();},{threshold:.05}).observe(about);
 new IntersectionObserver(es=>{artVisible=es[0].isIntersecting;syncArtMotion();},{threshold:.05}).observe(document.getElementById('skillList'));
 new IntersectionObserver(es=>{ambientVisible=es[0].isIntersecting;syncArtMotion();},{threshold:0}).observe(skills);
 document.addEventListener('visibilitychange',syncArtMotion);reduced.addEventListener('change',syncArtMotion);new MutationObserver(syncArtMotion).observe(modal,{attributes:true,attributeFilter:['class']});
 skills.querySelectorAll('.skill-btn').forEach((button,i)=>{button.dataset.artIndex=String(i+1).padStart(2,'0');button.style.setProperty('--art-delay',(-i*1.7)+'s');let frame=0,point;
  const reset=()=>{cancelAnimationFrame(frame);frame=0;button.style.setProperty('--art-rx','0deg');button.style.setProperty('--art-ry','0deg');};
  button.addEventListener('pointermove',event=>{if(reduced.matches||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;point=event;if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const r=button.getBoundingClientRect();button.style.setProperty('--art-rx',((.5-(point.clientY-r.top)/r.height)*9).toFixed(2)+'deg');button.style.setProperty('--art-ry',(((point.clientX-r.left)/r.width-.5)*10).toFixed(2)+'deg');});},{passive:true});button.addEventListener('pointerleave',reset);button.addEventListener('pointercancel',reset);reduced.addEventListener('change',reset);
 });

})();
