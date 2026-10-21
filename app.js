(() => {
  'use strict';
  const COURSE = window.VIS_COURSE, QUIZ = window.VIS_QUIZ, RESOURCES = window.VIS_RESOURCES;
  const $ = s => document.querySelector(s);
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icons = {
    home:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    book:'<path d="M12 6c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1v15"/>',
    flask:'<path d="M9 3h6M10 3v6L4 19a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2L14 9V3M7 15h10"/><path d="M9 18h.01M14 17h.01"/>',
    chart:'<path d="M4 3v17h17M7 14l4-5 4 3 6-8"/><path d="M17 4h4v4"/>',
    quiz:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10l2 2 4-4M9 16h6"/>',
    notes:'<path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9M13 5l6-3 3 3-3 6-8 7-5 1 1-5Z"/>',
    folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    arrow:'<path d="M4 12h15M14 6l6 6-6 6"/>',
    chevron:'<path d="m9 5 7 7-7 7"/>',
    search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h2M12 15h2M7 18h2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    leaf:'<path d="M20 3C9 2 2 8 5 15c3 6 14 4 15-12ZM4 21 16 8M9 16v-5M12 13h5"/>',
    database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    workflow:'<rect x="8" y="2" width="8" height="6" rx="1"/><rect x="2" y="16" width="7" height="6" rx="1"/><rect x="15" y="16" width="7" height="6" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
    palette:'<path d="M12 3C6 3 2 7 2 12s4 9 9 9c2 0 3-1 2-3-1-2 0-3 2-3h3c6-1 4-12-6-12Z"/><circle cx="7" cy="10" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/><circle cx="18" cy="11" r="1"/>',
    star:'<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9Z"/>',
    bulb:'<path d="M8 16c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7ZM9 20h6M10 23h4"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    check:'<path d="m5 12 4 4L20 5"/>',
    external:'<path d="M14 3h7v7M21 3 10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
    download:'<path d="M12 3v12M7 10l5 5 5-5M4 16v5h16v-5"/>',
    sliders:'<path d="M4 7h6M14 7h6M4 17h10M18 17h2"/><circle cx="12" cy="7" r="2"/><circle cx="16" cy="17" r="2"/>',
    reset:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
    menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
    bars:'<path d="M5 20V11M12 20V4M19 20V8"/>',
    copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    link:'<path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0M13 6l2-2a4 4 0 0 1 5 5l-5 5a4 4 0 0 1-5 0"/>',
  };
  const icon = (name, cls='') => `<svg class="${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.book}</svg>`;
  const allSections = COURSE.flatMap(c => c.sections.map((s,i) => ({...s,chapter:c.id,index:i,key:`${c.id}-${i}`})));
  const sectionKeys = new Set(allSections.map(s=>s.key));
  const STORAGE_KEY='zhitu-learning-v1';
  let storageAvailable=true, toastTimer, noteTimer, currentQuiz=0, lessonTab='theory', courseFilter='all', notebookFilter='all';
  let quizFilter=0, quizFinished=false;
  let heroMode="bar", guideFilter="all", readingSize=16, focusReading=false;
  const defaultState=()=>({completed:[],stars:[],notes:{},answers:{},last:null,seconds:0});
  function validateState(raw) {
    const next=defaultState();
    if (!raw || typeof raw !== 'object') return next;
    for (const key of ['completed','stars']) if(Array.isArray(raw[key])) next[key]=[...new Set(raw[key].filter(k=>sectionKeys.has(k)))];
    if(raw.notes && typeof raw.notes==='object') for(const [k,v] of Object.entries(raw.notes)) if(sectionKeys.has(k)&&typeof v==='string') next.notes[k]=v.slice(0,30000);
    if(raw.answers && typeof raw.answers==='object') for(const [k,v] of Object.entries(raw.answers)) if(/^\d+$/.test(k)&&QUIZ[+k]&&Number.isInteger(v)&&v>=0&&v<QUIZ[+k].options.length) next.answers[k]=v;
    if(sectionKeys.has(raw.last))next.last=raw.last;
    if(Number.isFinite(raw.seconds)&&raw.seconds>=0)next.seconds=raw.seconds;
    return next;
  }
  let state=defaultState();
  try{state=validateState(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'));}catch{storageAvailable=false;}
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{storageAvailable=false;toast('浏览器存储不可用，当前记录仅在本次打开期间保留。');}}
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
  const percent=()=>Math.round(state.completed.length/allSections.length*100);
  const chapterDone=c=>c.sections.filter((_,i)=>state.completed.includes(`${c.id}-${i}`)).length;
  const sectionHref=(c,i)=>`#lesson/${c}/${i}`;
  const resume=()=>{const next=state.last?allSections.find(s=>s.key===state.last&&!state.completed.includes(s.key)):null;return next||allSections.find(s=>!state.completed.includes(s.key))||allSections[0];};
  const formatTime=seconds=>seconds<60?'刚刚开始':`${Math.floor(seconds/60)} 分钟`;
  function sourceUrl(id){return `https://cinger007.github.io/vis/lesson-0${id}/`;}
  function sidebar(page){
    const links=[['overview','home','学习概览'],['courses','book','课程章节'],['lab','flask','交互实验室'],['charts','chart','图表指南'],['quiz','quiz','知识自测']];
    $('#sidebar').innerHTML=`<a class="brand" href="#overview" aria-label="昕品重制首页"><span class="brand-mark"><img src="./brand-mark.svg" alt="" width="40" height="40"></span><span class="brand-wordmark"><span class="brand-name">昕品重制</span><span class="brand-caption">可视化学习空间</span></span></a><div class="nav-label">学习与探索</div><nav class="nav-list">${links.map(([route,i,t],n)=>`<a class="nav-item ${page===route||page==='lesson'&&route==='courses'?'active':''}" href="#${route}" ${page===route||page==='lesson'&&route==='courses'?'aria-current="page"':''}>${icon(i)}<span>${t}</span><small>0${n+1}</small></a>`).join('')}</nav><div class="nav-label nav-gap">我的学习</div><nav class="nav-list"><a href="#notebook" class="nav-item ${page==='notebook'?'active':''}" ${page==='notebook'?'aria-current="page"':''}>${icon('notes')}<span>笔记与收藏</span><small>${state.stars.length||'+'}</small></a><a href="#resources" class="nav-item ${page==='resources'?'active':''}" ${page==='resources'?'aria-current="page"':''}>${icon('folder')}<span>学习资源</span>${icon('external')}</a></nav><div class="sidebar-bottom"><a href="#lesson/3/1" class="sidebar-note"><div class="sidebar-note-label"><span class="sidebar-feature-label">边学 · 边看 · 边改</span>${icon('workflow')}</div><h4>让知识点动起来</h4><p>27 个小节，讲解、代码与图形实时联动。</p><span class="sidebar-note-link">体验联动学习 ${icon('arrow')}</span></a><div class="sidebar-foot"><span class="status-dot"></span>进度自动记录在本地</div></div>`;
  }
  function heroArt(){
    const values=[34,52,44,68,55,81,71,95,67,106,88,118],w=520,h=292,left=35,bottom=251;
    const x=i=>left+i*41,y=v=>bottom-v*1.64;
    const points=values.map((v,i)=>[x(i)+13,y(v)]);
    const line=points.map((p,i)=>`${i?'L':'M'}${p}`).join(' ');
    let marks='';
    if(heroMode==='bar')marks=values.map((v,i)=>`<rect class="hero-mark" x="${x(i)}" y="${y(v)}" width="25" height="${bottom-y(v)}" rx="4" fill="${i===11?'#edaa54':i%3===0?'#5776ed':i%3===1?'#8c9fef':'#b8c5f7'}" data-tip="${i+1} 月：${v}" tabindex="0" role="img" aria-label="${i+1} 月：${v}"/>`).join('');
    if(heroMode==='line')marks=`<path d="${line} L${points.at(-1)[0]},${bottom} L${points[0][0]},${bottom}Z" fill="url(#studio-area)"/><path class="hero-line" d="${line}" stroke="#4263eb" stroke-width="2.8" fill="none"/>`;
    if(heroMode!=='bar')marks+=points.map(([px,py],i)=>`<circle class="hero-mark" cx="${px}" cy="${py}" r="${heroMode==='dot'?7:4}" fill="${i===11?'#edaa54':'#5776ed'}" stroke="#f3f6ff" stroke-width="2" data-tip="${i+1} 月：${values[i]}" tabindex="0" role="img" aria-label="${i+1} 月：${values[i]}"/>`).join('');
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="首页互动图表：12 个月的合成观测数据，当前显示${{bar:'条形图',line:'折线图',dot:'点图'}[heroMode]}"><defs><linearGradient id="studio-area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7993ee" stop-opacity=".2"/><stop offset="1" stop-color="#7993ee" stop-opacity="0"/></linearGradient></defs>${[0,40,80,120].map(v=>`<line x1="26" x2="510" y1="${y(v)}" y2="${y(v)}" stroke="#dbe3f3" stroke-dasharray="3 6"/><text x="15" y="${y(v)+4}" fill="#8491ab" font-size="10" text-anchor="end">${v}</text>`).join('')}${marks}${values.map((_,i)=>`<text x="${x(i)+13}" y="276" fill="#7a89a3" font-size="10" text-anchor="middle">${String(i+1).padStart(2,'0')}</text>`).join('')}</svg>`;
  }
  function drawHero(){
    const stage=$('#hero-stage');if(!stage)return;stage.innerHTML=heroArt();chartTooltipSetup(stage);
    document.querySelectorAll('[data-hero-mode]').forEach(el=>{const active=el.dataset.heroMode===heroMode;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    const tip=$('#hero-meaning');if(tip)tip.textContent={bar:'比较每个月的数量差异',line:'发现时间中的趋势与转折',dot:'通过位置，读出数值的高低'}[heroMode];
  }
  function chapterArt(id){
    const base='<svg viewBox="0 0 300 140" fill="none" aria-hidden="true">';
    if(id===1)return base+`<path d="M26 111h250M30 23v88" stroke="#b8d5d0"/><path d="m41 98 204-68" stroke="#b6cec8" stroke-dasharray="4 5"/>${[[48,91],[61,78],[77,89],[96,73],[112,61],[131,75],[148,49],[167,60],[190,41],[210,52],[235,28],[259,37]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3+4}" fill="${i===10?'#ed8662':i%2?'#659b92':'#226b63'}" opacity=".85"/>`).join('')}</svg>`;
    if(id===2)return base+`<path d="M62 70h37M99 35v70M99 35h52M99 105h52M178 35h33M211 20v30M211 20h44M211 50h44M178 105h33M211 90v30M211 90h44M211 120h44" stroke="#96b3c1" stroke-width="1.5"/><rect x="25" y="54" width="40" height="32" rx="8" fill="#5e899c"/><rect x="141" y="21" width="40" height="28" rx="6" fill="#9cbcca"/><rect x="141" y="91" width="40" height="28" rx="6" fill="#9cbcca"/>${[20,50,90,120].map((y,i)=>`<circle cx="259" cy="${y}" r="7" fill="${i===2?'#e69a6a':'#8eafbd'}"/>`).join('')}</svg>`;
    if(id===3)return base+`${['#264d60','#4c7e91','#8fb6b8','#d5d9bc','#e7c895','#df9a70','#bd6d58'].map((c,i)=>`<rect x="${21+i*37}" y="${27+Math.abs(i-3)*5}" width="31" height="${92-Math.abs(i-3)*10}" rx="15.5" fill="${c}"/>`).join('')}</svg>`;
    if(id===4)return base+`<path d="M25 112h252M30 22v90M30 67h247" stroke="#ddc9b4" stroke-dasharray="3 4"/><path d="M30 102C53 102 58 55 80 70S116 106 138 56 180 91 204 49 246 67 273 23V112H30Z" fill="#e2b68c" opacity=".22"/><path d="M30 102C53 102 58 55 80 70S116 106 138 56 180 91 204 49 246 67 273 23" stroke="#b87e50" stroke-width="2.5"/><circle cx="138" cy="56" r="4" fill="#fbf3e9" stroke="#b87e50" stroke-width="2"/><circle cx="273" cy="23" r="4" fill="#d88359"/></svg>`;
    return base+`${Array.from({length:91},(_,i)=>`<rect x="${22+Math.floor(i/7)*20}" y="${13+i%7*17}" width="15" height="12" rx="3" fill="${['#e4ead3','#c7d9a5','#9dbb7e','#70965c','#406d49'][(i*7+Math.floor(i/7)*3)%5]}"/>`).join('')}</svg>`;
  }
  function miniArt(type){
    if(type==='bars')return `<svg viewBox="0 0 180 95" fill="none" aria-hidden="true"><path d="M17 78h150M20 15v63" stroke="#d6dfca"/><rect x="34" y="43" width="18" height="35" rx="3" fill="#b0c595"/><rect x="65" y="26" width="18" height="52" rx="3" fill="#7e9f62"/><rect x="96" y="37" width="18" height="41" rx="3" fill="#a8bf8d"/><rect x="127" y="12" width="18" height="66" rx="3" fill="#5d8550"/></svg>`;
    if(type==='line')return `<svg viewBox="0 0 180 95" fill="none" aria-hidden="true"><path d="M15 78h150M20 15v63M20 55h145M20 32h145" stroke="#dce4d0"/><path d="m20 64 23-18 24 10 24-30 24 13 24-24 26 9" stroke="#759a5b" stroke-width="2.5"/><g fill="#f5f8ee" stroke="#759a5b" stroke-width="2"><circle cx="20" cy="64" r="3"/><circle cx="67" cy="56" r="3"/><circle cx="115" cy="39" r="3"/><circle cx="165" cy="24" r="3"/></g></svg>`;
    if(type==='scatter')return `<svg viewBox="0 0 180 95" aria-hidden="true"><path d="M15 78h150M20 15v63" stroke="#d6dfca" fill="none"/>${[[30,66],[42,60],[54,65],[62,47],[73,52],[82,37],[93,49],[101,29],[118,38],[128,21],[143,30],[154,16]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3+3}" fill="${i%2?'#9eb98a':'#6c9454'}" opacity=".8"/>`).join('')}</svg>`;
    if(type==='heatmap')return `<svg viewBox="0 0 180 95" aria-hidden="true">${Array.from({length:60},(_,i)=>`<rect x="${16+Math.floor(i/5)*13}" y="${14+i%5*13}" width="10" height="10" rx="2" fill="${['#e3ebd7','#cadbb2','#a8c18a','#8aaa6d','#5e874c'][(i*7+Math.floor(i/5)*3)%5]}"/>`).join('')}</svg>`;
    if(type==='tree')return `<svg viewBox="0 0 180 95" fill="none" aria-hidden="true"><path d="M35 48h35M70 23v50M70 23h35M70 73h35M110 23h20M130 12v23M130 12h18M130 35h18M110 73h20M130 61v23M130 61h18M130 84h18" stroke="#b6cba0" stroke-width="1.5"/>${[[28,48],[105,23],[105,73],[150,12],[150,35],[150,61],[150,84]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===0?8:5}" fill="${i===0?'#6c8e55':'#a5be87'}"/>`).join('')}</svg>`;
    return `<svg viewBox="0 0 180 95" aria-hidden="true">${['#b3d6da','#5c9ca8','#347287','#f0eedb','#d3ac68','#bb7d42','#975332'].map((c,i)=>`<rect x="${18+i*21}" y="23" width="22" height="49" rx="3" fill="${c}"/>`).join('')}</svg>`;
  }
  function courseCard(c,feature=false,showProgress=false){
    const done=chapterDone(c),total=c.sections.length,remaining=c.sections.findIndex((_,i)=>!state.completed.includes(`${c.id}-${i}`)),href=sectionHref(c.id,remaining<0?0:remaining);
    return `<a class="course-card chapter-${c.id}" href="${href}" data-chapter="${c.id}"><div class="course-card-top"><span class="chapter-no"><small>CHAPTER</small><strong>0${c.id}</strong></span><span class="course-card-state">${done===total?'✓ 已完成':done?'学习中':'基础导学'}</span></div><div class="course-art">${chapterArt(c.id)}</div><div class="course-card-copy"><h3>${c.title}</h3><p>${c.desc}</p><div class="tag-row">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>${showProgress?`<div class="course-status"><span>本章完成度</span><span>${done} / ${total}</span></div><div class="mini-progress"><i style="width:${done/total*100}%"></i></div>`:''}</div><div class="course-card-foot"><div class="course-meta"><span>${icon('book')}${total} 小节</span><span>${icon('clock')}${c.time} 分钟</span></div><span class="card-arrow">${icon('arrow')}</span></div></a>`;
  }
  function practiceCard(){return `<a href="#quiz" class="practice-card"><div class="practice-top"><span>KNOWLEDGE CHECK</span>${icon('quiz')}</div><div class="practice-orbit"><span>?</span><i>A</i><i>B</i><i>C</i></div><h3>理解，值得再确认一次。</h3><p>15 道小测，帮你找到已经掌握的知识，<br>和下一个值得回看的地方。</p><div class="practice-bottom"><span>开始知识自测</span>${icon('arrow')}</div></a>`;}
  function overview(){
    const next=resume(),p=percent(),answered=Object.keys(state.answers).length;
    const date=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(new Date());
    return `<section class="greeting"><div class="greeting-caption"><span class="status-dot"></span>你的可视化学习工作台</div><span class="date-chip">${icon('calendar')}${escape(date)}</span></section>
    <section class="hero-studio"><div class="hero-copy"><div class="hero-label"><span>可视化导论 · 交互式学习</span></div><h1>让每一个概念，<br><span>都清晰可见。</span></h1><p>读懂原理，观察图形，亲手修改代码参数。<br>从五章课程出发，把理解变成自己的能力。</p><div class="hero-buttons"><a class="btn btn-primary" href="${sectionHref(next.chapter,next.index)}">${state.completed.length?'继续学习':'从第一章开始'}${icon('arrow')}</a><a href="#lesson/3/1" class="hero-secondary">体验讲解联动 ${icon('chevron')}</a></div><div class="hero-meta"><span><strong>05</strong> 课程章节</span><i></i><span><strong>27</strong> 联动小节</span><i></i><span><strong>15</strong> 自测题</span></div></div>
    <div class="hero-playground"><div class="playground-top"><span><i></i>一分钟，理解视觉编码</span><span class="playground-symbol">↗</span></div><div class="playground-heading"><div><h2>同一组数据，三种视角</h2><p>切换图形，看看什么更容易被发现。</p></div><span class="playground-count">12<span>个月的观测</span></span></div><div id="hero-stage" class="hero-chart">${heroArt()}</div><div class="playground-bottom"><div class="hero-chart-switch" role="group" aria-label="切换首页图表">${[['bar','条形'],['line','折线'],['dot','点图']].map(([id,t])=>`<button data-hero-mode="${id}" class="${heroMode===id?'active':''}" aria-pressed="${heroMode===id}">${t}</button>`).join('')}</div><span id="hero-meaning">${{bar:'比较数量差异',line:'发现趋势与转折',dot:'通过位置比较高低'}[heroMode]}</span></div><div class="playground-source">合成数据 · 仅用于教学演示</div></div></section>
    <section class="learning-strip" aria-label="我的学习进度"><div class="strip-progress"><div class="progress-ring" role="img" aria-label="已完成 ${p}%"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="none" stroke="#e8ecf5" stroke-width="4"/><circle cx="32" cy="32" r="27" fill="none" stroke="#4263eb" stroke-width="4" stroke-linecap="round" stroke-dasharray="${p/100*169.65} 169.65"/></svg><div class="ring-text"><strong>${p}<small>%</small></strong></div></div><div><strong>我的学习进度</strong><p>已完成 ${state.completed.length} / 27 个小节</p></div></div><a href="${sectionHref(next.chapter,next.index)}" class="strip-resume"><span class="strip-kicker">${state.completed.length?'接着上次继续':'建议从这里开始'}</span><strong><span>0${next.chapter}</span>${next.title}</strong>${icon('arrow')}</a><a href="#notebook" class="strip-notes">${icon('notes')}<span><strong>笔记与收藏</strong><small>${Object.values(state.notes).filter(n=>n.trim()).length} 条笔记 · ${state.stars.length} 个收藏</small></span>${icon('chevron')}</a></section>
    <div class="overview-dashboard"><section class="overview-courses"><div class="section-heading"><div><span class="section-kicker">循序渐进，建立知识框架</span><h2>课程学习路径 <span class="heading-count">05</span></h2></div><a href="#courses">全部课程 ${icon('arrow')}</a></div><div class="course-grid overview-course-grid">${COURSE.map(c=>courseCard(c)).join('')}</div></section>
    <aside class="overview-practice"><section class="experiment-section"><div class="section-heading"><div><span class="section-kicker">带着问题，亲手尝试</span><h2>交互实验室</h2></div><a href="#lab" aria-label="进入交互实验室">${icon('arrow')}</a></div><div class="experiment-grid">${[['encoding','01','视觉编码','位置与长度，怎样影响比较？','bars'],['color','02','色彩语言','用颜色表达数据的秩序。','color'],['curve','03','曲线与比例','比例改变，趋势也变了吗？','line'],['calendar','04','时间纹理','从日历中发现周期。','heatmap']].map(([id,n,t,d,art])=>`<a href="#lab/${id}" class="experiment-card"><div class="experiment-preview">${miniArt(art)}<span>${n}</span></div><h3>${t}${icon('arrow')}</h3><p>${d}</p></a>`).join('')}</div></section>${practiceCard()}</aside></div>
    <section class="learning-method"><span class="method-icon">${icon('bulb')}</span><div><strong>读懂一个概念，再用自己的方式验证。</strong><p>理解概念 → 修改参数 → 观察结果 → 自测回顾。${answered?`已完成 ${answered} 道自测。`:'把每次发现留在学习笔记中。'}</p></div><a class="btn" href="#notebook">打开学习笔记 ${icon('arrow')}</a></section>`;
  }
  function courses(){
    let list=COURSE.filter(c=>courseFilter==='all'||courseFilter==='started'&&chapterDone(c)>0||courseFilter==='pending'&&chapterDone(c)<c.sections.length||courseFilter==='done'&&chapterDone(c)===c.sections.length);
    return `<div class="page-heading"><div class="eyebrow">A PATH FROM DATA TO INSIGHT</div><h1>你的可视化学习地图</h1><p>从基础概念到实际表达，按自己的节奏完成五章学习。每个小节都有目标、示例和关键提醒。</p></div><div class="filter-bar">${[['all','全部课程'],['started','已经开始'],['pending','尚未完成'],['done','已完成']].map(([id,t])=>`<button class="filter-chip ${courseFilter===id?'active':''}" data-course-filter="${id}" aria-pressed="${courseFilter===id}">${t}</button>`).join('')}<span class="course-total-time" style="margin:0 0 0 auto">27 个小节 · 预计 4 小时 · 建议边学边练</span></div>${list.length?`<div class="course-grid all-courses">${list.map(c=>courseCard(c,false,true)).join('')}</div>`:empty('这里还没有课程','先从感兴趣的一章开始，进度会自动汇总到这里。','#courses','查看全部课程')}<div class="about-panel"><h2>怎样学得更扎实？</h2><p>先读小节目标，尝试用自己的话解释概念，再到实验室验证猜想。完成后点击“标记学会”，并用知识自测检查理解。这里的导学是对原课程的学习补充，完整讲解与示例请查看<a href="https://cinger007.github.io/vis/" target="_blank" rel="noopener noreferrer">老师的原课程</a>。</p></div>`;
  }
  function empty(title,desc,url,label){return `<div class="empty-state">${icon('book')}<h2>${title}</h2><p>${desc}</p>${url?`<a href="${url}" class="btn btn-primary" ${url==='#courses'?'data-clear-filter="true"':''}>${label}${icon('arrow')}</a>`:''}</div>`;}
  function lesson(id,index){
    const c=COURSE.find(c=>c.id===id),s=c?.sections[index];if(!s)return notFound();
    state.last=`${id}-${index}`;save();
    const key=state.last,isDone=state.completed.includes(key),isStar=state.stars.includes(key),done=chapterDone(c);
    let body='';
    if(lessonTab==='theory')body=`<div class="learning-goal"><h3>${icon('target')}这一节，你将学会</h3><p>${s.goal}</p></div><h2>理解这个概念</h2>${s.paragraphs.map(p=>`<p>${window.LinkedLessons?window.LinkedLessons.annotate(p,id,index):p}</p>`).join('')}${window.LinkedLessons?.view(id,index)||''}${id===2&&index===0?`<div class="flow-diagram">${[['原始数据','RAW DATA'],['数据变换','TRANSFORM'],['视觉映射','MAPPING'],['视图呈现','VIEW']].map(([t,en],i)=>`${i?icon('arrow'):''}<div class="flow-node">${t}<small>${en}</small></div>`).join('')}</div>`:''}<div class="example-box"><h3>把它放进一个例子</h3><p>${s.example}</p></div><div class="takeaway">${icon('bulb')}<p><strong>记住这一点：</strong>${s.takeaway}</p></div><a class="btn" href="#lab/${c.lab}">${icon('flask')}去交互实验室验证 ${icon('arrow')}</a>`;
    if(lessonTab==='code')body=`<div class="learning-goal"><h3>${icon('book')}读代码，也要理解思路</h3><p>${s.goal}</p></div><div class="code-header"><span>JavaScript · 概念示例</span><button data-copy-code="${key}">${icon('copy')} 复制代码</button></div><pre class="code-block"><code>${escape(s.code)}</code></pre><p class="code-note">含 d3 的片段需要 D3 环境；本页展示概念示例。完整运行示例请使用下方原课程链接，本节“概念讲解”中的联动示例可以直接调参，并查看实际运行代码。</p><div class="example-box"><h3>阅读提示</h3><p>${s.example}</p></div><a href="${sourceUrl(id)}" class="btn" target="_blank" rel="noopener noreferrer">查看原课程完整演示 ${icon('external')}</a>`;
    if(lessonTab==='notes')body=`<div class="note-editor"><h2 style="margin-top:0">用自己的话，留下理解</h2><p>记下一个发现、一个疑问，或者一个需要再做一次的实验。输入后自动保存，也可以手动保存。</p><textarea id="lesson-note" data-note-key="${key}" placeholder="例如：我发现改变纵轴起点，会放大条形之间的视觉差异……" maxlength="30000" aria-label="本节学习笔记">${escape(state.notes[key]||'')}</textarea><div class="note-editor-actions"><button class="btn btn-primary" data-save-note="${key}">${icon('check')}保存笔记</button><span class="note-status" id="note-status">${state.notes[key]?'已保存到当前浏览器':'支持纯文本，最多 30,000 字符'}</span></div><p>可以在“笔记与收藏”中统一查看，并导出学习记录备份。</p></div>`;
    const linearIndex=allSections.findIndex(a=>a.key===key),next=allSections[linearIndex+1],prev=allSections[linearIndex-1];
    return `<div class="lesson-layout"><aside class="lesson-nav"><h2>第 ${id} 章 · ${c.title}</h2><div>${c.sections.map((part,i)=>`<a href="${sectionHref(id,i)}" class="${index===i?'active':''}" ${index===i?'aria-current="page"':''}><span>${state.completed.includes(`${id}-${i}`)?'✓':`${id}.${i+1}`}</span><span>${part.title}</span></a>`).join('')}</div><div class="mini-progress"><i style="width:${done/c.sections.length*100}%"></i></div><p>本章已完成 ${done} / ${c.sections.length} 个小节</p></aside><article class="lesson-paper"><header class="lesson-title"><div class="eyebrow">CHAPTER 0${id} / LESSON 0${index+1}</div><h1>${id}.${index+1} ${s.title}</h1><p>${s.intro}</p><div class="lesson-title-foot"><span>${icon('clock')} 约 ${s.minutes} 分钟</span><span>${isDone?'✓ 已标记学会':'尚未完成'}</span><button class="btn-text" data-star="${key}" aria-pressed="${isStar}">${icon('star')}${isStar?'已收藏':'收藏本节'}</button></div></header><div class="reading-toolbar"><span>学习手记 / ${String(id).padStart(2,"0")}.${String(index+1).padStart(2,"0")}</span><div><button data-reading-size="-1" aria-label="减小正文字号">A−</button><output id="reading-size">${readingSize}px</output><button data-reading-size="1" aria-label="增大正文字号">A+</button><span class="reading-divider"></span><button data-focus-reading="true" aria-pressed="${focusReading}">${icon("book")}${focusReading?"退出专注":"专注阅读"}</button></div></div><div class="lesson-tabs" role="tablist" aria-label="学习内容">${[['theory','概念讲解'],['code','关键代码'],['notes','我的笔记']].map(([tab,t])=>`<button class="lesson-tab ${lessonTab===tab?'active':''}" role="tab" id="tab-${tab}" aria-selected="${lessonTab===tab}" aria-controls="lesson-panel" tabindex="${lessonTab===tab?0:-1}" data-lesson-tab="${tab}">${t}</button>`).join('')}</div><div class="lesson-body" id="lesson-panel" role="tabpanel" aria-labelledby="tab-${lessonTab}">${body}<div class="lesson-source">${icon('link')}导学结构依据原课程；新编文字用于辅助理解。<a href="${sourceUrl(id)}" target="_blank" rel="noopener noreferrer">查看本章原课件 ↗</a></div><div class="lesson-actions"><button class="btn ${isDone?'':'btn-primary'}" data-complete="${key}" aria-pressed="${isDone}">${icon('check')}${isDone?'已学会 · 取消标记':'标记学会'}</button>${prev?`<a class="btn" href="${sectionHref(prev.chapter,prev.index)}">上一节</a>`:''}${next?`<a class="btn next-section" href="${sectionHref(next.chapter,next.index)}">下一节 ${icon('arrow')}</a>`:`<a class="btn next-section" href="#quiz">检验学习成果 ${icon('arrow')}</a>`}</div></div></article></div>`;
  }
  const labMeta={encoding:{title:'视觉编码实验',desc:'同一份数据，换一种表达，看看信息如何改变。',icon:'bars'},color:{title:'配色实验',desc:'让配色与数据语义相匹配，建立清晰的视觉顺序。',icon:'palette'},curve:{title:'曲线与比例',desc:'数据不变，改变曲线连接与图表比例，观察趋势的感知变化。',icon:'chart'},calendar:{title:'日历热图',desc:'把时间展开成纹理，寻找一年中的节奏与周期。',icon:'calendar'}};
  const labDefaults={encoding:{type:'bar',dataset:'students',sort:'original',baseline:true,labels:true},color:{type:'sequential',scheme:'green',gray:false},curve:{curve:'linear',height:280,points:true},calendar:{threshold:0,palette:'green'}};
  let labSettings=JSON.parse(JSON.stringify(labDefaults));
  const datasets={students:{label:'各专业新生人数',unit:'人',categories:['计算机','地理信息','应用数学','环境科学','经济学','新能源'],values:[86,62,74,48,67,55]},books:{label:'一周阅读页数',unit:'页',categories:['周一','周二','周三','周四','周五','周六','周日'],values:[22,35,18,42,28,56,45]}};
  const curveValues=[32,49,41,72,58,86,65,94,76,105,89,116];
  const paletteSets={green:['#edf3df','#dde8c8','#c9dcad','#b0ca8b','#98b571','#7c9d58','#628347','#426537'],blue:['#edf3f7','#d6e5f0','#bbd3e6','#94b9d5','#6a9bbb','#4d7f9e','#36637e','#244c65'],viridis:['#440154','#46327e','#365c8d','#277f8e','#1fa187','#4ac16d','#a0da39','#fde725'],diverging:['#326987','#5e95b0','#a6c9d6','#e0edf0','#f3ebd4','#e0c58e','#c29152','#985b35'],categorical:['#397e68','#6793b6','#c49d59','#9b88ae','#c28373','#86aa78','#818fa8','#b5ac70']};
  function lab(type){
    if(!labMeta[type])type='encoding'; const meta=labMeta[type];
    return `<div class="page-heading"><div class="eyebrow">LESS WATCHING. MORE EXPLORING.</div><h1>让概念，触手可及</h1><p>调一个参数，提一个问题，看一次变化。每个实验都在浏览器中实时运行，无需视频与额外下载。</p></div><nav class="lab-tabs" aria-label="选择交互实验">${Object.entries(labMeta).map(([id,m])=>`<a href="#lab/${id}" class="lab-tab ${type===id?'active':''}" ${type===id?'aria-current="page"':''}>${icon(m.icon)}<span><strong>${m.title}</strong><small>${['encoding','color','curve','calendar'].indexOf(id)+1} / 交互探索</small></span></a>`).join('')}</nav><div class="lab-layout"><section class="chart-panel"><div class="chart-panel-header"><div><h2>${meta.title}</h2><p>${meta.desc}</p></div><span class="small-badge">LIVE EXPERIMENT</span></div><p class="chart-scroll-hint">左右滑动图表，查看完整刻度与数值</p><div id="chart-stage" class="chart-stage ${type==='calendar'?'calendar-chart-stage':''}"></div><div class="chart-caption"><span>${type==='calendar'?'2026 年固定生成的合成数据，仅用于教学':'教学合成数据，不代表真实调查结果'}</span><span>SVG 绘制 · 零外部依赖</span></div><details class="data-details"><summary>查看实验数据与说明</summary><div id="lab-data"></div></details></section><aside class="controls-panel" id="lab-controls">${controls(type)}</aside></div><div class="lab-insight">${labInsights(type)}</div>`;
  }
  function selectControl(label,key,options,value){return `<div class="control"><label for="control-${key}">${label}</label><select id="control-${key}" data-lab-setting="${key}">${options.map(([v,t])=>`<option value="${v}" ${String(value)===v?'selected':''}>${t}</option>`).join('')}</select></div>`;}
  function checkControl(label,key,value){return `<label class="check-control"><input type="checkbox" data-lab-setting="${key}" ${value?'checked':''}>${label}</label>`;}
  function controls(type){
    const s=labSettings[type];let html=`<h2>${icon('sliders')}实验控制台</h2>`;
    if(type==='encoding')html+=selectControl('示例数据','dataset',[['students','各专业新生人数'],['books','一周阅读页数']],s.dataset)+selectControl('图表类型','type',[['bar','条形图 · 比较数量'],['dot','点图 · 比较位置']],s.type)+selectControl('排列顺序','sort',[['original','原始顺序'],['desc','从多到少'],['asc','从少到多']],s.sort)+checkControl('数量轴从零开始','baseline',s.baseline)+checkControl('显示数值标签','labels',s.labels)+`<div class="controls-hint">试着关闭“从零开始”：条形长度的视觉差距被放大了。比较条形长度时应保留零基线。</div>`;
    if(type==='color')html+=selectControl('数据语义','type',[['sequential','顺序 · 从低到高'],['diverging','发散 · 偏离中心'],['categorical','定性 · 区分类别']],s.type)+selectControl('顺序色带','scheme',[['green','自然绿'],['blue','静谧蓝'],['viridis','Viridis']],s.scheme)+checkControl('灰度预览（检查明暗层级）','gray',s.gray)+`<div class="controls-hint">点击任意色块复制色值。灰度仅检查明暗，不是色觉缺陷模拟；分类图应同时保留文字标签。</div>`;
    if(type==='curve')html+=selectControl('连接方式','curve',[['linear','线性连接'],['step','阶梯连接（后阶梯）'],['smooth','单调三次插值']],s.curve)+`<div class="control"><label for="control-height">图表高度 <output id="height-output">${s.height} px</output></label><input type="range" id="control-height" data-lab-setting="height" min="180" max="420" step="10" value="${s.height}"></div>`+checkControl('显示原始采样点','points',s.points)+`<div class="controls-hint">拖动高度时，数据始终不变。平滑曲线不等于新增了观测，采样点帮助你区分已知数据与连接方式。</div>`;
    if(type==='calendar')html+=`<div class="control"><label for="control-threshold">仅突出不低于 <output id="threshold-output">${s.threshold} 次</output></label><input type="range" id="control-threshold" data-lab-setting="threshold" min="0" max="90" step="5" value="${s.threshold}"></div>`+selectControl('热图配色','palette',[['green','自然绿'],['blue','静谧蓝']],s.palette)+`<div class="controls-hint">每个格子代表一天。移动到格子上可查看日期与数值，淡灰色表示低于筛选阈值。原始数据仍保留在下方数据表。</div>`;
    return html+`<button class="btn full-width" data-download-lab="${type}">${icon('download')}${type==='color'?'导出配色色值':'下载实验 CSV'}</button><button class="btn-text full-width" style="margin-top:14px" data-reset-lab="${type}">${icon('reset')}恢复默认设置</button>`;
  }
  function labInsights(type){const data={encoding:[['01 / THINK','位置还是长度？','点图依靠共同轴上的位置，条形图同时表达位置与长度。'],['02 / COMPARE','改变顺序，不改变数据','排序能更快找到最大值，但时间类数据通常应保留时间顺序。'],['03 / TAKEAWAY','警惕截断坐标轴','条形轴不从零开始，容易夸大数量差异；点图需清楚标注轴范围。']],color:[['01 / THINK','类别有没有顺序？','无序类别使用定性色带；有序数量使用顺序色带。'],['02 / COMPARE','中心有没有含义？','当 0 或某个基准值得强调时，使用有明确中点的发散色带。'],['03 / TAKEAWAY','颜色之外，还要有线索','保留标签与形状，避免把读者的理解完全交给颜色。']],curve:[['01 / THINK','点之间发生了什么？','直线、阶梯和平滑都包含假设，应与数据生成机制一致。'],['02 / COMPARE','看起来陡，真的更快吗？','绘图比例能改变斜率感知，比较趋势要检查坐标轴。'],['03 / TAKEAWAY','区分观测与插值','曲线只是连接方式；本实验始终只有 12 个原始样本。']],calendar:[['01 / THINK','为什么排成日历？','星期和月份位置让每周与季节性的模式更容易被辨认。'],['02 / COMPARE','筛选后发生了什么？','阈值只改变突出显示的格子，不会删除或修改原始值。'],['03 / TAKEAWAY','别让颜色替代数值','热图适合寻找模式，精确读数仍需提示、图例与数据表。']]};return data[type].map(([n,t,p])=>`<div class="insight-card"><span>${n}</span><h3>${t}</h3><p>${p}</p></div>`).join('');}
  function chartTooltipSetup(stage){
    const tooltip=document.createElement('div');tooltip.className='chart-tooltip';tooltip.hidden=true;stage.appendChild(tooltip);
    const show=el=>{tooltip.textContent=el.getAttribute('data-tip');tooltip.hidden=false;const r=stage.getBoundingClientRect(),b=el.getBoundingClientRect();tooltip.style.left=Math.max(8,Math.min(b.left-r.left,stage.clientWidth-tooltip.offsetWidth-8))+'px';tooltip.style.top=Math.max(5,b.top-r.top-42)+'px';};
    stage.querySelectorAll('[data-tip]').forEach(el=>{el.addEventListener('pointerenter',()=>show(el));el.addEventListener('pointerleave',()=>tooltip.hidden=true);el.addEventListener('focus',()=>show(el));el.addEventListener('blur',()=>tooltip.hidden=true);});
  }
  function table(headers,rows){return `<div style="overflow:auto;max-height:300px"><table class="data-table"><thead><tr>${headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
  function renderExperiment(type){
    const stage=$('#chart-stage');if(!stage)return;
    if(type==='encoding')renderEncoding(stage);
    if(type==='color')renderColor(stage);
    if(type==='curve')renderCurve(stage);
    if(type==='calendar')renderCalendar(stage);
    chartTooltipSetup(stage);
  }
  function renderEncoding(stage){
    const s=labSettings.encoding,data=datasets[s.dataset];let rows=data.categories.map((name,i)=>({name,value:data.values[i]}));
    if(s.sort==='desc')rows.sort((a,b)=>b.value-a.value);if(s.sort==='asc')rows.sort((a,b)=>a.value-b.value);
    const w=660,h=340,left=92,right=54,top=35,bottom=45,max=Math.ceil(Math.max(...data.values)/10)*10,min=s.baseline?0:Math.floor(Math.min(...data.values)*.75/10)*10;
    const x=v=>left+(v-min)/(max-min)*(w-left-right),rowHeight=(h-top-bottom)/rows.length;
    let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${data.label}，${s.type==='bar'?'条形图':'点图'}。坐标轴范围 ${min} 至 ${max} ${data.unit}"><title>${data.label}（合成数据）</title>`;
    for(let i=0;i<=4;i++){const v=min+(max-min)*i/4;svg+=`<line x1="${x(v)}" x2="${x(v)}" y1="${top-8}" y2="${h-bottom}" stroke="#e9eee1" stroke-dasharray="3 5"/><text x="${x(v)}" y="${h-bottom+23}" font-size="11" text-anchor="middle" fill="#99a78b">${Number(v.toFixed(1))}</text>`;}
    rows.forEach((r,i)=>{const cy=top+i*rowHeight+rowHeight/2,fill=i===0?'#63864d':'#a1b983';svg+=`<text x="${left-17}" y="${cy+4}" font-size="11" text-anchor="end" fill="#869978">${r.name}</text>`;
      if(s.type==='bar')svg+=`<rect x="${left}" y="${cy-rowHeight*.25}" width="${Math.max(0,x(r.value)-left)}" height="${rowHeight*.5}" rx="4" fill="${fill}" tabindex="0" role="img" aria-label="${r.name} ${r.value} ${data.unit}" data-tip="${r.name}：${r.value} ${data.unit}"/>`;
      else svg+=`<line x1="${left}" x2="${x(r.value)}" y1="${cy}" y2="${cy}" stroke="#d9e5c8" stroke-width="2"/><circle cx="${x(r.value)}" cy="${cy}" r="7" fill="${fill}" tabindex="0" role="img" aria-label="${r.name} ${r.value} ${data.unit}" data-tip="${r.name}：${r.value} ${data.unit}"/>`;
      if(s.labels)svg+=`<text x="${x(r.value)+13}" y="${cy+4}" fill="#799367" font-size="11">${r.value}</text>`;
    });
    svg+=`<text x="${w-right}" y="${h-6}" fill="#9aa78d" font-size="10" text-anchor="end">${data.unit}${min?' · 注意：数量轴已截断':''}</text></svg>`;
    stage.innerHTML=svg+`<div class="chart-legend"><span><i class="legend-dot" style="background:#a1b983"></i>合成数据 · ${data.label}</span><span>${s.sort==='original'?'原始顺序':s.sort==='asc'?'升序排列':'降序排列'}${!s.baseline?' · 轴起点 '+min:''}</span></div>`;
    $('#lab-data').innerHTML=table(['类别',`${data.label}（${data.unit}）`],rows.map(r=>[r.name,r.value]));
  }
  const grayHex=hex=>{const rgb=[1,3,5].map(p=>parseInt(hex.slice(p,p+2),16));const y=Math.round(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]);return '#'+y.toString(16).padStart(2,'0').repeat(3);};
  function currentColors(){const s=labSettings.color;return s.type==='categorical'?paletteSets.categorical:s.type==='diverging'?paletteSets.diverging:paletteSets[s.scheme];}
  function renderColor(stage){
    const s=labSettings.color,original=currentColors(),colors=original.map(c=>s.gray?grayHex(c):c),n=colors.length;
    stage.innerHTML=`<div class="color-preview"><h3>${s.type==='sequential'?'顺序色带 · 连续数量':s.type==='diverging'?'发散色带 · 以 0 为基准的偏离':'定性色带 · 相互独立的类别'}</h3><div class="palette-swatches">${colors.map((c,i)=>`<button class="palette-swatch" style="background:${c};color:${parseInt(grayHex(c).slice(1,3),16)>145?'#314432':'#f8fbf4'}" data-copy-color="${original[i]}" aria-label="复制第 ${i+1} 个原始色值 ${original[i]}"><small>${s.type==='categorical'?String.fromCharCode(65+i):s.type==='diverging'?[-40,-25,-10,-2,2,10,25,40][i]:i*10}</small><span>${s.gray?'灰度预览':original[i].toUpperCase()}</span></button>`).join('')}</div><div class="color-legend"><span>${s.type==='categorical'?'不同类别，无数量顺序':s.type==='diverging'?'负向偏差':'低值'}</span><span>${s.type==='categorical'?'文字与颜色共同识别':s.type==='diverging'?'正向偏差':'高值'}</span></div><h3 style="margin-top:30px">应用到图表中</h3><svg viewBox="0 0 630 160" role="img" aria-label="色带应用示例。每条色带都有文字标签。">${colors.map((c,i)=>`<rect x="${38+i*73}" y="${125-(i%4+2)*18}" width="39" height="${(i%4+2)*18}" rx="3" fill="${c}"/><text x="${57+i*73}" y="148" fill="#91a080" font-size="11" text-anchor="middle">${s.type==='categorical'?String.fromCharCode(65+i):s.type==='diverging'?[-40,-25,-10,-2,2,10,25,40][i]:i*10}</text>`).join('')}</svg></div>`;
    $('#lab-data').innerHTML=table(['序号','原始色值','当前预览色值'],colors.map((c,i)=>[i+1,original[i].toUpperCase(),c.toUpperCase()]));
    const scheme=$('#control-scheme');if(scheme){scheme.disabled=s.type!=='sequential';scheme.closest('.control').style.opacity=s.type==='sequential'?'1':'.5';}
  }
  function monotonePath(points){
    // 单调 Hermite 插值；限制切线，避免曲线在单个区间越过端点值。
    const n=points.length,slopes=points.slice(1).map((p,i)=>(p[1]-points[i][1])/(p[0]-points[i][0])),m=Array(n);
    m[0]=slopes[0];m[n-1]=slopes[n-2];
    for(let i=1;i<n-1;i++)m[i]=slopes[i-1]*slopes[i]<=0?0:(slopes[i-1]+slopes[i])/2;
    for(let i=0;i<n-1;i++){if(slopes[i]===0){m[i]=m[i+1]=0;continue;}const a=m[i]/slopes[i],b=m[i+1]/slopes[i],norm=a*a+b*b;if(norm>9){const t=3/Math.sqrt(norm);m[i]=t*a*slopes[i];m[i+1]=t*b*slopes[i];}}
    let d=`M${points[0][0]},${points[0][1]}`;
    for(let i=0;i<n-1;i++){const h=(points[i+1][0]-points[i][0])/3;d+=` C${points[i][0]+h},${points[i][1]+m[i]*h} ${points[i+1][0]-h},${points[i+1][1]-m[i+1]*h} ${points[i+1][0]},${points[i+1][1]}`;}
    return d;
  }
  function renderCurve(stage){
    const s=labSettings.curve,w=660,h=s.height+65,left=43,right=27,top=22,bottom=40;
    const x=i=>left+i/(curveValues.length-1)*(w-left-right),y=v=>h-bottom-v/120*(h-top-bottom),points=curveValues.map((v,i)=>[x(i),y(v)]);
    let path='';if(s.curve==='smooth')path=monotonePath(points);else if(s.curve==='step'){path=`M${points[0]}`;for(let i=1;i<points.length;i++)path+=` H${points[i][0]} V${points[i][1]}`;}else path=points.map((p,i)=>`${i?'L':'M'}${p}`).join(' ');
    stage.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="十二个月的合成观测值，${s.curve==='smooth'?'单调三次插值':s.curve==='step'?'阶梯连接':'线性连接'}，图表高度 ${s.height} 像素"><title>数据不变，观察连接方式与图表比例</title>${[0,30,60,90,120].map(v=>`<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="#e8eee0" stroke-dasharray="3 5"/><text x="${left-12}" y="${y(v)+4}" font-size="10" fill="#98a58b" text-anchor="end">${v}</text>`).join('')}<path d="${path} L${w-right},${h-bottom} L${left},${h-bottom} Z" fill="#f0f5e8"/><path d="${path}" fill="none" stroke="#769957" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>${points.map(([px,py],i)=>`${s.points?`<circle cx="${px}" cy="${py}" r="4" fill="#fff" stroke="#7b9b5e" stroke-width="2" tabindex="0" role="img" aria-label="${i+1} 月：${curveValues[i]}" data-tip="${i+1} 月：${curveValues[i]}"/>`:''}<text x="${px}" y="${h-13}" font-size="10" fill="#96a489" text-anchor="middle">${i+1}月</text>`).join('')}</svg><div class="chart-legend"><span><i class="legend-dot" style="background:#7b9b5e"></i>原始观测：12 个样本</span><span>纵轴始终为 0–120</span></div>`;
    const out=$('#height-output');if(out)out.value=s.height+' px';
    $('#lab-data').innerHTML=table(['月份','观测值（合成）'],curveValues.map((v,i)=>[`${i+1} 月`,v]));
  }
  function calendarData(){const list=[];for(let i=0;i<365;i++){const date=new Date(Date.UTC(2026,0,1+i)),weekday=date.getUTCDay();const seasonal=20*Math.sin(i/365*Math.PI*2-1);const wave=12*Math.sin(i*.21)+8*Math.cos(i*.73);list.push({date:date.toISOString().slice(0,10),day:weekday,index:i,value:Math.max(0,Math.min(100,Math.round(42+seasonal+wave+(weekday===0||weekday===6?-16:10))))});}return list;}
  const calendarRows=calendarData();
  function renderCalendar(stage){
    const s=labSettings.calendar,colors=paletteSets[s.palette],startDay=4,cell=11,w=660,h=177,left=32,top=31;
    const color=v=>colors[Math.min(7,Math.floor(v/100*8))];
    let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="2026 年日历热图；周为列，星期为行。低于 ${s.threshold} 次的格子显示为灰色。完整数值在下方数据表。"><title>2026 年合成活动数据日历热图</title>`;
    ['日','一','二','三','四','五','六'].forEach((d,i)=>{svg+=`<text x="15" y="${top+i*cell+8}" text-anchor="middle" font-size="8" fill="#9aa78b">${d}</text>`;});
    for(let month=0;month<12;month++){const day=Math.round((Date.UTC(2026,month,1)-Date.UTC(2026,0,1))/86400000),week=Math.floor((day+startDay)/7);svg+=`<text x="${left+week*cell}" y="16" font-size="9" fill="#8f9f7e">${month+1}月</text>`;}
    calendarRows.forEach(d=>{const week=Math.floor((d.index+startDay)/7);svg+=`<rect x="${left+week*cell}" y="${top+d.day*cell}" width="8.5" height="8.5" rx="1.6" fill="${d.value<s.threshold?'#edf0e8':color(d.value)}" data-tip="${d.date} · ${d.value} 次${d.value<s.threshold?'（低于筛选阈值）':''}"><title>${d.date}：${d.value} 次</title></rect>`;});
    svg+=`<text x="${w-154}" y="141" font-size="8" fill="#9aaa8b">少</text>${[0,2,4,6,7].map((idx,i)=>`<rect x="${w-135+i*15}" y="132" width="11" height="11" rx="2" fill="${colors[idx]}"/>`).join('')}<text x="${w-52}" y="141" font-size="8" fill="#9aaa8b">多</text></svg>`;
    const visible=calendarRows.filter(d=>d.value>=s.threshold).length;
    stage.innerHTML=svg+`<p class="calendar-hint">周为列 · 星期为行 · 当前突出 <strong>${visible}</strong> / 365 天 · 阈值 ${s.threshold} 次</p><div class="chart-legend"><span><i class="legend-dot" style="background:#edf0e8"></i>低于阈值</span><span><i class="legend-dot" style="background:${colors[0]}"></i>0–12 次</span><span><i class="legend-dot" style="background:${colors[7]}"></i>88–100 次</span></div>`;
    const out=$('#threshold-output');if(out)out.value=s.threshold+' 次';
    $('#lab-data').innerHTML=table(['日期','星期','数值（次）','筛选状态'],calendarRows.map(d=>[d.date,['日','一','二','三','四','五','六'][d.day],d.value,d.value>=s.threshold?'突出显示':'低于阈值']));
  }
  function charts(){
    const data=[['bars','条形图','比较类别之间的数量大小。共同基线让差异一目了然。','类别 + 数量','比较、排名','避免截断数量轴','encoding'],['line','折线图','沿时间轴观察趋势、波动与转折。','时间 + 数量','趋势、变化','明确时间间隔与缺失','curve'],['scatter','散点图','用位置揭示两个数值变量的关系与离群点。','数量 + 数量','关系、分布','相关关系不等于因果','encoding'],['heatmap','日历热图','把一天映射为一格，在时间纹理中发现周期。','日期 + 数量','周期、密度','配合图例和精确数值','calendar'],['tree','节点连接树','通过层级和连线展示分类结构与父子关系。','层级数据','分类、结构','控制标签与连线拥挤','encoding'],['color','颜色编码','让数据语义与颜色结构形成一致的阅读方式。','类别 / 连续 / 偏差','区分、顺序、偏离','类别不宜过多，保留标签','color']];
    const filtered=data.filter(d=>guideFilter==='all'||d[0]===guideFilter);
    return `<div class="page-heading"><div class="eyebrow">THE RIGHT CHART FOR THE RIGHT QUESTION</div><h1>好的图表，从好问题开始。</h1><p>先明确读者需要发现什么，再决定用哪一种视觉语言。</p></div><section class="chart-decision"><div><span class="section-kicker">CHART FINDER</span><h2>你想让读者看见什么？</h2><p>选一个阅读任务，找到合适的起点。</p></div><div class="decision-options" role="group" aria-label="按阅读任务选择图表">${[['all','全部图表'],['bars','比较数量'],['line','观察趋势'],['scatter','寻找关系'],['heatmap','发现周期'],['tree','梳理层级'],['color','表达颜色']].map(([key,t])=>`<button class="filter-chip ${guideFilter===key?'active':''}" data-guide-filter="${key}" aria-pressed="${guideFilter===key}">${t}</button>`).join('')}</div></section><div class="chart-guide" aria-live="polite">${filtered.map(([art,title,desc,dt,task,tip,labId])=>`<article class="guide-card"><div class="guide-art">${miniArt(art)}<span class="guide-art-label">${art.toUpperCase()}</span></div><div class="guide-copy"><h2>${title}</h2><p>${desc}</p><div class="guide-use"><div><strong>适合数据</strong>${dt}</div><div><strong>阅读任务</strong>${task}</div><div><strong>注意事项</strong>${tip}</div></div><a href="${art==='scatter'?sectionHref(1,2):art==='tree'?sectionHref(2,2):'#lab/'+labId}" class="btn-text">${art==='scatter'?'学习位置编码':art==='tree'?'学习树布局':'进入相关实验'} ${icon('arrow')}</a></div></article>`).join('')}</div><div class="about-panel"><h2>先把一个问题说清楚。</h2><p>比较类别数量，先试条形图；看时间变化，先试折线图；找两个数值的关系，先试散点图。基础图表清楚表达后，再尝试更复杂的形式。</p></div>`;
  }
  function quizIndices(){return QUIZ.map((q,i)=>i).filter(i=>!quizFilter||QUIZ[i].chapter===quizFilter);}
  function quiz(){
    const indices=quizIndices();currentQuiz=Math.min(Math.max(0,currentQuiz),indices.length-1);
    const answered=indices.filter(i=>state.answers[i]!==undefined).length,correct=indices.filter(i=>state.answers[i]===QUIZ[i].answer).length;
    const idx=indices[currentQuiz],q=QUIZ[idx],choice=state.answers[idx],isAnswered=choice!==undefined;
    const header=`<div class="page-heading page-heading-row"><div><div class="eyebrow">CHECK WHAT YOU UNDERSTAND</div><h1>把“看懂”，变成“学会”</h1><p>每道题都有即时反馈和解析。答错没关系，回到知识点，再试一次。</p></div><select id="quiz-chapter" class="quiz-select" aria-label="按章节练习"><option value="0">全部章节 · 15 题</option>${COURSE.map(c=>`<option value="${c.id}" ${quizFilter===c.id?'selected':''}>第 ${c.id} 章 · ${c.title}</option>`).join('')}</select></div>`;
    if(quizFinished&&answered===indices.length)return header+`<section class="quiz-card"><div class="quiz-summary"><div class="eyebrow">YOUR LEARNING CHECKPOINT</div><h2>${correct===indices.length?'掌握得很扎实，继续保持！':'每次复盘，都是一次进步。'}</h2><div class="score">${correct}<span style="font-size:24px;color:#b0bba0;letter-spacing:0"> / ${indices.length}</span></div><p>正确率 ${Math.round(correct/indices.length*100)}% · ${quizFilter?'第 '+quizFilter+' 章':'全部章节'} · 答题记录已保存在当前浏览器</p><div class="quiz-summary-actions"><button class="btn btn-primary" data-retry-quiz="true">${icon('reset')}重新练习</button><a href="#courses" class="btn">回到课程 ${icon('arrow')}</a></div></div>${indices.filter(i=>state.answers[i]!==QUIZ[i].answer).map(i=>{const item=QUIZ[i];return `<article class="review-item"><h3>${item.q}</h3><p>你的选择：${item.options[state.answers[i]]}；正确答案：${item.options[item.answer]}。</p><p>${item.why}</p><a href="${sectionHref(item.chapter,item.section)}">回顾对应知识点 →</a></article>`;}).join('')}</section>`;
    return header+`<div class="quiz-layout"><section class="quiz-card"><div class="quiz-status"><span>第 ${currentQuiz+1} / ${indices.length} 题</span><strong>第 ${q.chapter} 章 · ${COURSE[q.chapter-1].title}</strong></div><div class="quiz-progress"><i style="width:${answered/indices.length*100}%"></i></div><h2>${q.q}</h2><div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option ${isAnswered&&i===q.answer?'correct':''} ${choice===i&&i!==q.answer?'incorrect':''}" data-answer="${i}" data-question="${idx}" ${isAnswered?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${o}</span>${isAnswered&&i===q.answer?`<span style="margin-left:auto">✓ 正确</span>`:choice===i&&i!==q.answer?'<span style="margin-left:auto">× 你的选择</span>':''}</button>`).join('')}</div>${isAnswered?`<div class="quiz-feedback ${choice===q.answer?'':'wrong'}" role="status"><h3>${choice===q.answer?'✓ 回答正确':'再理解一次，你会记得更牢'}</h3><p>${q.why}</p><a class="btn-text" href="${sectionHref(q.chapter,q.section)}">回顾对应知识点 ${icon('arrow')}</a></div>`:''}<div class="quiz-bottom"><button class="btn" data-quiz-move="-1" ${currentQuiz===0?'disabled':''}>上一题</button>${answered===indices.length?'<button class="btn btn-primary" data-quiz-results="true">查看学习报告 →</button>':`<button class="btn btn-primary" data-quiz-move="1" ${!isAnswered?'disabled':''}>${currentQuiz===indices.length-1?'回到未答题':'下一题'} ${icon('arrow')}</button>`}</div></section><aside class="panel quiz-sidebar"><div class="panel-header"><h2>练习进度</h2>${icon('quiz')}</div><div class="quiz-grid">${indices.map((i,n)=>`<button class="quiz-num ${n===currentQuiz?'current':''} ${state.answers[i]!==undefined?state.answers[i]===QUIZ[i].answer?'correct':'wrong':''}" data-quiz-index="${n}" aria-label="第 ${n+1} 题${state.answers[i]===undefined?'，未答':state.answers[i]===QUIZ[i].answer?'，正确':'，需复习'}">${n+1}</button>`).join('')}</div><div class="panel-separator"></div><p class="section-note" style="margin-bottom:0">已完成 ${answered} / ${indices.length} 题<br>正确 ${correct} 题 · 待复习 ${answered-correct} 题<br>字母与文字同时标记答题结果。</p><button class="btn-text" data-retry-quiz="true" style="margin-top:18px">${icon('reset')}清空本组并重练</button></aside></div>`;
  }
  function notebook(){
    const items=allSections.filter(s=>(state.stars.includes(s.key)||state.notes[s.key]?.trim())&&(notebookFilter==='all'||notebookFilter==='stars'&&state.stars.includes(s.key)||notebookFilter==='notes'&&state.notes[s.key]?.trim()));
    return `<div class="page-heading page-heading-row"><div><div class="eyebrow">MAKE KNOWLEDGE YOUR OWN</div><h1>属于你的学习积累</h1><p>把重要的知识留住，把一闪而过的理解写下来。收藏与笔记都保存在当前浏览器。</p></div><button class="btn" data-export-state="true">${icon('download')}导出学习备份</button></div><div class="filter-bar">${[['all','全部记录'],['stars','我的收藏'],['notes','学习笔记']].map(([v,t])=>`<button class="filter-chip ${notebookFilter===v?'active':''}" data-notebook-filter="${v}" aria-pressed="${notebookFilter===v}">${t}</button>`).join('')}<button class="btn-text" id="import-backup" style="margin-left:auto">导入备份 ↗</button><input type="file" id="backup-file" accept=".json,application/json" hidden></div>${items.length?`<div class="notebook-list">${items.map(s=>`<article class="note-card"><div class="note-card-head"><h2><a href="${sectionHref(s.chapter,s.index)}">${s.chapter}.${s.index+1} ${s.title}</a></h2><button class="icon-button" data-star="${s.key}" aria-label="${state.stars.includes(s.key)?'取消收藏':'收藏'}${s.title}" aria-pressed="${state.stars.includes(s.key)}" style="${state.stars.includes(s.key)?'color:#9aac71':''}">${icon('star')}</button></div><div class="note-card-meta">第 ${s.chapter} 章 · ${COURSE[s.chapter-1].title}${state.completed.includes(s.key)?' · 已学会':''}</div><p>${escape(state.notes[s.key]||'已收藏这个知识点。进入小节，写下你的理解。')}</p><div class="note-card-actions"><a href="${sectionHref(s.chapter,s.index)}">继续阅读 →</a><a href="${sectionHref(s.chapter,s.index)}" data-open-note="true">${state.notes[s.key]?'编辑笔记':'写笔记'}</a>${state.notes[s.key]?`<button data-delete-note="${s.key}">删除笔记</button>`:''}</div></article>`).join('')}</div>`:empty('你的知识花园，等你种下第一颗种子','在课程小节点击“收藏”，或在“我的笔记”中写下理解。','#courses','去探索课程')}<div class="about-panel"><h2>让学习记录跟着你走</h2><p>当前已完成 ${state.completed.length} 个小节，收藏 ${state.stars.length} 条，笔记 ${Object.values(state.notes).filter(n=>n.trim()).length} 条。累计活跃学习 ${formatTime(state.seconds)}。清除浏览器数据会清除本地记录；建议定期导出 JSON 备份。导入时会合并完成项、收藏与题目记录，同一小节的备份笔记会替换当前内容。</p></div>`;
  }
  function resources(){return `<div class="page-heading"><div class="eyebrow">KEEP YOUR CURIOSITY GROWING</div><h1>学习，始于课程，延伸到更远</h1><p>把常用资料放在一起。原课程保留完整讲解、代码与演示，官方文档帮助你继续实践。</p></div><div class="resource-grid">${RESOURCES.map(r=>`<a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-card"><span class="tag">${r.type}</span><h2>${r.name}${icon('external')}</h2><p>${r.desc}</p></a>`).join('')}</div><section class="about-panel"><h2>课程来源与重构说明</h2><p>原课程：《可视化导论》· 中国石油大学（华东）· 授课教师：李昕 · 主要参考教材：陈为《可视化导论》。<br>本网站为课程作业重构版，沿用原站五章知识结构，新编导学、代码片段、实验与自测，不代表原课程的官方更新。完整教学资料请以<a href="https://cinger007.github.io/vis/" target="_blank" rel="noopener noreferrer">原站内容</a>为准。<br>本网站采用 HTML、CSS 和 JavaScript，图形在浏览器中用 SVG 绘制；无视频、无外部字体、无运行时依赖，支持静态托管。学习记录只保存在本地浏览器。</p></section>`;}
  function notFound(){return empty('这个学习角落还不存在','从课程地图继续你的探索吧。','#courses','返回课程');}
  const pageTitles={overview:'学习概览',courses:'课程章节',lesson:'课程学习',lab:'交互实验室',charts:'图表指南',quiz:'知识自测',notebook:'笔记与收藏',resources:'学习资源'};
  let currentPage='',lastHash='';
  function flushNote(){clearTimeout(noteTimer);const input=$('#lesson-note');if(input){state.notes[input.dataset.noteKey]=input.value;save();}}
  function route({preserveScroll=false}={}){
    flushNote();const parts=(location.hash.slice(1)||'overview').split('/'),page=parts[0],changed=lastHash!==location.hash;
    if(changed&&page==='lesson'&&!document.activeElement?.hasAttribute('data-open-note'))lessonTab='theory';
    if(changed&&page==='quiz'){quizFinished=false;const list=quizIndices();const first=list.findIndex(i=>state.answers[i]===undefined);currentQuiz=first<0?0:first;}
    currentPage=page;lastHash=location.hash;
    document.body.dataset.page=page;
    if(page!=='lesson'){focusReading=false;document.body.classList.remove('reading-focus');}
    sidebar(page);$('#breadcrumb').textContent=pageTitles[page]||'探索课程';
    const views={overview,courses,lesson:()=>lesson(Number(parts[1]),Number(parts[2]||0)),lab:()=>lab(parts[1]||'encoding'),charts,quiz,notebook,resources};
    $('#main').innerHTML=(!storageAvailable?'<div class="storage-alert">当前浏览器不支持持久存储。学习仍可继续，请导出备份保存本次记录。</div>':'')+(views[page]?views[page]():notFound());
    document.title=`${pageTitles[page]||'页面未找到'} · 昕品重制`;
    document.documentElement.style.setProperty('--reading-size',readingSize+'px');
    if(page==='lesson')window.LinkedLessons?.mountAll($('#main'));
    if(page==='overview')drawHero();
    if(page==='lab')renderExperiment(labMeta[parts[1]]?parts[1]:'encoding');
    closeMenu();if(!preserveScroll){window.scrollTo(0,0);if(changed)$('#main').focus({preventScroll:true});}
  }
  function closeMenu(){$('#sidebar').classList.remove('open');$('#sidebar-overlay').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false');}
  function search(query=''){
    const q=query.trim().toLocaleLowerCase(),matches=allSections.filter(s=>!q||[s.title,s.goal,s.intro,COURSE[s.chapter-1].title,...s.paragraphs,s.code].join(' ').toLocaleLowerCase().includes(q)).slice(0,q?30:6);
    $('#search-results').innerHTML=matches.length?`${!q?'<p style="font-size:10px;color:#a1ad94;margin:9px 12px">从这些知识点开始探索</p>':''}${matches.map(s=>`<a class="search-result" href="${sectionHref(s.chapter,s.index)}" data-search-result="true"><span class="course-icon tone-${COURSE[s.chapter-1].color}">${icon(COURSE[s.chapter-1].icon)}</span><div><h3>${s.chapter}.${s.index+1} ${s.title}</h3><p>第 ${s.chapter} 章 · ${COURSE[s.chapter-1].title} · 约 ${s.minutes} 分钟</p></div>${icon('arrow')}</a>`).join('')}`:'<p class="search-no-results">没有找到匹配的知识点。试试“颜色”“曲线”或“数据”。</p>';
  }
  function openSearch(){const d=$('#search-dialog');if(!d.open)d.showModal();$('#search-input').value='';search();$('#search-input').focus();}
  function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function csv(rows){return '\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');}
  async function copy(text){try{await navigator.clipboard.writeText(text);toast('已复制到剪贴板');}catch{const a=document.createElement('textarea');a.value=text;document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();toast(ok?'已复制到剪贴板':'复制不可用，请手动选择复制。');}}
  function downloadLab(type){let rows,name;if(type==='encoding'){const d=datasets[labSettings.encoding.dataset];rows=[['类别','数量','单位'],...d.categories.map((n,i)=>[n,d.values[i],d.unit])];name='视觉编码-合成数据.csv';}else if(type==='curve'){rows=[['月份','观测值'],...curveValues.map((v,i)=>[i+1,v])];name='曲线实验-合成数据.csv';}else if(type==='calendar'){rows=[['日期','数值'],...calendarRows.map(d=>[d.date,d.value])];name='2026日历-合成数据.csv';}else{rows=[['序号','色值'],...currentColors().map((c,i)=>[i+1,c])];name='昕品重制-配色方案.csv';}download(name,csv(rows),'text/csv;charset=utf-8');toast('实验数据已导出');}
  document.addEventListener('click',event=>{
    const el=event.target.closest('button,a');if(!el)return;
    if(el.classList.contains('skip-link')){event.preventDefault();$('#main').focus();$('#main').scrollIntoView({block:'start'});return;}
    if(el.dataset.heroMode){heroMode=el.dataset.heroMode;drawHero();return;}
    if(el.dataset.guideFilter){guideFilter=el.dataset.guideFilter;route({preserveScroll:true});return;}
    if(el.dataset.readingSize){readingSize=Math.max(14,Math.min(22,readingSize+Number(el.dataset.readingSize)));document.documentElement.style.setProperty('--reading-size',readingSize+'px');$('#reading-size').textContent=readingSize+'px';return;}
    if(el.dataset.focusReading){focusReading=!focusReading;document.body.classList.toggle('reading-focus',focusReading);el.setAttribute('aria-pressed',String(focusReading));el.innerHTML=icon('book')+(focusReading?'退出专注':'专注阅读');return;}
    if(el.id==='search-open'){openSearch();return;}
    if(el.id==='search-close'){$('#search-dialog').close();return;}
    if(el.id==='menu-toggle'){const open=!$('#sidebar').classList.contains('open');$('#sidebar').classList.toggle('open',open);$('#sidebar-overlay').hidden=!open;el.setAttribute('aria-expanded',String(open));return;}
    if(el.id==='sidebar-overlay'){closeMenu();return;}
    if(el.hasAttribute('data-search-result')){$('#search-dialog').close();if(el.hash===location.hash)route();}
    if(el.hasAttribute('data-clear-filter'))courseFilter='all';
    if(el.dataset.courseFilter){courseFilter=el.dataset.courseFilter;route({preserveScroll:true});}
    if(el.dataset.notebookFilter){notebookFilter=el.dataset.notebookFilter;route({preserveScroll:true});}
    if(el.dataset.lessonTab){flushNote();lessonTab=el.dataset.lessonTab;route({preserveScroll:true});$('#tab-'+lessonTab)?.focus();}
    if(el.dataset.complete){const k=el.dataset.complete;state.completed=state.completed.includes(k)?state.completed.filter(a=>a!==k):[...state.completed,k];save();route({preserveScroll:true});toast(state.completed.includes(k)?'已记下这一步，继续保持。':'已取消完成标记');}
    if(el.dataset.star){const k=el.dataset.star;state.stars=state.stars.includes(k)?state.stars.filter(a=>a!==k):[...state.stars,k];save();route({preserveScroll:true});toast(state.stars.includes(k)?'已加入收藏':'已取消收藏');}
    if(el.dataset.copyCode){const s=allSections.find(s=>s.key===el.dataset.copyCode);copy(s.code);}
    if(el.dataset.copyColor)copy(el.dataset.copyColor.toUpperCase());
    if(el.dataset.saveNote){flushNote();$('#note-status').textContent=storageAvailable?'已保存到当前浏览器':'本次会话已保存，请导出备份';toast('笔记已保存');}
    if(el.dataset.openNote){event.preventDefault();flushNote();lessonTab='notes';const hash=el.hash;if(location.hash!==hash){history.pushState(null,'',hash);lastHash=hash;}route();$('#lesson-note')?.focus();}
    if(el.dataset.deleteNote){delete state.notes[el.dataset.deleteNote];save();route({preserveScroll:true});toast('笔记已删除');}
    if(el.dataset.resetLab){const t=el.dataset.resetLab;labSettings[t]=JSON.parse(JSON.stringify(labDefaults[t]));$('#lab-controls').innerHTML=controls(t);renderExperiment(t);}
    if(el.dataset.downloadLab)downloadLab(el.dataset.downloadLab);
    if(el.dataset.answer!==undefined){const i=+el.dataset.question;if(state.answers[i]!==undefined)return;state.answers[i]=+el.dataset.answer;save();route({preserveScroll:true});}
    if(el.dataset.quizMove){const indices=quizIndices(),delta=+el.dataset.quizMove;if(delta>0&&currentQuiz===indices.length-1){const next=indices.findIndex(i=>state.answers[i]===undefined);currentQuiz=next<0?0:next;}else currentQuiz=Math.max(0,Math.min(indices.length-1,currentQuiz+delta));route({preserveScroll:true});}
    if(el.dataset.quizIndex!==undefined){currentQuiz=+el.dataset.quizIndex;route({preserveScroll:true});}
    if(el.dataset.quizResults){quizFinished=true;route();}
    if(el.dataset.retryQuiz){for(const i of quizIndices())delete state.answers[i];currentQuiz=0;quizFinished=false;save();route({preserveScroll:true});toast('本组练习已重置');}
    if(el.dataset.exportState){flushNote();download('昕品重制-学习备份.json',JSON.stringify({app:'zhitu',version:1,exportedAt:new Date().toISOString(),state},null,2),'application/json;charset=utf-8');toast('学习备份已导出');}
    if(el.id==='import-backup')$('#backup-file').click();
    if(el.hash&&el.hash===location.hash&&!el.hasAttribute('data-open-note')&&!el.hasAttribute('data-search-result')&&!el.dataset.lessonTab)route();
  });
  document.addEventListener('input',event=>{
    const el=event.target;if(el.id==='search-input')search(el.value);
    if(el.dataset.noteKey){clearTimeout(noteTimer);$('#note-status').textContent='正在保存…';noteTimer=setTimeout(()=>{state.notes[el.dataset.noteKey]=el.value;save();if($('#note-status'))$('#note-status').textContent=storageAvailable?'已自动保存到当前浏览器':'已保存在本次会话';},400);}
    if(el.type==='range'&&el.dataset.labSetting)updateLab(el);
  });
  function updateLab(el){const t=location.hash.split('/')[1]||'encoding';if(!labSettings[t])return;const key=el.dataset.labSetting;labSettings[t][key]=el.type==='checkbox'?el.checked:el.type==='range'?Number(el.value):el.value;renderExperiment(t);}
  document.addEventListener('change',async event=>{
    const el=event.target;if(el.dataset.labSetting&&el.type!=='range')updateLab(el);
    if(el.id==='quiz-chapter'){quizFilter=+el.value;quizFinished=false;currentQuiz=0;route({preserveScroll:true});}
    if(el.id==='backup-file'&&el.files[0]){const file=el.files[0];try{if(file.size>10000000)throw Error('文件过大');const data=JSON.parse(await file.text());if(data.app!=='zhitu'||data.version!==1||!data.state)throw Error('格式不匹配');const incoming=validateState(data.state);state={completed:[...new Set([...state.completed,...incoming.completed])],stars:[...new Set([...state.stars,...incoming.stars])],notes:{...state.notes,...incoming.notes},answers:{...state.answers,...incoming.answers},last:incoming.last||state.last,seconds:Math.max(state.seconds,incoming.seconds)};save();route({preserveScroll:true});toast('备份已合并，学习记录已恢复');}catch{toast('无法导入，请选择昕品重制导出的有效 JSON 备份。');}}
  });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}
    if(event.key==='Escape'){closeMenu();if(focusReading){focusReading=false;document.body.classList.remove('reading-focus');const toggle=$('[data-focus-reading]');if(toggle){toggle.setAttribute('aria-pressed','false');toggle.innerHTML=icon('book')+'专注阅读';}}}
    if(event.target.matches('.lesson-tab')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const list=['theory','code','notes'],i=list.indexOf(lessonTab);lessonTab=event.key==='Home'?'theory':event.key==='End'?'notes':list[(i+(event.key==='ArrowRight'?1:2))%3];route({preserveScroll:true});$('#tab-'+lessonTab).focus();}
    if(event.key==='Enter'&&event.target.id==='search-input'){const first=$('#search-results a');if(first){$('#search-dialog').close();location.hash=first.hash;}}
  });
  $('#search-dialog').addEventListener('click',event=>{if(event.target===$('#search-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
  $('#search-icon').innerHTML=icon('search');$('#modal-search-icon').innerHTML=icon('search');$('#notes-link').innerHTML=icon('notes');$('#menu-toggle').innerHTML=icon('menu');
  window.addEventListener('hashchange',()=>route());window.addEventListener('popstate',()=>route());
  window.addEventListener('pagehide',flushNote);
  let lastActive=Date.now();document.addEventListener('pointerdown',()=>lastActive=Date.now(),{passive:true});document.addEventListener('keydown',()=>lastActive=Date.now());document.addEventListener('scroll',()=>lastActive=Date.now(),{passive:true});
  setInterval(()=>{if(document.visibilityState==='visible'&&Date.now()-lastActive<300000){state.seconds+=15;save();}},15000);
  route();
})();
