const PASS = "15112006";
const FLY_IMAGES = [];
for(let i=1;i<=50;i++){FLY_IMAGES.push(`style/img/Anh (${i}).jpg`);}

let musicInitialized=false; // track whether we successfully started music
let lockPlayAttempted=false; // whether we've attempted to play lock music (only once)
function press(n){ const el=document.getElementById('pwd'); if(el.value.length<8) el.value+=n; if(!lockPlayAttempted){ lockPlayAttempted=true; tryPlayMusic(); } }
function clearPwd(){ document.getElementById('pwd').value=""; }

function playGiftEffect(callback){
  const box=document.getElementById("giftEffect");
  const hop=document.getElementById("HopQua");
  const nap=document.getElementById("NapHop");
  const than=document.getElementById("ThanHop");
  box.style.display="block";
  setTimeout(()=>{hop.style.display="none";},1000);
  setTimeout(()=>{nap.style.animation="flyUpGift 1.2s forwards";},1000);
  setTimeout(()=>{than.style.animation="flyDownGift 1.2s forwards";},1000);
  setTimeout(()=>{
    box.style.display="none";
    nap.style.animation=""; than.style.animation="";
    hop.style.display="block";
    callback();
  },2300);
}

const messages=[
  "Giáng Sinh này, tớ muốn cảm ơn một cô bạn tuyệt vời và đáng yêu nhất trong cuộc đời tớ ❤️",
  "Chúc Trúc Anh một Giáng Sinh thật ấm áp và đầy yêu thương bên gia đình nha 🎄💖",
  "Mong mỗi ngày của Tiểu Thư đều rực rỡ như những ánh đèn Giáng Sinh ✨",
  "Cảm ơn Trúc Anh vì mỗi lần thấy cậu là mọi phiền muộn của tớ đều tan biến 💕",
  "Tớ rất vui khi là một người bạn cũng như một fan kì cựu của cậu đó 😼🎊",
  "Giáng Sinh này, hãy cùng bạn bè tạo nên những kỷ niệm vui vẻ và đẹp nhất nhé 🎁💞",
  "Bà nhớ ấn vào biểu tượng hộp quà 🎁 bên dưới nha 😎",
  "                                                                                       ",
  "ấn vào 🎁 là càng ra nhiều ảnh đó (nhưng đừng ấn nhiều quá nha 😅 lag máy đấy)"
];

let msgIndex=0, charIndex=0;
const cardMess=document.getElementById("cardMess");
const typingSpeed=70;

function typeMessage(){
  const currentMsg=messages[msgIndex];
  if(charIndex<currentMsg.length){
    cardMess.textContent+=currentMsg.charAt(charIndex);
    charIndex++;
    setTimeout(typeMessage,typingSpeed);
  }else{
    setTimeout(()=>{
      charIndex=0;
      cardMess.textContent="";
      msgIndex=(msgIndex+1)%messages.length;
      typeMessage();
    },2000);
  }
}
function startTypingEffect(){ typeMessage(); }

function checkPwd(){
  const v=document.getElementById('pwd').value;
  if(v===PASS){
    document.getElementById('lockScreen').style.display='none';
    playMusic();
    playGiftEffect(()=>{
      const card=document.getElementById('cardScene');
      card.style.display='block';
      setTimeout(()=>{ card.style.opacity=1; },50);
      startTypingEffect();
    });
  }else{
    const msg=document.getElementById('msg');
    msg.textContent="Sai rồi...Có bấy nhiêu cũng không nhớ 😑";
    setTimeout(()=>msg.textContent="",2000);
    clearPwd();
  }
}

function showMsg(text, duration = 2500) {
  const el = document.getElementById('msg');
  if(!el) return;
  el.textContent = text;
  setTimeout(()=>{ if(el.textContent === text) el.textContent = ''; }, duration);
}

// The music prompt overlay was removed; no-op placeholder functions kept in case other code references
function showMusicPrompt(){ /* no-op */ }
function hideMusicPrompt(){ /* no-op */ }

function playMusic(startAt=7){ 
  const music=document.getElementById('bgMusic'); 
  // stop lock screen music if playing
  try{ const lm = document.getElementById('lockMusic'); if(lm && !lm.paused){ lm.pause(); lm.currentTime = 0; } }catch(e){}
  if(startAt!==undefined && !isNaN(startAt)) music.currentTime = startAt;
  try{ music.muted = false; music.volume = Math.max(0.1, music.volume || 1); }catch(e){}
  music.play().then(()=>{
    musicInitialized = true;
    updateMusicToggle(true);
  }).catch((e)=>{
    updateMusicToggle(false);
    showMsg('Trình duyệt chặn phát nhạc — bấm màn hình để bật.');
  }); 
}

function tryPlayMusic(force=false){ // attempt to start lock screen music on user interaction
  // If we've already successfully started music, ignore unless forced
  if(musicInitialized && !force) return;
  const lockMusic = document.getElementById('lockMusic');
  const music = document.getElementById('bgMusic');
  console.log('tryPlayMusic: trigger');
  if(lockMusic){
    console.log('tryPlayMusic: attempting to play lockMusic');
    try{ lockMusic.muted=false; lockMusic.volume = Math.max(0.1, lockMusic.volume || 1); }catch(e){}
    lockMusic.currentTime = 0;
    lockMusic.play().then(()=>{
      console.log('tryPlayMusic: lockMusic started');
      musicInitialized = true;
      updateMusicToggle(false);
    }).catch((e)=>{
      console.warn('tryPlayMusic: lockMusic blocked or failed');
      // User requested: remove lock screen 'music blocked' notification, so do not call showMsg here
      musicInitialized = false; // allow retry
    });
    return;
  }
  // if no lockMusic available, show message to user
  console.log('tryPlayMusic: lockMusic not found');
  showMsg('Không tìm thấy nhạc khóa (nhac2.mp3). Vui lòng thêm file hoặc kiểm tra đường dẫn.');
}

