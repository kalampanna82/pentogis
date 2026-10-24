// Reveal sections as they scroll into view
const reveals=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}})},{threshold:.15});
  reveals.forEach(el=>io.observe(el));
}else reveals.forEach(el=>el.classList.add("visible"));

document.getElementById("year").textContent=new Date().getFullYear();

// Solidify the nav once the page scrolls
const nav=document.querySelector(".nav");
const onScroll=()=>nav.classList.toggle("scrolled",window.scrollY>60);
window.addEventListener("scroll",onScroll,{passive:true});onScroll();

// Mobile menu
const toggle=document.querySelector(".menu-toggle");
const setMenu=open=>{nav.classList.toggle("open",open);toggle.setAttribute("aria-expanded",open);toggle.setAttribute("aria-label",open?"Close menu":"Open menu")};
toggle.addEventListener("click",()=>setMenu(!nav.classList.contains("open")));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){setMenu(false);toggle.focus()}});
document.querySelectorAll("#site-links a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));

// Contact form: open the visitor's email app with the inquiry filled in
const form=document.getElementById("contact-form");
if(form)form.addEventListener("submit",e=>{
  e.preventDefault();
  const d=new FormData(form);
  const subject=`Project inquiry: ${d.get("service")} (${d.get("name")})`;
  const body=[`Name: ${d.get("name")}`,`Email: ${d.get("email")}`,d.get("organization")?`Organization: ${d.get("organization")}`:"",`Area of interest: ${d.get("service")}`,"",d.get("message")].filter((l,i)=>l!==""||i===4).join("\n");
  window.location.href=`mailto:info@pentogis.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.getElementById("form-status").hidden=false;
});

// Tab buttons (Tools, Maps): show one panel at a time; clicking the open one's button closes it
const tabs=[...document.querySelectorAll("[data-tab]")];
const isTab=id=>tabs.some(b=>b.dataset.tab===id);
const openTab=(id,url=true)=>{tabs.forEach(b=>{const on=b.dataset.tab===id;b.setAttribute("aria-expanded",on);document.getElementById(b.dataset.tab).hidden=!on});if(url)history.replaceState(null,"",id?"#"+id:location.pathname)};
tabs.forEach(b=>b.addEventListener("click",()=>openTab(b.getAttribute("aria-expanded")==="true"?null:b.dataset.tab)));
if(tabs.length){const h=location.hash.slice(1);openTab(isTab(h)?h:tabs[0].dataset.tab,false)}
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(isTab(h))openTab(h,false)});
