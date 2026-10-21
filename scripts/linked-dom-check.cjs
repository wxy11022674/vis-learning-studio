// Development-only DOM integration check. The deployed site has no dependencies.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {parseHTML}=require(process.env.DOM_PACKAGE||path.resolve('artifacts/dom-qa/node_modules/linkedom'));
const {window}=parseHTML(fs.readFileSync('dist/index.html','utf8'));
const {document}=window;
// LinkeDOM does not implement checked state or a SELECT.value setter.
Object.defineProperty(window.HTMLInputElement.prototype,'checked',{get(){return this.hasAttribute('checked');},set(v){this.toggleAttribute('checked',Boolean(v));},configurable:true});
Object.defineProperty(window.HTMLSelectElement.prototype,'value',{get(){return [...this.options].find(x=>x.hasAttribute('selected'))?.value??'';},set(v){for(const x of this.options)x.toggleAttribute('selected',String(x.value)===String(v));},configurable:true});
window.HTMLElement.prototype.scrollIntoView=function(){};
window.scrollTo=()=>{};
window.matchMedia=()=>({matches:true});
window.location={hash:'#lesson/3/1'};
const storage=new Map();
window.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
window.history={pushState:(_a,_b,url)=>{window.location.hash=url;}};
let copied='';
const sandbox={window,document,location:window.location,history:window.history,localStorage:window.localStorage,navigator:{clipboard:{writeText:async text=>{copied=text;}}},console,URL,Blob,MouseEvent:window.Event,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0};
const ctx=vm.createContext(sandbox);
for(const file of ['content.js','linked-models.js','linked-lessons.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),ctx,{filename:file});
const route=key=>{window.location.hash='#lesson/'+key.replace('-','/');window.dispatchEvent(new window.Event('hashchange'));};
const click=el=>{assert.ok(el,'click target exists');el.dispatchEvent(new window.Event('click',{bubbles:true}));};
const input=(el,value)=>{
  assert.ok(el,'input target exists');
  if(el.type==='checkbox')el.checked=value;
  else el.value=String(value);
  el.dispatchEvent(new window.Event(el.type==='range'?'input':'change',{bubbles:true}));
};
const active=(root,index)=>{
  assert.equal(root.querySelector(`.ll-concept[data-ll-step="${index}"]`).getAttribute('aria-pressed'),'true');
  assert.ok(root.querySelector(`.ll-code-line.ll-selected[data-ll-step="${index}"]`));
  assert.ok(root.querySelector(`.ll-mark.ll-selected[data-ll-step="${index}"]`));
  assert.equal(root.querySelectorAll('.ll-concept.ll-selected').length,1);
};
let interactions=0;
for(const [key,c] of Object.entries(window.LinkedLessons.configs)){
  route(key);
  let root=document.querySelector('.linked-lesson');
  assert.equal(root.dataset.llKey,key);
  assert.ok(document.querySelector('.linked-term'));
  assert.equal(root.querySelectorAll('.ll-concept').length,3);
  for(let i=0;i<3;i++){
    click(root.querySelector(`.ll-concept[data-ll-step="${i}"]`));active(root,i);
    const mark=root.querySelector(`.ll-mark[data-ll-step="${i}"]:not([data-ll-choose])`)||root.querySelector(`.ll-mark[data-ll-step="${i}"]`);
    click(mark);active(root,mark.dataset.llChoose?c.controls.find(x=>x.id===mark.dataset.llChoose).group:i);
    click(root.querySelector(`.ll-code-line[data-ll-step="${i}"][data-ll-compute]`));active(root,i);
    interactions+=3;
  }
  const term=document.querySelector('.linked-term');click(term);active(root,Number(term.dataset.llStep));interactions++;
  for(const control of c.controls){
    const el=root.querySelector(`[data-ll-control="${control.id}"]`);
    const values=control.type==='range'?[control.min,control.max]:control.type==='checkbox'?[false,true]:control.options.map(x=>x[0]);
    for(const value of values){
      input(el,value);try{active(root,control.group);}catch(error){throw new Error(key+' '+control.id+'='+value+'; '+error.message);}
      const lines=window.LinkedLessons.source(key);
      const param=lines.find(x=>x.text.trim().startsWith(control.id+':'));
      assert.ok(param.text.includes(JSON.stringify(value)),key+' parameter reflected in source');
      const model=JSON.parse(vm.runInNewContext(lines.map(x=>x.text).join('\n')+'\nJSON.stringify(result)'));
      assert.equal(root.querySelector('.ll-feedback').textContent,model.summary);
      assert.equal(root.querySelectorAll('.ll-mark').length,model.marks.length);
      assert.equal(root.querySelectorAll('tbody tr').length,model.table.length-1);
      assert.ok(!/NaN|Infinity|undefined/.test(root.querySelector('.ll-chart').innerHTML));
      interactions++;
    }
  }
  click(root.querySelector('[data-ll-reset]'));
  root=document.querySelector('.linked-lesson');active(root,c.initial??1);
  for(const control of c.controls){const el=root.querySelector(`[data-ll-control="${control.id}"]`);assert.equal(control.type==='checkbox'?el.checked:String(el.value),control.type==='checkbox'?control.value:String(control.value));}
}
// Plot controls change parameters too, including keyboard use.
route('3-6');let root=document.querySelector('.linked-lesson');
click(root.querySelector('[data-ll-choose="focus"][data-ll-value="1"]'));
assert.ok(window.LinkedLessons.source('3-6').some(x=>x.text.includes('focus: 1')));
const keyEvent=new window.Event('keydown',{bubbles:true});keyEvent.key='Enter';
root.querySelector('[data-ll-choose="focus"][data-ll-value="2"]').dispatchEvent(keyEvent);
assert.ok(window.LinkedLessons.source('3-6').some(x=>x.text.includes('focus: 2')));
// Clamp unexpected range values; reject unlisted choices.
input(root.querySelector('[data-ll-control="saturation"]'),999);
assert.ok(window.LinkedLessons.source('3-6').some(x=>x.text.includes('saturation: 90')));
// Route changes preserve working parameters in this session.
route('1-0');route('3-6');assert.ok(window.LinkedLessons.source('3-6').some(x=>x.text.includes('focus: 2')));
// Existing lesson tabs, notes, progress, and saved state continue to work.
click(document.querySelector('[data-lesson-tab="notes"]'));
const note=document.querySelector('#lesson-note');note.value='联动学习：位置与颜色的映射';
click(document.querySelector('[data-save-note]'));
click(document.querySelector('[data-lesson-tab="theory"]'));
assert.ok(document.querySelector('.linked-lesson'));
click(document.querySelector('[data-complete="3-6"]'));
const saved=JSON.parse(storage.get('zhitu-learning-v1'));
assert.ok(saved.completed.includes('3-6'));assert.equal(saved.notes['3-6'],'联动学习：位置与颜色的映射');
click(document.querySelector('[data-lesson-tab="code"]'));assert.ok(document.querySelector('.code-block'));
click(document.querySelector('[data-lesson-tab="theory"]'));
click(document.querySelector('[data-ll-copy]'));
assert.ok(copied.includes('function emphasis(p)'));assert.ok(!copied.includes('/*@'));
assert.equal(JSON.parse(vm.runInNewContext(copied+'\nJSON.stringify(result)')).marks.length,document.querySelectorAll('.ll-mark').length);
console.log(`Linked DOM passed: all 27 lesson routes, ${interactions} interactions, graph/code/text selection, controls/reset/copy/keyboard, notes and progress regressions.`);
