/* ============ CONFIG — edit these for your wedding ============ */
const WEDDING_DATE = new Date('2026-12-07T00:00:00');

/* Lock viewport height on load — avoids layout shift when mobile address bar shows/hides */
(function lockViewportHeight() {
  const apply = () => {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight * 0.01}px`);
  };
  apply();
  window.addEventListener('orientationchange', () => setTimeout(apply, 150));
})();

/* ============ ENTRY GATE ============ */
const gate = document.getElementById('entry-gate');
const entryVideo = document.getElementById('entry-video');
const entryFallback = document.getElementById('entryFallback');
const entryPlayBtn = document.getElementById('entryPlay');
const entryTapHint = document.getElementById('entryTapHint');
const bgAudio = document.getElementById('bg-audio');
const petalsCvs = document.getElementById('petals-canvas');

let audioPlaying = false;
let mainRevealed = false;
let userTapped = false;
let videoUsable = true;
let playbackStarted = false;

document.body.style.overflow = 'hidden';

function revealMain() {
  if (mainRevealed) return;
  mainRevealed = true;
  gate.classList.add('fade-out');
  setTimeout(() => { gate.style.display = 'none'; }, 900);
  document.body.style.overflow = 'auto';
  if (petalsCvs) petalsCvs.classList.add('active');
  setTimeout(() => {
    document.body.classList.replace('is-night', 'is-day');
  }, 800);
}

async function startEntryPlayback() {
  if (!videoUsable) { revealMain(); return; }
  if (playbackStarted) return;
  playbackStarted = true;

  // Safety net: armed *before* awaiting play(), since that promise can hang
  // indefinitely on iOS Safari (never resolve or reject) if it overlaps with
  // another in-flight play() call. Without this guaranteed up front, a hang
  // here would block the code below forever and leave the visitor stuck.
  const failSafeMs = (isFinite(entryVideo.duration) ? entryVideo.duration * 1000 : 8000) + 4000;
  setTimeout(() => { if (!mainRevealed) revealMain(); }, failSafeMs);

  try {
    entryVideo.currentTime = 0;
    entryVideo.muted = false;
    await entryVideo.play();
    try { await bgAudio.play(); audioPlaying = true; updateAudioIcon(); } catch (_) {}
  } catch (e) {
    revealMain();
  }
}

entryVideo.addEventListener('error', () => {
  videoUsable = false;
  entryFallback.style.display = 'block';
});
entryVideo.addEventListener('loadedmetadata', () => {
  // Once the user has tapped, real playback owns the video element --
  // don't let this muted-preview logic touch play/mute/currentTime and
  // risk colliding with it (a real source of iOS Safari play() hangs).
  if (userTapped) return;
  entryVideo.muted = true;
  try { entryVideo.currentTime = 0.001; } catch (_) {}
  const p = entryVideo.play();
  if (p) p.then(() => {
    if (!userTapped) entryVideo.pause();
  }).catch(() => {});
});
entryVideo.addEventListener('ended', revealMain);

function enterSite() {
  if (mainRevealed || userTapped) return;
  userTapped = true;
  entryTapHint.classList.add('hide');
  startEntryPlayback();
}
gate.addEventListener('click', enterSite);
entryPlayBtn.addEventListener('click', (e) => { e.stopPropagation(); enterSite(); });

/* If the video never becomes usable shortly after load, show the fallback UI */
setTimeout(() => {
  if (!mainRevealed && entryVideo.readyState === 0) {
    videoUsable = false;
    entryFallback.style.display = 'block';
  }
}, 1500);

/* ============ DAY/NIGHT & AUDIO TOGGLE ============ */
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('is-day');
  document.body.classList.toggle('is-night');
});

const audioBtn = document.getElementById('audio-btn');
const iconOn = document.getElementById('icon-on');
const iconOff = document.getElementById('icon-off');

function updateAudioIcon() {
  iconOn.style.display = audioPlaying ? '' : 'none';
  iconOff.style.display = audioPlaying ? 'none' : '';
}

audioBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (audioPlaying) { bgAudio.pause(); audioPlaying = false; }
  else { try { await bgAudio.play(); audioPlaying = true; } catch (_) {} }
  updateAudioIcon();
});

/* ============ COUNTDOWN TIMER ============ */
const pad = n => String(n).padStart(2, '0');

function updateCountdown() {
  const distance = WEDDING_DATE.getTime() - new Date().getTime();
  if (distance < 0) return;
  document.getElementById('cd-days').textContent = pad(Math.floor(distance / (1000 * 60 * 60 * 24)));
  document.getElementById('cd-hours').textContent = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  document.getElementById('cd-minutes').textContent = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  document.getElementById('cd-seconds').textContent = pad(Math.floor((distance % (1000 * 60)) / 1000));
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ============ DAY / MONTH / YEAR VALUES ============ */
(function fillDateParts() {
  document.getElementById('mh-day').textContent = String(WEDDING_DATE.getDate()).padStart(2, '0');
  document.getElementById('mh-month').textContent = WEDDING_DATE.toLocaleDateString('en-US', { month: 'short' });
  document.getElementById('mh-year').textContent = WEDDING_DATE.getFullYear();
})();

/* ============ INDIVIDUAL HEART SCRATCH CARD MAGIC ============ */
function fireConfetti() {
  const colors = ['#D4AF37', '#FFF8E7', '#F9E596', '#e0a59c'];
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  for (let i = 0; i < 80; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'absolute';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.top = -20 + 'px';
    conf.style.width = Math.random() * 10 + 5 + 'px';
    conf.style.height = Math.random() * 14 + 6 + 'px';
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

    const duration = Math.random() * 2 + 2;
    const delay = Math.random() * 0.5;

    conf.style.transition = `transform ${duration}s cubic-bezier(.37,0,.63,1) ${delay}s, opacity ${duration}s ease-in ${delay}s`;
    container.appendChild(conf);

    setTimeout(() => {
      conf.style.transform = `translate(${Math.random() * 200 - 100}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
      conf.style.opacity = '0';
    }, 50);
  }
  setTimeout(() => container.remove(), 4600);
}

