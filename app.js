// Change the launch date and brand text when your project details are ready.
const launchDate = new Date('2028-02-11T00:00:00+05:30').getTime();
const fields=['days','hours','minutes','seconds'];
function tick(){const remaining=Math.max(0,Math.floor((launchDate-Date.now())/1000));const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];fields.forEach((id,i)=>document.getElementById(id).textContent=String(values[i]).padStart(i===0?3:2,'0'));if(remaining===0)document.querySelector('.coming').textContent='THE WAIT IS OVER';}
tick();setInterval(tick,1000);
const dialog=document.getElementById('notice');
function showNotice(title,body){document.getElementById('notice-title').textContent=title;document.getElementById('notice-body').textContent=body;dialog.showModal();}
document.querySelectorAll('[data-social]').forEach(button=>button.addEventListener('click',()=>showNotice(button.dataset.social,'Our '+button.dataset.social+' profile will be shared here when we launch.')));
document.getElementById('close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.getElementById('notify').addEventListener('submit',event=>{event.preventDefault();document.getElementById('feedback').textContent='Email notifications aren’t connected yet. Please check back for launch updates.';});
// One forward-only source draws both sides in the same callback, avoiding drift.
const glowSource = document.getElementById('glow-source');
const glowCanvases = [...document.querySelectorAll('canvas.glow-video')];
const glowContexts = glowCanvases.map(canvas=>canvas.getContext('2d'));
const glowMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let glowFramePending = false;
function drawGlowFrame(){
  glowFramePending = false;
  if(glowSource.readyState >= 2){
    for(let i=0;i<glowCanvases.length;i++){
      const context=glowContexts[i];
      context.globalCompositeOperation='source-over';
      context.drawImage(glowSource,0,0,540,960);
      context.globalCompositeOperation='multiply';
      context.fillStyle=i===0?'#a018ff':'#124eff';
      context.fillRect(0,0,540,960);
      context.globalCompositeOperation='source-over';
    }
  }
  if(!glowSource.paused && !document.hidden && !glowMotionPreference.matches)queueGlowFrame();
}
function queueGlowFrame(){
  if(glowFramePending)return;
  glowFramePending=true;
  if('requestVideoFrameCallback' in glowSource)glowSource.requestVideoFrameCallback(drawGlowFrame);
  else requestAnimationFrame(drawGlowFrame);
}
function updateGlowPlayback(){
  if(document.hidden || glowMotionPreference.matches){glowSource.pause();}
  else{glowSource.play().then(queueGlowFrame).catch(()=>{});}
}
glowSource.addEventListener('loadeddata',queueGlowFrame);
glowSource.addEventListener('playing',queueGlowFrame);
document.addEventListener('visibilitychange',updateGlowPlayback);
glowMotionPreference.addEventListener('change',updateGlowPlayback);
updateGlowPlayback();
