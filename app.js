// Change the launch date and brand text when your project details are ready.
const launchDate = new Date('2028-02-11T00:00:00+05:30').getTime();
const fields=['days','hours','minutes','seconds'];
function tick(){const remaining=Math.max(0,Math.floor((launchDate-Date.now())/1000));const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];fields.forEach((id,i)=>document.getElementById(id).textContent=String(values[i]).padStart(i===0?3:2,'0'));if(remaining===0)document.querySelector('.coming').textContent='THE WAIT IS OVER';}
tick();setInterval(tick,1000);
const dialog=document.getElementById('notice');
function showNotice(title,body){document.getElementById('notice-title').textContent=title;document.getElementById('notice-body').textContent=body;dialog.showModal();}
document.querySelectorAll('[data-social]').forEach(button=>button.addEventListener('click',()=>showNotice(button.dataset.social,'Our '+button.dataset.social+' profile will be shared here when we launch.')));
document.getElementById('close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
// ---- Email capture -> Google Sheets ----
// Paste your Google Apps Script Web App URL here (see google-sheets-setup/SETUP.md).
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbznNf_kgxKgGLjJc6p3NGryo-RIs5c9ivOYa2NcvKvn8L8oH_b_M1BwgkI2UiJWgK4/exec';
document.getElementById('notify').addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.currentTarget;
  const feedback=document.getElementById('feedback');
  const button=form.querySelector('button[type="submit"]');
  const email=document.getElementById('email').value.trim();
  const honeypot=form.querySelector('[name="website"]');
  feedback.classList.remove('ok','err');
  if(honeypot&&honeypot.value){return;} // bots fill hidden field
  if(!email||!form.checkValidity()){feedback.textContent='Please enter a valid email address.';feedback.classList.add('err');return;}
  if(SHEET_ENDPOINT.startsWith('PASTE_')){feedback.textContent='Email collection is not connected yet.';feedback.classList.add('err');return;}
  const label=button.textContent;button.disabled=true;button.textContent='SENDING...';
  try{
    // text/plain avoids a CORS preflight, which Apps Script does not support.
    await fetch(SHEET_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({email,source:location.hostname,submittedAt:new Date().toISOString()})});
    form.reset();
    feedback.textContent='Thank you! You\u2019re on the list \u2014 we\u2019ll notify you as soon as MyTripRaja launches.';
    feedback.classList.add('ok');
  }catch(err){
    feedback.textContent='Something went wrong. Please try again in a moment.';feedback.classList.add('err');
  }finally{button.disabled=false;button.textContent=label;}
});
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
