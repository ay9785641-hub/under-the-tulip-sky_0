// Modular script to run site logic (password, page transitions, typewriter, animations)
const PASSWORD = '0611';

/* --- Utilities --- */
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

/* --- DOM references --- */
const page1 = qs('#page1');
const page2 = qs('#page2');
const page3 = qs('#page3');
const openBtn = qs('#openBtn');
const passwordInput = qs('#passwordInput');
const hint = qs('#hint');
const letterContent = qs('#letterContent');
const nextBtn = qs('#nextBtn');
const flowerScene = qs('#flowerScene');
const petalLayer = qs('#petalLayer');
const starField = qs('#starField');
const shootingStar = qs('#shootingStar');
const sparkles = qs('#sparkles');

/* --- Page helpers --- */
function showPage(target){
  // hide all, then show target with nice fade
  const pages = [page1, page2, page3];
  pages.forEach(p => {
    if(p === target){
      p.hidden = false;
      requestAnimationFrame(()=> {
        p.classList.add('active');
        p.classList.remove('fade-out');
        p.classList.add('fade-in');
      });
    } else {
      p.classList.remove('fade-in');
      p.classList.add('fade-out');
      setTimeout(()=> { p.hidden = true; p.classList.remove('active'); }, 350);
    }
  });
}

/* --- Password logic --- */
openBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') checkPassword();
});

function checkPassword(){
  const val = (passwordInput.value || '').trim();
  if(val === PASSWORD){
    hint.textContent = '';
    // transition to letter (page 2)
    showPage(page2);
    // small delay then start typewriter
    setTimeout(()=> startLetterTyping(), 600);
  } else {
    hint.textContent = 'That is not the one. Try again with love 💌';
    // shake effect
    passwordInput.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(0)' }
    ], { duration: 350, easing: 'ease-in-out' });
  }
}

/* --- Typewriter for letter page --- */
const letterText = `I just wanted to say something...

Aapko pata he, kabhi kabhi na bol dena acha hota he chup rahne se...

Aur bas smile karke esa dikhate he ki sab theek hai.

Aapko kabhi bhi kuch bhi kahna ho,
kuch bhi share karna ho...

I am always here for you.

Main shayad har problem solve na kar pau...

But I can promise that I'll always listen.

Aur honestly...

Jab aap smile karte ho na,
ekdam dil khush hokar haste ho...

Aap nahi jante ki kitne ache lagte ho.

Amazing...
Bahut pyaare...
Aur bahut handsome. 😊👀

Take care of yourself.

Kabhi bhi lage ki kisi ko message karna hai...

I'm just one text away. 🤍`;

// Typing effect with punctuation-aware pauses
async function startLetterTyping(){
  letterContent.textContent = '';
  nextBtn.hidden = true;

  await typewriter(letterContent, letterText, {
    baseDelay: 18,
    punctuationDelay: 260
  });

  // show button after little pause
  setTimeout(()=> {
    nextBtn.hidden = false;
  }, 400);
}

function typewriter(targetEl, text, opts = {}){
  const baseDelay = opts.baseDelay || 22;
  const punctuationDelay = opts.punctuationDelay || 220;
  return new Promise(resolve => {
    let i = 0;
    function step(){
      if(i >= text.length){
        resolve();
        return;
      }
      const ch = text[i++];
      targetEl.textContent += ch;
      // compute delay
      let delay = baseDelay + Math.random()*6;
      if(ch === '.' || ch === '!' || ch === '?') delay += punctuationDelay + Math.random()*60;
      if(ch === ',') delay += 80;
      if(ch === '\n') delay += 140;
      // occasional longer pause at double newline sequences
      if(text[i] === '\n' && ch === '\n') delay += 160;
      setTimeout(step, delay);
    }
    step();
  });
}

/* --- Navigation from letter to finale --- */
nextBtn.addEventListener('click', ()=>{
  showPage(page3);
  // start final animations when page3 shows
  setTimeout(()=> startFinale(), 400);
});

/* --- Sky: stars, petals, shooting star --- */
function spawnStars(count = 60){
  // create simple stars in random positions with twinkle speed
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'star';
    const x = Math.random()*100;
    const y = Math.random()*65;
    const size = Math.random()*2 + 1;
    s.style.left = `${x}%`;
    s.style.top = `${y}%`;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.animationDuration = `${2 + Math.random()*3.6}s`;
    s.style.animationDelay = `${Math.random()*3}s`;
    starField.appendChild(s);
  }
}
spawnStars(80);

