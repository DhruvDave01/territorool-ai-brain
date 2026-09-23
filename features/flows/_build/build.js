// Renders features/flows/*.png from manifest.js. Run: node features/flows/_build/build.js [flow-file]
// Needs Google Chrome and macOS sips. Each still is embedded at 2x from B1/screenshots.
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const B1='/Users/dhruvdave/Dhurv/RMDBRAIN/B1';
const flows=require(__dirname+'/manifest.js');
const TMP=require('os').tmpdir()+'/territool-flows'; fs.mkdirSync(TMP,{recursive:true});
// inventory: every still with its pixel size (symlinks included)
const inv=execSync(`cd "${B1}" && find screenshots features \\( -type f -o -type l \\) \\( -iname '*.png' -o -iname '*.jpg' \\) | sort | while read f; do d=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null </dev/null | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}'); echo "$d\t$f"; done`,{maxBuffer:1<<26}).toString();
const only=process.argv[2];
// inventory
const dims={},real={};
const norm=p=>p.replace(/[\u202f\u00a0]/g,' ');
inv.split('\n').filter(Boolean).forEach(l=>{const [d,p]=l.split('\t');const [w,h]=d.split('x').map(Number);dims[norm(p)]={w,h};real[norm(p)]=p});
const OUT=path.resolve(__dirname,'..'); fs.mkdirSync(OUT,{recursive:true});
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const fontB=`file://${B1}/assets/fonts/web/DinBold.ttf`, fontL=`file://${B1}/assets/fonts/web/DinLight.ttf`;
const mark=`file://${B1}/assets/logos/territool-wordmark-black.png`;
let missing=[];
for(const f of flows){
  if(only && f.file!==only) continue;
  const PAD=40, GAP=28, ARROW=36, CARDPAD=14, HEAD=124; // card head: title+caption block
  const cols=f.cols;
  const cards=f.steps.map((s,i)=>{
    const d=dims[norm(s.img)]; s={...s,img:real[norm(s.img)]||s.img}; if(!d){missing.push(s.img);return null}
    const w=s.w||f.imgW; let h=Math.round(d.h*w/d.w); let crop=false; const CAP=w>500?1150:1100; if(h>CAP){h=CAP;crop=true;}
    return {...s,i,w,h,crop,c:crop?s.c+' (Top of a longer page.)':s.c,cardW:w+CARDPAD*2,cardH:CARDPAD+HEAD+h+CARDPAD};
  }).filter(Boolean);
  // rows
  const rows=[]; for(let i=0;i<cards.length;i+=cols) rows.push(cards.slice(i,i+cols));
  const rowW=r=>r.reduce((a,c)=>a+c.cardW,0)+(r.length-1)*ARROW;
  const W=Math.max(...rows.map(rowW))+PAD*2;
  const TOP=150; const notesH=f.notes.length? 34+f.notes.length*24+24:0;
  let y=TOP; const rowTops=[];
  rows.forEach(r=>{rowTops.push(y); y+=Math.max(...r.map(c=>c.cardH))+GAP;});
  const H=y-GAP+PAD+notesH+PAD;
  let html=`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:DINB;src:url("${fontB}")}
@font-face{font-family:DINL;src:url("${fontL}")}
*{box-sizing:border-box}body{margin:0;width:${W}px;height:${H}px;background:#eef1f6;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#333;position:relative}
.hdr{position:absolute;left:${PAD}px;top:${PAD-6}px;width:${W-PAD*2}px;height:${TOP-PAD}px}
.hdr .mod{font-family:DINB;font-size:44px;line-height:48px;color:#124ac6;letter-spacing:.2px}
.hdr .mod span{color:#667085;font-family:DINL;margin-right:14px}
.hdr .sub{margin-top:6px;font-size:17px;color:#333;max-width:${W-PAD*2-360}px;line-height:24px}
.hdr .sub b{color:#124ac6;font-weight:700}
.hdr .right{position:absolute;right:0;top:4px;text-align:right;font-size:13px;color:#667085;line-height:20px}
.hdr .right img{height:34px;display:block;margin:0 0 8px auto}
.row{position:absolute;left:${PAD}px;display:flex;align-items:flex-start}
.card{background:#fff;border:1px solid #e6eaf0;border-radius:12px;padding:${CARDPAD}px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.card .h{height:${HEAD}px;overflow:hidden}
.card .t{display:flex;align-items:flex-start;gap:10px;font-family:DINB;font-size:22px;line-height:26px;color:#111;max-height:52px;overflow:hidden}
.card .n{flex:none;width:30px;height:30px;border-radius:15px;background:#124ac6;color:#fff;font-family:DINB;font-size:18px;display:flex;align-items:center;justify-content:center}
.card .c{margin-top:7px;font-size:14px;line-height:18px;color:#475467;max-height:54px;overflow:hidden}
.card img{display:block;border:1px solid #dfe3ea;border-radius:8px}
.arrow{flex:none;width:${ARROW}px;display:flex;justify-content:center}
.arrow svg{width:22px;height:22px}
.notes{position:absolute;left:${PAD}px;width:${W-PAD*2}px;background:#fff;border:1px solid #e6eaf0;border-radius:12px;padding:14px 18px}
.notes .nt{font-family:DINB;font-size:18px;color:#124ac6;margin-bottom:6px}
.notes li{font-size:14px;line-height:24px;color:#333}
.notes ul{margin:0;padding-left:18px}
.foot{position:absolute;right:${PAD}px;bottom:14px;font-size:12px;color:#98a2b3}
</style></head><body>
<div class="hdr"><div class="mod"><span>${esc(f.module)}</span>${esc(f.title)}</div>
<div class="sub"><b>${esc(f.surface)}</b> · ${esc(f.role)}<br>${esc(f.purpose)}</div>
<div class="right"><img src="${mark}">${cards.length} steps · rendered 2026-09-23 from the stills in B1/screenshots<br>Pixels win. If a caption and a still disagree, the still is right.</div></div>`;
  rows.forEach((r,ri)=>{
    const rowH=Math.max(...r.map(c=>c.cardH));
    html+=`<div class="row" style="top:${rowTops[ri]}px">`;
    r.forEach((c,ci)=>{
      if(ci>0){const mid=CARDPAD+HEAD+Math.min(...r.map(x=>x.h))/2-11; html+=`<div class="arrow" style="margin-top:${Math.round(mid)}px"><svg viewBox="0 0 24 24" fill="none" stroke="#124ac6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>`}
      html+=`<div class="card" style="width:${c.cardW}px"><div class="h"><div class="t"><span class="n">${c.i+1}</span><span>${esc(c.t)}</span></div><div class="c">${esc(c.c)}</div></div><img src="file://${encodeURI(B1+'/'+c.img)}" width="${c.w}" height="${c.h}" style="object-fit:cover;object-position:top"></div>`;
    });
    html+=`</div>`;
  });
  if(f.notes.length){html+=`<div class="notes" style="top:${y-GAP+PAD}px"><div class="nt">Rules and strings for this module</div><ul>${f.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div>`}
  html+=`<div class="foot">TerriTool · B1 brain · features/flows/${f.file}.png</div></body></html>`;
  const hp=`${TMP}/${f.file}.html`; fs.writeFileSync(hp,html);
  const out=`${OUT}/${f.file}.png`;
  execSync(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --window-size=${W},${H} --force-device-scale-factor=2 --screenshot="${out}" "file://${hp}" 2>/dev/null`);
  console.log(f.file, `${W}x${H} css`, cards.length,'steps');
}
if(missing.length){console.log('MISSING:\n'+missing.join('\n'));process.exit(1)}