document.getElementById('openGift').addEventListener('click',()=>{
  let count=0;
  const total=550;
  const timer=setInterval(()=>{
    spawnImg(); count++;
    if(count>=total) clearInterval(timer);
  },800);
});

function spawnImg(){
  const src=FLY_IMAGES[Math.floor(Math.random()*FLY_IMAGES.length)];
  const img=document.createElement('img');
  img.src=src;
  img.className='flyImg';
  img.style.height=(100+Math.random()*200)+'px';
  img.style.top=Math.random()*(window.innerHeight-150)+'px';
  const dur=6+Math.random()*3;
  img.style.animation=`moveLeftToRight ${dur}s linear forwards`;
  document.body.appendChild(img);
  setTimeout(()=>img.remove(),dur*1000);
}

function checkOrientation() {
  const warn = document.getElementById('rotateWarning');
  if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
    warn.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else {
    warn.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
checkOrientation();

function createHeart(){
  const emojis=['❤️','🌲','🎁','❄️', '🍧','☃️', '🎄','🎉','🧋','😸'];
  const heart=document.createElement('div');
  heart.classList.add('heart');
  heart.innerHTML=emojis[Math.floor(Math.random()*emojis.length)];
  heart.style.left=Math.random()*window.innerWidth+'px';
  heart.style.fontSize=15+Math.random()*25+'px';
  document.body.appendChild(heart);
  setTimeout(()=>heart.remove(),6000);
}

function createFloatingEmoji(){
  const emojis=['❤️','🌲','🎁','❄️', '🍧','☃️', '🎄','🎉','🧋','😸'];
  const emoji=document.createElement('div');
  emoji.classList.add('floating-emoji');
  emoji.innerHTML=emojis[Math.floor(Math.random()*emojis.length)];
  
  const startX = Math.random() * window.innerWidth;
  emoji.style.left = startX + 'px';
  emoji.style.bottom = '-50px';
  emoji.style.fontSize = (30 + Math.random() * 30) + 'px';
  
  const drift = (Math.random() - 0.5) * 100;
  emoji.style.setProperty('--drift', drift + 'px');
  
  document.body.appendChild(emoji);
  
  // Click handler for fireworks effect
  emoji.addEventListener('click', (e) => {
    e.stopPropagation();
    createFirework(startX, e.clientY || window.innerHeight / 2, emoji.innerHTML);
    emoji.remove();
  });
  
  setTimeout(()=>emoji.remove(),8000);
}

function createFirework(x, y, emojiHTML){
  const container = document.getElementById('emojiContainer') || document.body;
  const particleCount = 12;
  const emojis = ['❤️','🌲','🎁','❄️', '🍧','☃️', '🎄','🎉','🧋','😸','✨','💫'];
  
  for(let i = 0; i < particleCount; i++){
    const particle = document.createElement('div');
    particle.classList.add('firework-emoji');
    particle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    document.body.appendChild(particle);
    setTimeout(()=>particle.remove(), 1000);
  }
}

// Start spawning floating emoji
setInterval(createFloatingEmoji, 300);

setInterval(createHeart,400);

// Initialize music button and handlers once DOM elements exist
function initMusicControl(){
  const btn=document.getElementById('musicToggle');
  const music=document.getElementById('bgMusic');
  if(!btn || !music) return;
  console.log('initMusicControl: found button and music');
  btn.addEventListener('click',()=>{
    // toggle playback
    console.log('musicToggle clicked');
    toggleMusicAsync();
  });
  // We have hidden the button on lock screen; do not add a global click to auto-play.
  // reflect initial state
  updateMusicToggle(!music.paused);
  // No persistence required when toggle is hidden; do not attempt auto-play from localStorage
  // No auto-play on lock screen: do not attach gesture listeners
}

// Attach click/touchstart on the lock screen to attempt to play music on first user gesture
// attachLockScreenGesture removed: auto-play disabled by user request

// Attach global touch/click so tapping anywhere (while lockScreen is visible) triggers lockMusic
function attachGlobalTouchGesture(){
  const doc = document;
  const lock = document.getElementById('lockScreen');
  if(!lock) return;
  const handler = (e)=>{
    try{
      if(lock.style.display === 'none') return;
      console.log('Global touch detected while lockScreen visible, trying to play lockMusic');
      tryPlayMusic();
      if(musicInitialized){
        doc.removeEventListener('click', handler);
        doc.removeEventListener('touchstart', handler);
      }
    }catch(err){ console.warn('attachGlobalTouchGesture error', err); }
  };
  doc.addEventListener('click', handler, { passive: true });
  doc.addEventListener('touchstart', handler, { passive: true });
  const observer = new MutationObserver((mutations)=>{
    mutations.forEach(m=>{
      if(m.type === 'attributes' && m.attributeName === 'style'){
        if(lock.style.display === 'none'){
          try{ doc.removeEventListener('click', handler); doc.removeEventListener('touchstart', handler); }catch(e){}
          try{ observer.disconnect(); }catch(e){}
        }
      }
    });
  });
  observer.observe(lock, { attributes: true });
}

// The overlay 'Nhấn để bật nhạc' was removed; no event handler required.

// Set up controls once DOM loaded
window.addEventListener('DOMContentLoaded', ()=>{ initMusicControl(); });
// Also call immediately (script is loaded at end of body, but ensure init runs)
initMusicControl();
