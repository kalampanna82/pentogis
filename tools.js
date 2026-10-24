// Free GIS tools (tools.html). Everything runs in the browser; nothing is sent anywhere.
const $=id=>document.getElementById(id);
const fmt=(n,d=2)=>n.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const show=(el,html)=>{el.innerHTML=html;el.hidden=!html};

// Tool buttons: show one tool at a time; clicking the open tool's button closes it
const tabs=[...document.querySelectorAll("[data-tool]")];
const isTool=id=>tabs.some(b=>b.dataset.tool===id);
const openTool=(id,url=true)=>{tabs.forEach(b=>{const on=b.dataset.tool===id;b.setAttribute("aria-expanded",on);$(b.dataset.tool).hidden=!on});if(url)history.replaceState(null,"",id?"#"+id:location.pathname)};
tabs.forEach(b=>b.addEventListener("click",()=>openTool(b.getAttribute("aria-expanded")==="true"?null:b.dataset.tool)));
if(tabs.length){const h=location.hash.slice(1);openTool(isTool(h)?h:tabs[0].dataset.tool,false)}
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(isTool(h))openTool(h,false)});

// Parse one coordinate part: "40.7128", "-74.006", "40 42 46 N", "N40°42.767'"
function parsePart(s){
  const hemi=(s.match(/[NSEW]/)||[""])[0];
  const nums=s.match(/-?\d+(?:\.\d+)?/g);
  if(!nums||nums.length>3)return null;
  const [d,m=0,sec=0]=nums.map(Number);
  if(m<0||sec<0||m>=60||sec>=60||(nums.length>1&&!Number.isInteger(d)))return null;
  let v=Math.abs(d)+m/60+sec/3600;
  if(d<0||/^\s*-/.test(s)||hemi==="S"||hemi==="W")v=-v;
  return {v,hemi};
}
// Parse a lat/long pair in decimal degrees, DMS or degrees-decimal-minutes
function parseLatLon(raw){
  let s=raw.toUpperCase().replace(/[′’‘`]/g,"'").replace(/[″“”]/g,'"').replace(/''/g,'"').trim();
  if(!s)return null;
  let parts;
  if(/[NSEW]/.test(s)){
    parts=(/^[NSEW]/.test(s)?s.split(/(?=[NSEW])/):s.split(/(?<=[NSEW])/)).map(p=>p.replace(/^[\s,;]+|[\s,;]+$/g,"")).filter(Boolean);
  }else if(/[,;]/.test(s)){parts=s.split(/[,;]/).map(p=>p.trim()).filter(Boolean)}
  else{const n=s.match(/-?\d+(?:\.\d+)?/g)||[];if(![2,4,6].includes(n.length))return null;const h=n.length/2;parts=[n.slice(0,h).join(" "),n.slice(h).join(" ")]}
  if(!parts||parts.length!==2)return null;
  let a=parsePart(parts[0]),b=parsePart(parts[1]);
  if(!a||!b)return null;
  if(/[EW]/.test(a.hemi)||/[NS]/.test(b.hemi))[a,b]=[b,a];
  if(/[EW]/.test(a.hemi)||/[NS]/.test(b.hemi))return null;
  if(Math.abs(a.v)>90||Math.abs(b.v)>180)return null;
  return {lat:a.v,lon:b.v};
}
const dms=(v,pos,neg)=>{const h=v<0?neg:pos;let a=Math.abs(v),d=Math.floor(a),m=Math.floor((a-d)*60),s=((a-d)*60-m)*60;if(s>=59.995){s=0;m++}if(m===60){m=0;d++}return `${d}°${String(m).padStart(2,"0")}'${s.toFixed(2).padStart(5,"0")}"${h}`};
const ddm=(v,pos,neg)=>{const h=v<0?neg:pos;let a=Math.abs(v),d=Math.floor(a),m=(a-d)*60;if(m>=59.99995){m=0;d++}return `${d}°${m.toFixed(4).padStart(7,"0")}'${h}`};

// WGS84 latitude/longitude to UTM (Snyder, USGS Professional Paper 1395)
function toUTM(lat,lon){
  if(lat<-80||lat>84)return null;
  let zone=Math.floor((lon+180)/6)+1;if(zone===61)zone=60;
  if(lat>=56&&lat<64&&lon>=3&&lon<12)zone=32;
  if(lat>=72){if(lon>=0&&lon<9)zone=31;else if(lon>=9&&lon<21)zone=33;else if(lon>=21&&lon<33)zone=35;else if(lon>=33&&lon<42)zone=37}
  const a=6378137,f=1/298.257223563,k0=.9996,e2=f*(2-f),ep2=e2/(1-e2),e4=e2*e2,e6=e4*e2;
  const p=lat*Math.PI/180,l=(lon-((zone-1)*6-180+3))*Math.PI/180;
  const sp=Math.sin(p),cp=Math.cos(p),tp=Math.tan(p);
  const N=a/Math.sqrt(1-e2*sp*sp),T=tp*tp,C=ep2*cp*cp,A=cp*l;
  const M=a*((1-e2/4-3*e4/64-5*e6/256)*p-(3*e2/8+3*e4/32+45*e6/1024)*Math.sin(2*p)+(15*e4/256+45*e6/1024)*Math.sin(4*p)-(35*e6/3072)*Math.sin(6*p));
  const E=k0*N*(A+(1-T+C)*A**3/6+(5-18*T+T*T+72*C-58*ep2)*A**5/120)+5e5;
  let Nn=k0*(M+N*tp*(A*A/2+(5-T+9*C+4*C*C)*A**4/24+(61-58*T+T*T+600*C-330*ep2)*A**6/720));
  if(lat<0)Nn+=1e7;
  return {zone,band:"CDEFGHJKLMNPQRSTUVWXX"[Math.floor((lat+80)/8)],E,N:Nn};
}

function rows(list){return list.map(([k,v])=>`<div><span>${k}</span><output>${v}</output><button type="button" class="copy" data-copy="${v.replace(/"/g,"&quot;")}" aria-label="Copy ${k}">Copy</button></div>`).join("")}
document.addEventListener("click",e=>{const b=e.target.closest(".copy");if(!b)return;const done=()=>{b.textContent="Copied";setTimeout(()=>b.textContent="Copy",1500)};if(navigator.clipboard)navigator.clipboard.writeText(b.dataset.copy).then(done,()=>{});});

// 1. Coordinate converter
const coordForm=$("coord-form");
if(coordForm)coordForm.addEventListener("submit",e=>{
  e.preventDefault();
  const c=parseLatLon($("coord-in").value),out=$("coord-out"),err=$("coord-err");
  if(!c){show(out,"");show(err,"Couldn't read that coordinate. Try 40.7128, -74.0060 or 40°42'46\"N 74°0'22\"W.");return}
  show(err,"");
  const u=toUTM(c.lat,c.lon);
  const list=[["Decimal degrees",`${c.lat.toFixed(6)}, ${c.lon.toFixed(6)}`],["Degrees, minutes, seconds",`${dms(c.lat,"N","S")} ${dms(c.lon,"E","W")}`],["Degrees, decimal minutes",`${ddm(c.lat,"N","S")} ${ddm(c.lon,"E","W")}`]];
  list.push(["UTM (WGS84)",u?`${u.zone}${u.band} ${Math.round(u.E)}E ${Math.round(u.N)}N`:"Outside UTM (polar area, uses UPS)"]);
  show(out,rows(list)+`<p class="tool-link"><a href="https://www.openstreetmap.org/?mlat=${c.lat.toFixed(6)}&amp;mlon=${c.lon.toFixed(6)}#map=15/${c.lat.toFixed(6)}/${c.lon.toFixed(6)}" target="_blank" rel="noopener">View on map ↗</a></p>`);
});

// 2. Map scale converter
const UNIT={ft:{m:.3048,label:"feet"},mi:{m:1609.344,label:"miles"},m:{m:1,label:"metres"},km:{m:1000,label:"kilometres"}};
const scaleOut=()=>{
  const n=parseFloat(String($("scale-ratio").value).replace(/,/g,"")),out=$("scale-out");
  if(!(n>0)){show(out,"");return}
  const inch=n*.0254,cm=n*.01;
  const g=parseFloat($("scale-ground").value),gu=UNIT[$("scale-ground-unit").value];
  const list=[["Verbal scale (imperial)",`1 inch = ${fmt(inch/.3048,0)} ft (${fmt(inch/1609.344,3)} mi)`],["Verbal scale (metric)",`1 cm = ${fmt(cm,cm<10?2:0)} m (${fmt(cm/1000,3)} km)`],["Representative fraction",`1:${fmt(n,0)}`]];
  if(g>0){const mapM=g*gu.m/n;list.push([`${fmt(g,g%1?2:0)} ${gu.label} on the map`,`${fmt(mapM*100,2)} cm (${fmt(mapM/.0254,2)} in)`])}
  show(out,rows(list));
};
const scaleForm=$("scale-form");
if(scaleForm){
  ["scale-ratio","scale-ground","scale-ground-unit"].forEach(id=>$(id).addEventListener("input",scaleOut));
  const fromVerbal=()=>{const v=parseFloat($("scale-eq").value),u=UNIT[$("scale-eq-unit").value];if(v>0){$("scale-ratio").value=Math.round(v*u.m/.0254);scaleOut()}};
  ["scale-eq","scale-eq-unit"].forEach(id=>$(id).addEventListener("input",fromVerbal));
  document.querySelectorAll("[data-scale]").forEach(b=>b.addEventListener("click",()=>{$("scale-ratio").value=b.dataset.scale;$("scale-eq").value="";scaleOut()}));
  scaleForm.addEventListener("submit",e=>{e.preventDefault();scaleOut()});
  scaleOut();
}

// 3. Distance and area calculator
const distForm=$("dist-form");
if(distForm)distForm.addEventListener("submit",e=>{
  e.preventDefault();
  const a=parseLatLon($("dist-a").value),b=parseLatLon($("dist-b").value),out=$("dist-out"),err=$("dist-err");
  if(!a||!b){show(out,"");show(err,`Couldn't read point ${!a?"A":"B"}. Use a format like 40.7128, -74.0060.`);return}
  show(err,"");
  const R=6371008.8,r=Math.PI/180,p1=a.lat*r,p2=b.lat*r,dp=p2-p1,dl=(b.lon-a.lon)*r;
  const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2,d=2*R*Math.asin(Math.min(1,Math.sqrt(h)));
  const brg=(Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl))/r+360)%360;
  const pts=["N","NE","E","SE","S","SW","W","NW"][Math.round(brg/45)%8];
  show(out,rows([["Kilometres",fmt(d/1000,3)],["Miles",fmt(d/1609.344,3)],["Nautical miles",fmt(d/1852,3)],["Initial bearing",`${fmt(brg,1)}° (${pts})`]]));
});
const areaForm=$("area-form");
const areaOut=()=>{
  const v=parseFloat($("area-r").value),u=UNIT[$("area-unit").value],out=$("area-out");
  if(!(v>0)){show(out,"");return}
  const m2=Math.PI*(v*u.m)**2;
  show(out,rows([["Square kilometres",fmt(m2/1e6,3)],["Square miles",fmt(m2/2589988.110336,3)],["Acres",fmt(m2/4046.8564224,1)],["Hectares",fmt(m2/1e4,1)],["Circumference",`${fmt(2*Math.PI*v,2)} ${u.label}`]]));
};
if(areaForm){["area-r","area-unit"].forEach(id=>$(id).addEventListener("input",areaOut));areaForm.addEventListener("submit",e=>{e.preventDefault();areaOut()})}
