import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'artifacts','pages');
const files=['index.html','app.js','content.js','linked-models.js','linked-lessons.js','styles.css','studio.css','linked-lessons.css','visual-refresh.css','favicon.svg','brand-mark.svg','brand-lockup.svg'];
fs.mkdirSync(output,{recursive:true});
for(const name of files) fs.copyFileSync(path.join(root,'dist',name),path.join(output,name));
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(`Prepared ${files.length} website files and .nojekyll in ${output}`);
