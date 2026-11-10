(()=>{
 'use strict';const reduced=matchMedia('(prefers-reduced-motion:reduce)'),modal=document.getElementById('caseModal');
 const rail=document.querySelector('.secondary-rail'),viewport=rail?.querySelector('.secondary-rail-scroll'),cards=rail?[...rail.querySelectorAll('.project')]:[];
 let index=0,visible=false,paused=false,auto=0,paintFrame=0,shown=2,maxIndex=1,travel=0,travelFrame=0,direction=1;
 let dots=[];
 function pause(){clearTimeout(auto);auto=0;}
 function schedule(){pause();if(visible&&!paused&&!document.hidden&&!reduced.matches&&!modal?.classList.contains('open'))auto=setTimeout(()=>go(index>=maxIndex?0:index+1),8000);}
 function update(){paintFrame=0;if(!viewport)return;let nearest=0,best=Infinity;for(let i=0;i<=maxIndex;i++){const d=Math.abs(cards[i].offsetLeft-viewport.scrollLeft);if(d<best){best=d;nearest=i;}}index=nearest;
  const stride=cards[1]?cards[1].offsetLeft-cards[0].offsetLeft:1;
  cards.forEach((card,i)=>{const relative=(card.offsetLeft-viewport.scrollLeft)/Math.max(1,stride),pulse=Math.sin(travel*Math.PI);card.style.setProperty('--rail-yaw',(-3-Math.max(-11,Math.min(11,relative*8))+direction*pulse*8).toFixed(2)+'deg');card.style.setProperty('--rail-pitch',(reduced.matches?0:2+pulse*5).toFixed(2)+'deg');card.style.setProperty('--rail-depth',(reduced.matches?0:8-pulse*52).toFixed(1)+'px');card.style.setProperty('--rail-scale',String(reduced.matches?1:.965-pulse*.025));card.classList.toggle('is-rail-active',i===index);});dots.forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));}
 function stopTravel(){cancelAnimationFrame(travelFrame);travelFrame=0;travel=0;rail?.classList.remove('is-travelling');}
 function go(i){if(!cards.length)return;const targetIndex=(i+maxIndex+1)%(maxIndex+1),from=viewport.scrollLeft,to=cards[targetIndex].offsetLeft;direction=to>=from?1:-1;stopTravel();pause();if(reduced.matches||Math.abs(to-from)<1){viewport.scrollLeft=to;update();schedule();return;}rail.classList.add('is-travelling');const start=performance.now(),duration=900;
  function step(now){travel=Math.min(1,(now-start)/duration);const eased=travel<.5?4*travel*travel*travel:1-Math.pow(-2*travel+2,3)/2;viewport.scrollLeft=from+(to-from)*eased;update();if(travel<1)travelFrame=requestAnimationFrame(step);else{stopTravel();viewport.scrollLeft=to;update();schedule();}}
  travelFrame=requestAnimationFrame(step);
 }
 function sizeRail(){if(!viewport)return;stopTravel();shown=innerWidth<=760?1:2;maxIndex=Math.max(0,cards.length-shown);const gap=shown===1?20:26,pad=shown===1?48:64;const width=(viewport.clientWidth-pad-gap*(shown-1))/shown;viewport.style.setProperty('--rail-card-width',width+'px');index=Math.min(index,maxIndex);const host=rail.querySelector('.secondary-rail-dots');host.replaceChildren();dots=[];for(let i=0;i<=maxIndex;i++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',shown===1?'Xem thẻ '+['Boss Pets Shop','Optibac','MIIU.ORDER'][i]:'Xem dự án '+(i+1)+'–'+(i+shown));b.onclick=()=>go(i);host.append(b);dots.push(b);}viewport.scrollLeft=cards[index].offsetLeft;update();}
 if(viewport){
  rail.querySelector('[data-rail-prev]').onclick=()=>go(index-1);rail.querySelector('[data-rail-next]').onclick=()=>go(index+1);
  viewport.addEventListener('scroll',()=>{if(!paintFrame)paintFrame=requestAnimationFrame(update);},{passive:true});
  viewport.addEventListener('pointerdown',()=>{stopTravel();pause();update();},{passive:true});viewport.addEventListener('pointerup',schedule,{passive:true});
  rail.addEventListener('pointerenter',()=>{paused=true;pause();});rail.addEventListener('pointerleave',()=>{paused=rail.contains(document.activeElement);schedule();});
  rail.addEventListener('focusin',()=>{paused=true;pause();});rail.addEventListener('focusout',e=>{if(!rail.contains(e.relatedTarget)){paused=rail.matches(':hover');schedule();}});
  viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1));}});
  new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible){update();schedule();}else{stopTravel();pause();}},{threshold:.3}).observe(rail);
  new ResizeObserver(sizeRail).observe(viewport);sizeRail();
 }
 // Slow contour geometry: one capped-resolution canvas, no image assets or pointer interception.
 const canvas=document.createElement('canvas');canvas.className='portfolio-ambient';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 const ctx=canvas.getContext('2d',{alpha:true});let w=0,h=0,frame=0,last=0,t=0;
 function resize(){w=innerWidth;h=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.25);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);draw();}
 function draw(){if(!ctx)return;ctx.clearRect(0,0,w,h);const drift=Math.sin(t*.12),x=w*.87+drift*25,y=h*.32+Math.cos(t*.09)*18;
  const glow=ctx.createRadialGradient(x,y,0,x,y,Math.min(w,h)*.6);glow.addColorStop(0,'rgba(234,99,44,.05)');glow.addColorStop(1,'rgba(234,99,44,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.translate(x,y);ctx.rotate(t*.018);ctx.strokeStyle='rgba(255,128,64,.16)';ctx.lineWidth=.65;
  for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(0,0,120+i*34,190+i*30,.3,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
  const angle=t*.13,orbX=x+Math.cos(angle)*170,orbY=y+Math.sin(angle)*115,orbR=8+Math.sin(angle)*2;
  const orb=ctx.createRadialGradient(orbX-orbR*.3,orbY-orbR*.35,0,orbX,orbY,orbR);orb.addColorStop(0,'rgba(255,203,157,.55)');orb.addColorStop(.4,'rgba(222,101,49,.25)');orb.addColorStop(1,'rgba(66,32,18,.03)');ctx.fillStyle=orb;ctx.beginPath();ctx.arc(orbX,orbY,orbR,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(w*.08,h*.85);ctx.rotate(-t*.013);ctx.strokeStyle='rgba(232,211,181,.10)';
  for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(0,0,210+i*35,90+i*25,-.5,0,Math.PI*2);ctx.stroke();}ctx.restore();
  for(let i=0;i<14;i++){const px=((Math.sin(i*93.7)*.5+.5)*w+Math.sin(t*.11+i)*12),py=(Math.cos(i*43.1)*.5+.5)*h+Math.cos(t*.09+i)*10;ctx.beginPath();ctx.fillStyle=i%4===0?'rgba(255,129,62,.42)':'rgba(255,210,165,.17)';ctx.arc(px,py,i%4===0?1.8:1,0,Math.PI*2);ctx.fill();}
 }
 function tick(now){frame=0;if(document.hidden||reduced.matches||!document.body.classList.contains('entered')||modal?.classList.contains('open'))return;const limit=innerWidth<760?50:33.3;if(now-last>=limit){t+=Math.min(now-last,80)/1000;last=now;draw();}frame=requestAnimationFrame(tick);}
 function resume(){if(document.hidden||reduced.matches||modal?.classList.contains('open')){stopTravel();update();}cancelAnimationFrame(frame);frame=0;pause();schedule();if(!document.hidden&&!reduced.matches&&document.body.classList.contains('entered')&&!modal?.classList.contains('open')){last=performance.now();frame=requestAnimationFrame(tick);}else if(reduced.matches)ctx?.clearRect(0,0,w,h);}
 addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);
 new MutationObserver(resume).observe(document.body,{attributes:true,attributeFilter:['class']});if(modal)new MutationObserver(resume).observe(modal,{attributes:true,attributeFilter:['class']});resize();resume();
})();
