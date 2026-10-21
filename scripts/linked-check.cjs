const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = vm.createContext({window:{},document:{addEventListener(){}}});
for(const file of ['content.js','linked-models.js','linked-lessons.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
const {VIS_COURSE:course,LinkedLessons:linked,LinkedLessonModels:models}=context.window;
const plain=value=>JSON.parse(JSON.stringify(value));
const defaults=c=>Object.assign({},c.fixed,...c.controls.map(x=>({[x.id]:x.value})));
let cases=0;
function validate(key,p){
  const c=linked.configs[key],model=models[c.model](p);
  assert.ok(model.marks.length, key+' has SVG marks');
  for(let i=0;i<3;i++)assert.ok(model.marks.some(x=>x.group===i),`${key} has graphic group ${i}`);
  assert.ok(Number.isFinite(model.height)&&model.height>0);
  assert.ok(model.summary.length>5);
  for(const mark of model.marks){
    assert.ok(['rect','circle','line','path','text','polygon'].includes(mark.tag));
    for(const [attr,value] of Object.entries(mark.attrs)){
      if(typeof value==='number')assert.ok(Number.isFinite(value),`${key} ${attr} is finite`);
      assert.ok(!/NaN|Infinity/.test(String(value)),`${key} ${attr} has valid geometry`);
      if(['width','height','r'].includes(attr))assert.ok(value>=0);
    }
  }
  assert.ok(model.table.length>=2);
  assert.ok(model.table.every(row=>row.length===model.table[0].length),key+' rectangular table');
  cases++;
  return model;
}
assert.equal(Object.keys(linked.configs).length,27);
for(const ch of course)for(let i=0;i<ch.sections.length;i++){
  const key=`${ch.id}-${i}`,c=linked.configs[key];assert.ok(c,key+' exists');assert.ok(models[c.model]);assert.equal(c.steps.length,3);
  const p=defaults(c);validate(key,p);
  assert.equal(new Set(c.controls.map(x=>x.id)).size,c.controls.length);
  // Every exposed control endpoint / choice, plus combinations of the first two controls.
  const choices=c.controls.map(x=>x.type==='range'?[x.min,x.max]:x.type==='checkbox'?[false,true]:x.options.map(v=>v[0]));
  c.controls.forEach((x,j)=>choices[j].forEach(value=>validate(key,{...p,[x.id]:value})));
  if(c.controls.length>=2)for(const a of choices[0])for(const b of choices[1])validate(key,{...p,[c.controls[0].id]:a,[c.controls[1].id]:b});
  const source=linked.source(key);assert.ok(source.some(l=>l.compute));
  for(let step=0;step<3;step++)assert.ok(source.some(l=>l.compute&&l.group===step),key+' source groups');
  // Copying the displayed source must reproduce the actual graph/table model.
  const copiedResult=vm.runInNewContext(source.map(l=>l.text).join('\n')+'\nJSON.stringify(result);');
  assert.deepEqual(JSON.parse(copiedResult),plain(models[c.model](p)),key+' executable displayed source');
  const text=ch.sections[i].paragraphs.join(' / '),annotated=linked.annotate(text,ch.id,i);
  assert.ok(annotated.includes('linked-term'),key+' has clickable course text');
  const escaped=linked.annotate('<img src=x onerror=alert(1)>',ch.id,i);
  assert.ok(!escaped.includes('<img'));
}
assert.equal(models.cleanData({clean:true,minimum:150}).table.filter(row=>row[2]==='是').length,6);
assert.equal(models.cleanData({clean:true,minimum:150}).marks.filter(x=>x.tag==='rect').length,6);
assert.equal(models.dataJoin({add:2,keepA:false}).table[1][1],'D, E');
assert.equal(models.dataJoin({add:2,keepA:false}).table[3][1],'A');
assert.match(models.hierarchy({spacing:100,collapsed:false}).marks.find(x=>x.tip==='信息：53 人').tip,/53/);
assert.equal(models.hierarchy({spacing:100,collapsed:true}).marks.filter(x=>x.tag==='circle').length,3);
assert.equal(models.eventPath({target:2,phase:'bubble'}).table[1][1],'计算机专业');
assert.equal(models.eventPath({target:2,phase:'capture'}).table[1][1],'课程列表');
assert.equal(models.colorMap({type:'diverging',palette:'green'}).table[1][1],-40);
const neutral=models.labSlice({lightness:60,gamut:true}).marks.find(x=>x.tip?.includes('a*=0, b*=0；'));
assert.ok(neutral&&!neutral.tip.includes('超出'));
assert.equal(models.harmony({scheme:'complementary',hue:150}).table[2][0],'330°');
assert.equal(new Set(models.harmony({scheme:'mono',hue:150}).marks.filter(x=>x.tag==='circle'&&x.group===1).map(x=>x.attrs.cx)).size,3);
const linear=models.coordinates({scale:'linear',width:320,invert:true});
assert.equal(linear.table[1][1],'119.0');assert.equal(linear.table[1][2],'188.0');
const log=models.coordinates({scale:'log',width:300,invert:true});
assert.deepEqual(plain(log.table.slice(1).map(x=>x[1])),['55.0','155.0','255.0','355.0']);
assert.deepEqual(plain(models.curves({middle:41,curve:'linear',height:140}).table),plain(models.curves({middle:41,curve:'linear',height:260}).table));
assert.equal(models.timeAggregation({grain:'day'}).table.length,91);
assert.equal(models.timeAggregation({grain:'week'}).table.length,14);
assert.equal(models.timeAggregation({grain:'month'}).table.length,4);
const gap=models.missingTime({missing:'gap'}),zero=models.missingTime({missing:'zero'});
assert.equal((gap.marks.find(x=>x.tag==='path').attrs.d.match(/M/g)||[]).length,3);
assert.equal(gap.marks.filter(x=>x.tag==='circle').length,10);assert.equal(zero.marks.filter(x=>x.tag==='circle').length,12);
assert.equal(models.calendar({palette:'green',threshold:0}).table[1][0],'2026-01-01');
assert.equal(models.calendar({palette:'green',threshold:0}).table.length,57);
assert.equal(models.spiral({period:14,spacing:4}).marks.filter(x=>x.tag==='circle').length,85);
assert.ok(!fs.readFileSync('dist/linked-lessons.js','utf8').match(/\beval\s*\(|new Function|fetch\s*\(/));
console.log(`Linked models passed: 27 sections, ${cases} parameter cases, source/graph equivalence and learning invariants.`);