function initScratchCard() {
  const canvases = document.querySelectorAll('.scratch-canvas-heart');
  if (canvases.length === 0) return;

  let heartsRevealed = 0;

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = 112;
    canvas.height = 112;

    const path = new Path2D('M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2 c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z');

    const scale = 112 / 32;
    ctx.scale(scale, scale);

    const gradient = ctx.createLinearGradient(0, 0, 32, 32);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.5, '#FFF8E7');
    gradient.addColorStop(1, '#D4AF37');
    ctx.fillStyle = gradient;
    ctx.fill(path);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#6e5405';
    ctx.font = "italic 600 16px 'Cormorant Garamond'";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch', canvas.width / 2, canvas.height / 2 - 8);

    let isDrawing = false;
    let isRevealed = false;

    function getTouchPos(e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      const pos = getTouchPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
      ctx.fill();
      checkReveal();
    }

    function checkReveal() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }
      const clearPercentage = transparentPixels / (pixels.length / 4);

      if (clearPercentage > 0.65 && !isRevealed) {
        isRevealed = true;
        canvas.style.transition = 'opacity 0.6s ease';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 600);

        heartsRevealed++;
        if (heartsRevealed === 3) triggerFinalReveal();
      }
    }

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true; scratch(e);
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (isDrawing) { scratch(e); if (e.cancelable) e.preventDefault(); }
    }, { passive: false });

    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchcancel', () => isDrawing = false);
  });

  function triggerFinalReveal() {
    setTimeout(() => {
      document.getElementById('pre-scratch-text').classList.add('hidden');
      document.getElementById('post-scratch-content').classList.add('revealed');
      fireConfetti();
    }, 300);
  }
}
window.addEventListener('load', initScratchCard);

/* ============ SCROLL REVEAL ============ */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => io.observe(el));

/* ============ AMBIENT FAIRY DUST ============ */
(function initMagicalGlitter() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function getLockedHeight() {
    const appHeight = getComputedStyle(document.documentElement).getPropertyValue('--app-height');
    return appHeight ? parseFloat(appHeight) * 100 : window.innerHeight;
  }
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = getLockedHeight();
  }
  resize();
  window.addEventListener('orientationchange', () => setTimeout(resize, 150));
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('resize', resize);
  }

  const COLORS = ['#FFD700', '#F9E596', '#D4AF37', '#FFF8E7', '#FCE4EC'];
  let particles = [];

  for (let i = 0; i < 70; i++) particles.push(new Particle(null, null, true));

  function Particle(x, y, isAmbient) {
    this.isAmbient = isAmbient;

    this.reset = (initial) => {
      this.x = x !== null ? x : Math.random() * width;
      this.y = y !== null ? y : (initial ? Math.random() * height : height + 20);
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.8 + 0.2);
      this.alpha = Math.random();
      this.fadeRate = (Math.random() - 0.5) * 0.03;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    };

    this.reset(true);

    this.update = () => {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += this.fadeRate;
      if (this.alpha <= 0.1 || this.alpha >= 1) this.fadeRate *= -1;
      if (this.y < -20) {
        if (this.isAmbient) this.reset(false);
        else this.dead = true;
      }
    };

    this.draw = () => {
      if (this.dead) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
  }

  (function loop() {
    ctx.clearRect(0, 0, width, height);
    particles = particles.filter(p => !p.dead);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

