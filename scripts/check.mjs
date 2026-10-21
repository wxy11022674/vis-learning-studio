import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context={window:{}};
vm.runInNewContext(fs.readFileSync('dist/content.js','utf8'),context);
const {VIS_COURSE:c,VIS_QUIZ:q,VIS_RESOURCES:r}=context.window;
assert.equal(c.length,5);
assert.equal(c.reduce((n,ch)=>n+ch.sections.length,0),27);
assert.equal(q.length,15);
for(const ch of c){
  assert.ok(ch.id>0&&ch.id<6);
  assert.ok(ch.lab);
  for(const s of ch.sections){
    for(const field of ['title','intro','goal','example','takeaway','code'])assert.ok(s[field]?.length>0,`${ch.id} missing ${field}`);
    assert.ok(s.paragraphs.length>=2);
  }
}
for(const item of q){
  assert.ok(c[item.chapter-1].sections[item.section]);
  assert.ok(item.options[item.answer]);
  assert.equal(item.options.length,4);
  assert.ok(item.why.length>10);
}
for(const file of ['index.html','styles.css','studio.css','linked-lessons.css','visual-refresh.css','content.js','linked-models.js','linked-lessons.js','app.js','brand-mark.svg','brand-lockup.svg','favicon.svg'])assert.ok(fs.existsSync(`dist/${file}`));
assert.ok(!/<video|<iframe|\.mp4\b|\.webm\b/i.test(fs.readFileSync('dist/index.html','utf8')));
const total=fs.readdirSync('dist').reduce((sum,f)=>sum+fs.statSync(`dist/${f}`).size,0);
assert.ok(total<400000,`Static assets too large: ${total}`);
console.log(`Validated: ${c.length} chapters, 27 sections, ${q.length} questions, ${r.length} resources; static assets ${(total/1024).toFixed(1)} KiB.`);
