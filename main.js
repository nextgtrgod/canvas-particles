import g from"./modules/Sketch/index.js";import w from"./utils/clamp.js";import d from"./utils/animator.js";let h=(()=>{try{return window.self!==window.top}catch(a){return!0}})(),f=document.getElementById("scene"),i=new g({canvas:f,controls:!h}),p=async()=>{let a=null;try{a=await navigator.mediaDevices.getUserMedia({audio:!0});let e=new window.AudioContext(),t=e.createAnalyser(),r=e.createMediaStreamSource(a);r.connect(t),t.fftSize=2048;let l=t.frequencyBinCount,s=new Uint8Array(l),u=n=>{t.getByteFrequencyData(s);let c=0;for(let o=0;o<l;o++)c+=s[o];let m=w(0,1.25*(c/l)/128,1);i.amp=m,n.clearRect(0,0,n.canvas.width,n.canvas.height),n.fillRect(0,(1-m)*n.canvas.height,n.canvas.width,n.canvas.height),n.fill()};return u}catch(e){console.log(e)}},y=a=>{let e=document.getElementById("mic");if(!e)return;e.classList.add("highlight");let t=document.createElement("canvas"),r=window.devicePixelRatio;t.width=48*r,t.height=48*r,e.appendChild(t),e.addEventListener("click",async()=>{let s=await p();d.add(()=>s(l)),e.classList.remove("highlight")});let l=t.getContext("2d");l.fillStyle="#01bfbf"};if(h){document.body.classList.add("is-iframe"),i.draw();let a=["http://localhost:8080","https://nextgtrgod.github.io"];window.addEventListener("message",e=>{if(!a.includes(e.origin))return;switch(e.data){case"start":i.start();break;case"stop":i.stop();break}})}else{d.add(()=>i.draw()),y(),d.play();let a=document.getElementById("controls");document.addEventListener("keyup",({keyCode:e})=>{if(e!==72)return;a.classList.toggle("hidden"),i.controls=!i.controls,window.dispatchEvent(new Event("resize"))}),console.log("h - toggle controls")}