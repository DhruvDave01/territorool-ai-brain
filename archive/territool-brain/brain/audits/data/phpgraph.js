const fs=require('fs'),path=require('path');
const ROOT=process.argv[2];const APP=path.join(ROOT,'app');
const files=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.php')&&!e.name.endsWith('.blade.php'))files.push(p)}})(APP);
const clsToFile={};const fileNs={};
for(const f of files){const s=fs.readFileSync(f,'utf8');const ns=(s.match(/^\s*namespace\s+([^;]+);/m)||[])[1];const cls=(s.match(/^\s*(?:abstract\s+|final\s+)?(?:class|trait|interface)\s+(\w+)/m)||[])[1];if(ns&&cls){clsToFile[`${ns}\\${cls}`]=f;fileNs[f]=ns}}
// global aliases from config/app.php (e.g. Helper) not resolved; handle App\Globals\Helper imports explicitly via use
const deps={};
for(const f of files){const s=fs.readFileSync(f,'utf8');const set=new Set();const ns=fileNs[f]||'';
 const uses={};for(const m of s.matchAll(/^\s*use\s+([A-Za-z0-9_\\]+)(?:\s+as\s+(\w+))?\s*;/gm)){const full=m[1].replace(/^\\/,'');uses[m[2]||full.split('\\').pop()]=full;if(clsToFile[full])set.add(clsToFile[full])}
 for(const m of s.matchAll(/\\?(App\\[A-Za-z0-9_\\]+)(?:::class|::|\s*\(|\b)/g)){const c=m[1];if(clsToFile[c])set.add(clsToFile[c])}
 for(const m of s.matchAll(/\b([A-Z]\w+)::/g)){const a=m[1];const full=uses[a]||(`${ns}\\${a}`);if(clsToFile[full])set.add(clsToFile[full])}
 for(const m of s.matchAll(/new\s+([A-Z]\w+)\s*\(/g)){const a=m[1];const full=uses[a]||(`${ns}\\${a}`);if(clsToFile[full])set.add(clsToFile[full])}
 set.delete(f);deps[f]=set}
// routes
const routes=[];
const api=fs.readFileSync(path.join(ROOT,'routes/api.php'),'utf8').split('\n');
api.forEach((l,i)=>{if(/^\s*\/\//.test(l))return;const m=l.match(/\$api->(get|post)\(\s*'([^']+)'\s*,\s*'\\?([A-Za-z0-9_\\]+)@(\w+)'/);if(m)routes.push({kind:'api',uri:m[2],cls:m[3],line:i+1})});
const web=fs.readFileSync(path.join(ROOT,'routes/web.php'),'utf8').split('\n');let nsStack='App\\Http\\Controllers';
web.forEach((l,i)=>{if(/^\s*(\/\/|\*|#)/.test(l))return;const m=l.match(/Route::(get|post|put|patch|delete|any|match)\(\s*(?:\[[^\]]*\]\s*,\s*)?['"]([^'"]*)['"]\s*,\s*['"]([A-Za-z0-9_\\]+)@(\w+)/);if(m){let c=m[3];if(!c.startsWith('App\\')){c=(l.includes("'namespace' => 'Admin'")?'App\\Http\\Controllers\\Admin\\':'App\\Http\\Controllers\\')+c}routes.push({kind:'web',uri:m[2],cls:c,line:i+1})}});
// module route files (app/<Module>/routes/*.php, loaded by each module's service provider): controllers are
// named through variables, e.g. $controllers = 'App\AdminMcp\Http\Controllers'; Route::get('x', $controllers . '\Foo@bar');
// Added 2026-09-17 so the MCP modules (F29-F31) appear in the code graph.
for(const mod of fs.readdirSync(APP,{withFileTypes:true}).filter(e=>e.isDirectory())){const rd=path.join(APP,mod.name,'routes');if(!fs.existsSync(rd))continue;
 for(const rf of fs.readdirSync(rd).filter(f=>f.endsWith('.php'))){const lines=fs.readFileSync(path.join(rd,rf),'utf8').split('\n');const vars={};
  lines.forEach((l,i)=>{const v=l.match(/^\s*\$(\w+)\s*=\s*'([A-Za-z0-9_\\]+)'\s*;/);if(v){vars[v[1]]=v[2];return}if(/^\s*(\/\/|\*|#)/.test(l))return;
   const m=l.match(/Route::(get|post|put|patch|delete|any|match)\(\s*([^,]+?)\s*,\s*\$(\w+)\s*\.\s*'\\?([A-Za-z0-9_\\]*)@(\w+)'/);
   if(m&&vars[m[3]]){const cls=(vars[m[3]]+(m[4]?'\\'+m[4].replace(/^\\/,''):'')).replace(/\\\\/g,'\\');routes.push({kind:'web',uri:m[2].replace(/^['"]|['"]$/g,''),cls,line:i+1,file:`app/${mod.name}/routes/${rf}`})}})}}
// admin group controllers (namespace Admin) may be misresolved: try both
for(const r of routes){if(!clsToFile[r.cls]){const alt=r.cls.replace('App\\Http\\Controllers\\','App\\Http\\Controllers\\Admin\\');if(clsToFile[alt])r.cls=alt}}
const closure=(f)=>{const seen=new Set();const st=[f];while(st.length){const x=st.pop();if(seen.has(x))continue;seen.add(x);for(const d of (deps[x]||[]))st.push(d)}return seen};
const inv={};let unresolved=0;
for(const r of routes){const f=clsToFile[r.cls];if(!f){unresolved++;continue}for(const x of closure(f))(inv[x]=inv[x]||{api:new Set(),web:new Set()})[r.kind].add(r.uri)}
const rel=p=>path.relative(ROOT,p);const loc=p=>fs.readFileSync(p,'utf8').split('\n').length;
console.log(`php classes: ${Object.keys(clsToFile).length}, routes parsed: api ${routes.filter(r=>r.kind==='api').length}, web ${routes.filter(r=>r.kind==='web').length}, unresolved controller refs: ${unresolved}`);
console.log('== modules by number of routes that transitively depend on them (top 45) ==');
Object.entries(inv).sort((a,b)=>(b[1].api.size+b[1].web.size)-(a[1].api.size+a[1].web.size)).slice(0,45).forEach(([f,v])=>console.log(`api ${String(v.api.size).padStart(3)} | web ${String(v.web.size).padStart(3)} | ${String(loc(f)).padStart(5)} lines | ${rel(f)}`));
fs.writeFileSync(process.argv[3],JSON.stringify(Object.fromEntries(Object.entries(inv).map(([f,v])=>[rel(f),{api:[...v.api].sort(),web:[...v.web].sort()}])),null,1));console.log('written',process.argv[3]);
