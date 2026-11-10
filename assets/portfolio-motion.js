/* Progressive enhancement: no copy or media replacement; no external dependency. */
(()=>{
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches)return;
  const desktop=()=>matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)').matches;
  const modal=document.getElementById('caseModal');
  const cursor=document.getElementById('cursor');
  const animated=new WeakSet(),boundCards=new WeakSet(),boundButtons=new WeakSet();
  const easing='cubic-bezier(.16,1,.3,1)';
  const progress=document.createElement('div');progress.className='fx-scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let pageReady=false,caseObserver=null,pageObserver=null,numberObserver=null,lastOrigin=null,activeCard=null,activeButton=null,pointerFrame=0,scrollFrame=0;
  const nav=[...document.querySelectorAll('.nav-links a')];
  const sections=nav.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const collage=document.querySelector('.hero-collage');
  if(collage)collage.classList.add('fx-collage');
  const animations=new Set();
  function animate(el,frames,options){
    if(reduced.matches||!el?.animate)return null;
    const a=el.animate(frames,options);animations.add(a);
    a.finished.then(()=>{animations.delete(a);a.cancel();}).catch(()=>animations.delete(a));return a;
  }
  function heading(el,chars=false){
    if(!el||!el.textContent.trim()||el.querySelector('img,svg'))return;
    const label=(el.innerText||el.textContent).replace(/\s+/g,' ').trim();
    if(!el.hasAttribute('aria-label')||el.dataset.fxLabel==='1'){el.setAttribute('aria-label',label);el.dataset.fxLabel='1';}
    el.classList.add('fx-heading');
    if(el.querySelector('.fx-word,.fx-char'))return;
    const nodes=[];const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    while(walker.nextNode())if(walker.currentNode.nodeValue.trim())nodes.push(walker.currentNode);
    for(const node of nodes){
      const fragment=document.createDocumentFragment();
      const pieces=chars&&Intl.Segmenter?[...new Intl.Segmenter('vi',{granularity:'grapheme'}).segment(node.nodeValue)].map(x=>x.segment):node.nodeValue.split(/(\s+)/u);
      for(const piece of pieces){
        if(!piece)continue;if(/^\s+$/u.test(piece)){fragment.append(document.createTextNode(piece));continue;}
        const span=document.createElement('span');span.className=chars?'fx-char':'fx-word';span.textContent=piece;span.setAttribute('aria-hidden','true');fragment.append(span);
      }
      node.replaceWith(fragment);
    }
  }
  function revealHeading(el,hero=false){
    el.classList.remove('fx-title-wait');el.classList.add('fx-heading-arrived');
    [...el.querySelectorAll('.fx-word,.fx-char')].forEach((word,i)=>animate(word,[
      {opacity:0,transform:`translate3d(${hero?'-8px':'0'},${hero?'85%':'65%'},0) rotateX(${hero?'58':'32'}deg)`,filter:hero?'blur(5px)':'blur(3px)'},
      {opacity:1,transform:'translate3d(0,0,0) rotateX(0deg)',filter:'blur(0px)'}
    ],{duration:hero?1100:860,delay:Math.min(hero?380:230,i*(hero?45:32)),easing,fill:'both'}));
  }
  function bindCard(el){
    if(boundCards.has(el))return;boundCards.add(el);el.classList.add('fx-depth');
    const light=document.createElement('span');light.className='fx-card-light';light.setAttribute('aria-hidden','true');el.append(light);
  }
  function bindButton(el){
    if(boundButtons.has(el))return;boundButtons.add(el);el.classList.add('fx-button');
    if(!el.classList.contains('pm-magnetic'))el.classList.add('fx-magnet');
    const sheen=document.createElement('span');sheen.className='fx-button-sheen';sheen.setAttribute('aria-hidden','true');el.append(sheen);
  }
  function bindSurface(root){
    root.querySelectorAll('.project,.stat,.cred,.tool,.contact-card').forEach(bindCard);
    root.querySelectorAll('.project-actions a,.project-actions button,.coach-ctas a,.case-links a,.case-evidence-card,.contact-card,.skill-btn,.coach-preview-tabs button,.enter-btn').forEach(bindButton);
  }
  function watchNumbers(root,observer){
    root.querySelectorAll('.stat-value,.metric>b,.coach-result-strip b,.sponsor-results b,.channel-growth-metrics b').forEach(el=>{if(!animated.has(el))observer.observe(el);});
  }
  function numberPop(el){
    if(animated.has(el))return;animated.add(el);
    animate(el,[{opacity:.45,transform:'translateY(12px) scale(.94)'},{opacity:1,transform:'translateY(-2px) scale(1.035)',offset:.65},{opacity:1,transform:'none'}],{duration:850,easing,fill:'both'});
  }
  function startPage(){
    if(pageReady)return;pageReady=true;document.documentElement.dataset.motionReady='true';bindSurface(document);
    pageObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){
      if(entry.target.classList.contains('fx-heading'))revealHeading(entry.target,entry.target.matches('.hero-title'));
      else animate(entry.target,[{transform:'scaleX(0)',opacity:0},{transform:'scaleX(1)',opacity:.45}],{duration:1200,easing,fill:'both'});
      pageObserver.unobserve(entry.target);
    }},{threshold:.15,rootMargin:'0px 0px -4% 0px'});
    document.querySelectorAll('.hero-title,.section-title,.contact-sec h2').forEach(el=>{heading(el,el.matches('.hero-title'));el.classList.add('fx-title-wait');pageObserver.observe(el);});
    document.querySelectorAll('.section-head').forEach(el=>{const line=document.createElement('span');line.className='fx-section-line';line.setAttribute('aria-hidden','true');el.append(line);pageObserver.observe(line);});
    numberObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){numberPop(e.target);numberObserver.unobserve(e.target);}});},{threshold:.5});
    watchNumbers(document,numberObserver);scheduleScroll();
  }
  if(document.body.classList.contains('entered'))startPage();
  else{const entered=new MutationObserver(()=>{if(document.body.classList.contains('entered')){startPage();entered.disconnect();}});entered.observe(document.body,{attributes:true,attributeFilter:['class']});}
  function resetCard(){if(activeCard){activeCard.el.classList.remove('fx-hover');activeCard=null;}cursor?.classList.remove('fx-on-project');}
  function resetButton(){if(activeButton){activeButton.classList.remove('fx-magnet-active');activeButton=null;}}
  let pointer=null;
  document.addEventListener('pointermove',e=>{
    if(!desktop()||reduced.matches)return;pointer={x:e.clientX,y:e.clientY,target:e.target};
    if(pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{
      pointerFrame=0;const p=pointer;if(!p)return;
      const card=p.target.closest('.fx-depth');
      if(activeCard?.el!==card){resetCard();if(card){activeCard={el:card,rect:card.getBoundingClientRect()};card.classList.add('fx-hover');}}
      if(activeCard){
        const {el,rect:r}=activeCard;const x=Math.max(-.5,Math.min(.5,(p.x-r.left)/r.width-.5)),y=Math.max(-.5,Math.min(.5,(p.y-r.top)/r.height-.5));
        const strength=el.matches('.project')?3.2:5;
        el.style.setProperty('--fx-rotate-x',(-y*strength).toFixed(2)+'deg');el.style.setProperty('--fx-rotate-y',(x*strength).toFixed(2)+'deg');
        el.style.setProperty('--fx-light-x',((x+.5)*100).toFixed(1)+'%');el.style.setProperty('--fx-light-y',((y+.5)*100).toFixed(1)+'%');
        el.style.setProperty('--fx-shadow-x',(-x*12).toFixed(1)+'px');el.style.setProperty('--fx-pan-x',(x*10).toFixed(1)+'px');el.style.setProperty('--fx-pan-y',(y*8).toFixed(1)+'px');
        cursor?.classList.toggle('fx-on-project',el.matches('.project'));
      }
      const button=p.target.closest('.fx-magnet');
      if(activeButton!==button){resetButton();activeButton=button;}
      if(button){const r=button.getBoundingClientRect();button.classList.add('fx-magnet-active');button.style.setProperty('--fx-magnet-x',(((p.x-r.left)/r.width-.5)*7).toFixed(1)+'px');button.style.setProperty('--fx-magnet-y',(((p.y-r.top)/r.height-.5)*5).toFixed(1)+'px');}
      if(collage&&p.target.closest('.hero')){const r=collage.getBoundingClientRect();collage.style.setProperty('--fx-hero-x',(((p.x-r.left)/r.width-.5)*10).toFixed(1)+'px');collage.style.setProperty('--fx-hero-y',(((p.y-r.top)/r.height-.5)*8).toFixed(1)+'px');}
      else if(collage){collage.style.setProperty('--fx-hero-x','0px');collage.style.setProperty('--fx-hero-y','0px');}
    });
  },{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget){resetCard();resetButton();}},{passive:true});
  document.addEventListener('pointerdown',e=>{
    const project=e.target.closest('.project');if(project)lastOrigin=project.getBoundingClientRect();
    const press=e.target.closest('.tool,.skill-btn,.coach-preview-tabs button');
    if(press){press.classList.remove('fx-press');requestAnimationFrame(()=>press.classList.add('fx-press'));}
    const button=e.target.closest('.fx-button');if(!button||reduced.matches)return;
    const r=button.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='fx-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.left=(e.clientX-r.left)+'px';ripple.style.top=(e.clientY-r.top)+'px';button.querySelector('.fx-button-sheen')?.append(ripple);
    const a=animate(ripple,[{opacity:.6,scale:.2},{opacity:0,scale:Math.max(r.width,r.height)/10}],{duration:650,easing:'ease-out',fill:'both'});if(a)a.finished.finally(()=>ripple.remove()).catch(()=>{});else ripple.remove();
  },{passive:true});
  function updateScroll(){
    scrollFrame=0;if(!pageReady)return;
    const open=modal?.classList.contains('open');const source=open?modal:document.scrollingElement;
    const distance=Math.max(1,source.scrollHeight-source.clientHeight);const amount=Math.max(0,Math.min(1,source.scrollTop/distance));
    progress.style.transform=`scaleX(${amount})`;progress.style.setProperty('--fx-accent',open?getComputedStyle(modal).getPropertyValue('--case-accent').trim()||'#ea4a13':'#ea4a13');
    if(!open){let current='';for(const s of sections)if(s.getBoundingClientRect().top<innerHeight*.42)current=s.id;
      nav.forEach(a=>{const on=a.getAttribute('href')==='#'+current;a.classList.toggle('fx-current',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
  }
  function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);}
  addEventListener('scroll',()=>{if(activeCard){const r=activeCard.el.getBoundingClientRect();if(!pointer||pointer.y<r.top||pointer.y>r.bottom||pointer.x<r.left||pointer.x>r.right)resetCard();else activeCard.rect=r;}scheduleScroll();},{passive:true});modal?.addEventListener('scroll',scheduleScroll,{passive:true});addEventListener('resize',()=>{resetCard();scheduleScroll();},{passive:true});
  function prepareCase(){
    if(!modal?.classList.contains('open'))return;
    resetCard();resetButton();bindSurface(modal);scheduleScroll();
    if(caseObserver)caseObserver.disconnect();
    caseObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;
      const el=e.target;if(el.classList.contains('fx-heading'))revealHeading(el);
      else if(el.matches('.metric>b,.coach-result-strip b,.sponsor-results b,.channel-growth-metrics b'))numberPop(el);
      else animate(el,[{opacity:0,translate:'0 24px'},{opacity:1,translate:'0 0'}],{duration:850,delay:Number(el.dataset.fxOrder||0)*45,easing,fill:'both'});
      caseObserver.unobserve(el);
    });},{root:modal,threshold:.12,rootMargin:'0px 0px -3% 0px'});
    modal.querySelectorAll('.case-title:not(.has-brand-logo),.case-copy h3,.case-feature-title,.coach-client-header h2,.coach-impact-grid h3').forEach(el=>{heading(el);if(el.querySelector('.fx-word')){el.classList.add('fx-title-wait');caseObserver.observe(el);}});
    const extra=[...modal.querySelectorAll('.coach-client-facts>div,.coach-client-delivery,.coach-client-results,.coach-moves>div,.coach-video-proof,.sponsor-steps article,.sponsor-results article,.channel-growth-card')];
    extra.forEach((el,i)=>{el.dataset.fxOrder=String(i%3);caseObserver.observe(el);});
    modal.querySelectorAll('.metric>b,.coach-result-strip b,.sponsor-results b,.channel-growth-metrics b').forEach(el=>caseObserver.observe(el));
    const wide=desktop(),r=lastOrigin,h=innerHeight,w=innerWidth;
    const inset=r&&wide?`${Math.max(0,Math.min(h,r.top))}px ${Math.max(0,w-r.right)}px ${Math.max(0,h-r.bottom)}px ${Math.max(0,Math.min(w,r.left))}px round 18px`:'4% 3% 2% 3% round 14px';
    animate(modal,[{clipPath:`inset(${inset})`,opacity:.3,transform:'translateY(18px) scale(.985)'},{clipPath:'inset(0px 0px 0px 0px round 0px)',opacity:1,transform:'none'}],{duration:wide?720:480,easing,fill:'both'});
    lastOrigin=null;
  }
  if(modal){const cases=new MutationObserver(()=>{if(modal.classList.contains('open'))requestAnimationFrame(()=>requestAnimationFrame(prepareCase));else{caseObserver?.disconnect();resetCard();resetButton();scheduleScroll();}});cases.observe(modal,{attributes:true,attributeFilter:['class']});}
  document.addEventListener('visibilitychange',()=>{if(document.hidden){resetCard();resetButton();}else scheduleScroll();});
  reduced.addEventListener('change',e=>{if(e.matches){animations.forEach(a=>a.cancel());animations.clear();document.querySelectorAll('.fx-title-wait').forEach(el=>el.classList.remove('fx-title-wait'));resetCard();resetButton();}});
})();