/* Petals generation - gentle continuous fall */
function spawnPetal(){
  const p = document.createElement('div');
  p.className = 'petal';
  // random horizontal start across top half
  const startX = Math.random()*110; // percent
  p.style.left = `${startX}%`;
  p.style.top = `-6vh`;
  p.style.width = `${10+Math.random()*16}px`;
  p.style.height = `${10+Math.random()*18}px`;
  const duration = 6000 + Math.random()*7000;
  p.style.animationDuration = `${duration}ms`;
  p.style.transform = `rotate(${Math.random()*360}deg)`;
  petalLayer.appendChild(p);

  // remove after animation complete
  setTimeout(()=> {
    p.remove();
  }, duration + 200);
}
// spawn petals at intervals, a bit bursty but light
let petalInterval = setInterval(()=> {
  const burst = Math.random() < 0.7 ? 1 : Math.floor(Math.random()*3)+1;
  for(let b=0;b<burst;b++){
    spawnPetal();
  }
}, 900);

/* Shooting star timer - occasionally shoot across */
function runShootingStar(){
  // position randomly on left-top quadrant
  shootingStar.style.left = `${5 + Math.random()*40}%`;
  shootingStar.style.top = `${5 + Math.random()*30}%`;
  shootingStar.classList.remove('shooting-run');
  // force reflow to restart animation
  void shootingStar.offsetWidth;
  shootingStar.classList.add('shooting-run');

  // remove after done
  setTimeout(()=> {
    shootingStar.classList.remove('shooting-run');
  }, 1400);
}
// run occasionally
setInterval(()=> {
  if(Math.random() < 0.22) runShootingStar();
}, 3500);

/* --- Finale animation sequence --- */
function startFinale(){
  // create sparkles
  for(let i=0;i<20;i++){
    createSparkle(200 + i*20);
  }

  // bloom flowers in staggered manner
  const flowers = qsa('.flower');
  flowers.forEach((f, idx) => {
    setTimeout(()=> {
      f.classList.add('bloom-in');
      // small bounce with scale
      f.animate([
        { transform: 'translateY(18px) scale(.6)' },
        { transform: 'translateY(0) scale(1.05)' },
        { transform: 'translateY(0) scale(1)' }
      ], { duration: 900, easing: 'cubic-bezier(.2,.9,.3,1)' });
    }, 400 + idx * 420);
  });

  // launch a few sparkles around flowers
  setTimeout(()=> {
    for(let i=0;i<12;i++) createSparkle(0, { center: true });
  }, 1100);

  // big shining effect on the big-declaration text
  const big = qs('.big-declaration');
  if(big){
    big.animate([
      { filter: 'brightness(0.8) drop-shadow(0 0 0 rgba(255,150,180,0))', opacity: 0 },
      { filter: 'brightness(1.5) drop-shadow(0 10px 30px rgba(255,120,160,0.28))', opacity:1 }
    ], { duration: 1100, easing: 'ease-out', fill:'forwards' });
    // tiny pulse
    setInterval(()=> {
      big.animate([
        { transform: 'scale(1)', opacity:1 },
        { transform: 'scale(1.03)', opacity:1 },
        { transform: 'scale(1)', opacity:1 }
      ], { duration: 2200, easing: 'ease-in-out' });
    }, 2500);
  }

  // periodic shooting star
  setTimeout(()=> runShootingStar(), 900);
  setTimeout(()=> runShootingStar(), 2300);
}

/* create sparkle element */
function createSparkle(delay = 0, opts = {}){
  setTimeout(()=> {
    const sp = document.createElement('div');
    sp.className = 'sparkle';
    const w = flowerScene.clientWidth || 300;
    const h = flowerScene.clientHeight || 120;
    let x,y;
    if(opts.center){
      // spawn around center area
      x = (w/2) + (Math.random()*120 - 60);
      y = (h/2) + (Math.random()*40 - 30);
    } else {
      x = Math.random()*w;
      y = Math.random()*h;
    }
    sp.style.left = `${x}px`;
    sp.style.top = `${y}px`;
    // randomize animation duration a bit
    sp.style.animationDuration = `${1 + Math.random()*0.9}s`;
    sparkles.appendChild(sp);
    setTimeout(()=> sp.remove(), 1800);
  }, delay);
}

/* Accessibility: focus first input */
passwordInput.focus();

/* Mobile experience: make inputs larger on touch */
(function enhanceMobile() {
  if('ontouchstart' in window) {
    document.documentElement.style.fontSize = '100%';
  }
})();

/* Clean up on unload */
window.addEventListener('beforeunload', ()=>{
  clearInterval(petalInterval);
});
