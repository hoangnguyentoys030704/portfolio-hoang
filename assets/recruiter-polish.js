(()=>{
 const arrows=document.querySelector('.secondary-rail-arrows');
 if(arrows){arrows.querySelector('[data-rail-prev]').innerHTML='<span>TRƯỚC</span><b aria-hidden="true">←</b>';arrows.querySelector('[data-rail-next]').innerHTML='<span>DỰ ÁN TIẾP</span><b aria-hidden="true">→</b>';}
 const modal=document.getElementById('caseModal');
 function render(){
  let block=document.getElementById('metaGrowthAnalysis');
  if(!modal.classList.contains('case-theme-miyako')){if(block)block.hidden=true;return;}
  if(!modal.classList.contains('open'))return;
  if(!block){block=document.createElement('aside');block.id='metaGrowthAnalysis';block.className='meta-analysis';const h=document.createElement('h4');h.textContent='Điểm đáng chú ý';const p=document.createElement('p');p.textContent=cases.miyako.metaAnalysis;const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Xem báo cáo Meta có phần trăm tăng trưởng');const image=document.createElement('img');image.src='assets/miyako-meta-growth-proof.png';image.alt='Báo cáo Meta: lượt xem tăng 53,5%, người xem tăng 32,7%, tương tác tăng 100%';image.loading='lazy';image.decoding='async';button.append(image);button.onclick=()=>veOpenMedia(image.src,'Báo cáo quảng cáo Meta · 09/06–06/09/2026');const note=document.createElement('small');note.textContent='Trích báo cáo dùng để đối chiếu các mức tăng hiển thị bên trên.';block.append(h,p,button,note);document.getElementById('caseMetricNote').after(block);}
  block.hidden=false;
 }
 new MutationObserver(render).observe(modal,{attributes:true,attributeFilter:['class']});
})();
