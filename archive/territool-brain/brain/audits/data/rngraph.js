const fs=require('fs'),path=require('path');
const ROOT=process.argv[2];const APP=path.join(ROOT,'App');
const files=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory()){if(e.name!=='node_modules')walk(p)}else if(/\.(js|ts|tsx|jsx)$/.test(e.name))files.push(p)}})(APP);
const resolve=(from,spec)=>{if(!spec.startsWith('.'))return null;const base=path.resolve(path.dirname(from),spec);for(const c of [base,base+'.js',base+'.ts',base+'.tsx',path.join(base,'index.js'),path.join(base,'index.ts')])if(fs.existsSync(c)&&fs.statSync(c).isFile())return c;return null};
const deps={};
for(const f of files){const s=fs.readFileSync(f,'utf8');const set=new Set();const re=/(?:import\s[^'"]*?from\s*|import\s*\(\s*|require\s*\(\s*|export\s[^'"]*?from\s*)['"]([^'"]+)['"]/g;let m;while((m=re.exec(s))){const r=resolve(f,m[1]);if(r)set.add(r)}deps[f]=set}
// screens from App.js
const appJs=path.join(APP,'App.js');const src=fs.readFileSync(appJs,'utf8');const comp={};
for(const m of src.matchAll(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(\s*["']([^"']+)["']\s*\)\s*\)/g))comp[m[1]]=resolve(appJs,m[2]);
for(const m of src.matchAll(/import\s+(\w+)\s+from\s+["']([^"']+)["']/g)){const r=resolve(appJs,m[2]);if(r&&!comp[m[1]])comp[m[1]]=r}
const screens={};for(const m of src.matchAll(/<Stack\.Screen\s+name="(\w+)"\s+component=\{(\w+)\}/g))if(comp[m[2]])screens[m[1]]=comp[m[2]];
const closure=(f)=>{const seen=new Set();const st=[f];while(st.length){const x=st.pop();if(seen.has(x))continue;seen.add(x);for(const d of (deps[x]||[]))st.push(d)}return seen};
const inv={};const screenDeps={};
for(const [name,f] of Object.entries(screens)){const c=closure(f);screenDeps[name]=c.size;for(const x of c)(inv[x]=inv[x]||new Set()).add(name)}
const rel=p=>path.relative(ROOT,p);const loc=p=>fs.readFileSync(p,'utf8').split('\n').length;
console.log(`files: ${files.length}, screens resolved: ${Object.keys(screens).length} of ${[...src.matchAll(/<Stack\.Screen/g)].length}`);
console.log('== modules by number of screens that transitively import them (top 45) ==');
Object.entries(inv).filter(([f])=>f!==appJs).sort((a,b)=>b[1].size-a[1].size).slice(0,45).forEach(([f,s])=>console.log(`${String(s.size).padStart(2)} screens | ${String(loc(f)).padStart(5)} lines | ${rel(f)}${s.size<=6?'  ['+[...s].join(',')+']':''}`));
console.log('== screens by transitive dependency count ==');
console.log(Object.entries(screenDeps).sort((a,b)=>b[1]-a[1]).map(([n,c])=>`${n}:${c}`).join('  '));
const out={screens:Object.fromEntries(Object.entries(screens).map(([n,f])=>[n,rel(f)])),moduleToScreens:Object.fromEntries(Object.entries(inv).map(([f,s])=>[rel(f),[...s].sort()]))};
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));console.log('written',process.argv[3]);
