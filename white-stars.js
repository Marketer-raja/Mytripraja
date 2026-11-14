// Neutralize only isolated star points in the supplied artwork, retaining the nebula.
(() => {
 const image=new Image();image.src='assets/reference.jpeg';
 image.onload=()=>{
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height),data=pixels.data,w=canvas.width,h=canvas.height;
  const original=new Uint8ClampedArray(data);
  const visited=new Uint8Array(w*h);
  const bright=p=>Math.max(original[p*4],original[p*4+1],original[p*4+2])>80;
  for(let y=240;y<850;y++)for(let x=0;x<w;x++){
   const start=y*w+x;if(visited[start]||!bright(start))continue;
   const stack=[start],component=[];visited[start]=1;let minX=x,maxX=x,minY=y,maxY=y;
   while(stack.length){const p=stack.pop(),px=p%w,py=Math.floor(p/w);component.push(p);minX=Math.min(minX,px);maxX=Math.max(maxX,px);minY=Math.min(minY,py);maxY=Math.max(maxY,py);
    for(const q of [p-1,p+1,p-w,p+w]){if(q<0||q>=w*h||visited[q]||Math.abs(q%w-px)>1)continue;if(bright(q)){visited[q]=1;stack.push(q);}}
   }
   if(component.length>36||maxX-minX>8||maxY-minY>8)continue;
   const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
   if(Math.abs(Math.hypot(cx-768,cy-556)-250)<65)continue;
   let surrounding=0,count=0;
   for(let sy=Math.max(0,minY-5);sy<=Math.min(h-1,maxY+5);sy++)for(let sx=Math.max(0,minX-5);sx<=Math.min(w-1,maxX+5);sx++){
    if(sx>=minX&&sx<=maxX&&sy>=minY&&sy<=maxY)continue;
    const p=(sy*w+sx)*4;surrounding+=Math.max(original[p],original[p+1],original[p+2]);count++;
   }
   if(surrounding/count>18)continue;
   const radius=Math.max(maxX-minX,maxY-minY)/2+2;
   for(let sy=Math.max(0,minY-2);sy<=Math.min(h-1,maxY+2);sy++)for(let sx=Math.max(0,minX-2);sx<=Math.min(w-1,maxX+2);sx++){
    const p=(sy*w+sx)*4,white=Math.max(original[p],original[p+1],original[p+2]);
    const amount=Math.max(0,Math.min(1,(radius-Math.hypot(sx-cx,sy-cy))/2));
    for(let ch=0;ch<3;ch++)data[p+ch]=original[p+ch]+(white-original[p+ch])*amount;
   }
  }
  context.putImageData(pixels,0,0);document.querySelector('.art').style.backgroundImage=`url("${canvas.toDataURL('image/png')}")`;
 };
})();
