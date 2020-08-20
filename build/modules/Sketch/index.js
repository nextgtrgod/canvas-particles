import e from"../../utils/random.js";import l from"./Dot.js";let i=parseInt(new URL(document.location).searchParams.get("dpi"))||window.devicePixelRatio,a=window.innerWidth*i,n=window.innerHeight*i,g=Math.max(a,n)/3;const o=Math.PI;class x{constructor({canvas:t,controls:s}){this.canvas=t,this.controls=s,this.radId=null,this.init();let r=null;window.addEventListener("resize",()=>{clearTimeout(r),r=setTimeout(()=>{this.init(),this.draw()},150)})}init(){a=window.innerWidth*i,n=window.innerHeight*i,this.threshold=Math.max(a,n)/3,this.amp=1,this.canvas.width=a,this.canvas.height=n,this.ctx=this.canvas.getContext("2d",{alpha:!1}),this.createDots()}createDots(){this.dots=[];let t=32,s=2,r=window.innerWidth>=600?2:1;for(let d=0;d<t;d++){let c=e.range(.5,s)*i,h=o/12,m=e.from([e.range(h,o/2-h),e.range(o/2+h,o-h),e.range(o+h,1.5*o-h),e.range(1.5*o+h,2*o-h)]);this.dots.push(new l({id:d,x:e.range(0,a),y:e.range(0,n),r:e.range(3,5)*r*i,v:{x:c*Math.cos(m),y:c*Math.sin(m)}}))}controls&&this.dots.push(new l({id:t,type:"static",x:a-(24*i+10*i),y:0+(24*i+10*i),r:24*i,v:{x:0,y:0}}),new l({id:t++,type:"static",x:a/2,y:n-(36*i+10*i),r:36*i,v:{x:0,y:0}}))}draw(){this.ctx.fillStyle="#000",this.ctx.fillRect(0,0,a,n);for(let t=0;t<this.dots.length;t++){this.dots[t].update(this.ctx,a,n,this.dots,this.threshold*this.amp);for(let s in this.dots[t].lines)this.ctx.beginPath(),this.ctx.moveTo(this.dots[t].lines[s][0].x,this.dots[t].lines[s][0].y),this.ctx.lineTo(this.dots[t].lines[s][1].x,this.dots[t].lines[s][1].y),this.ctx.strokeStyle=`rgba(240, 240, 240, ${this.dots[t].lines[s].alpha})`,this.ctx.lineWidth=this.dots[t].lines[s].width,this.ctx.stroke()}}update(){this.radId=requestAnimationFrame(()=>this.update()),this.draw()}start(){this.update()}stop(){cancelAnimationFrame(this.radId)}}export default x;
