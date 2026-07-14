
const reveals=document.querySelectorAll(".reveal");
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")})},{threshold:.15});
reveals.forEach(el=>io.observe(el));
document.getElementById("year").textContent=new Date().getFullYear();
const nav=document.querySelector(".nav");
window.addEventListener("scroll",()=>{nav.style.background=window.scrollY>60?"rgba(4,17,31,.93)":"rgba(4,17,31,.78)"});
