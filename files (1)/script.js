'use strict';

/* ════════════════════════════════════
   DATA
════════════════════════════════════ */
const ROLES = [
  'AI Engineer', 'ML Enthusiast', 'Problem Solver',
  'NLP Explorer', 'Full Stack Dev', 'Open Source Contributor','cybersecurity hobbyist'
];

const TIMELINE_DATA = [
  {
    y: '2024', h: 'The Spark',
    p: 'Discovered Python through an online course. Built a calculator and felt the magic of making machines compute. The obsession was born.'
  },
  {
    y: '2025', h: 'DSA Deep Dive',
    p: 'Spent 150+ hours mastering Data Structures & Algorithms. Reached 200 LeetCode problems. Developed problem-solving intuition that defines my engineering approach.'
  },
  {
    y: '2026', h: 'AI/ML Journey Begins',
    p: 'Enrolled in B.Tech AIML. Built first real ML models — housing price prediction, image classification. Started DeepLearning.AI specialization. Everything clicked.'
  },
  {
    y: '2027', h: 'First Real-World Projects',
    p: 'Shipped the Voice-Activated Print System and AI Chatbot. Elected Class Representative. Led a team of 8 for a major applied ML project.'
  },
  {
    y: '2028', h: 'Open Source & Research',
    p: 'Contributing to open source ML tools. Co-authored research on NLP optimization. AWS certification achieving. Portfolio grew to 18+ projects spanning AI, web, and automation.'
  }
];

/* ════════════════════════════════════
   LOADING SCREEN
════════════════════════════════════ */
window.addEventListener('load', () => {
  const fill = document.getElementById('lf');
  fill.style.width = '100%';
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 2400);
});

/* ════════════════════════════════════
   CURSOR
════════════════════════════════════ */
const cursorCore = document.getElementById('cursor-core');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorCore.style.left = mx + 'px';
  cursorCore.style.top  = my + 'px';
});

(function lerpRing() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(lerpRing);
})();

document.querySelectorAll('a, button, .pc-card, .ach-item, .soc-links a, .ctrl-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorCore.classList.add('big');
    cursorRing.classList.add('big');
  });
  el.addEventListener('mouseleave', () => {
    cursorCore.classList.remove('big');
    cursorRing.classList.remove('big');
  });
});

/* ════════════════════════════════════
   SCROLL PROGRESS + REVEAL
════════════════════════════════════ */
const spb = document.getElementById('spb');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  spb.style.width = pct + '%';
});

const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* Timeline items */
const tlIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); });
}, { threshold: 0.15 });

/* Counter animation */
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-t]').forEach(el => {
      const target = +el.dataset.t;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + (target >= 50 ? '+' : '');
        if (cur >= target) clearInterval(iv);
      }, 30);
    });
    counterIO.unobserve(e.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.hero-stats, .about-stats').forEach(el => counterIO.observe(el));

/* ════════════════════════════════════
   TIMELINE RENDER
════════════════════════════════════ */
const tlWrap = document.getElementById('tl');
TIMELINE_DATA.forEach((t, i) => {
  const div = document.createElement('div');
  div.className = 'tl-item';
  div.style.cssText = `transition-delay:${i * 0.1}s`;
  div.innerHTML = `
    <div class="tl-dot"></div>
    <div class="tl-year">${t.y}</div>
    <div class="tl-h">${t.h}</div>
    <div class="tl-p">${t.p}</div>`;
  tlWrap.appendChild(div);
  tlIO.observe(div);
});

/* ════════════════════════════════════
   TYPING ANIMATION
════════════════════════════════════ */
let ri = 0, ci = 0, typing = true, waiting = false;
const typedEl = document.getElementById('typed-text');

function tick() {
  if (waiting) { waiting = false; setTimeout(tick, 1800); return; }
  if (typing) {
    if (ci < ROLES[ri].length) {
      typedEl.textContent = ROLES[ri].slice(0, ++ci);
      setTimeout(tick, 70 + Math.random() * 40);
    } else {
      typing = false; waiting = true; setTimeout(tick, 100);
    }
  } else {
    if (ci > 0) {
      typedEl.textContent = ROLES[ri].slice(0, --ci);
      setTimeout(tick, 35);
    } else {
      ri = (ri + 1) % ROLES.length; typing = true; setTimeout(tick, 260);
    }
  }
}
tick();

/* ════════════════════════════════════
   THEME SWITCHING
════════════════════════════════════ */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  document.querySelectorAll('.ctrl-btn[id^="t-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('t-' + t).classList.add('active');
}

/* ════════════════════════════════════
   AMBIENT MUSIC ENGINE (Web Audio API)
════════════════════════════════════ */
let audioCtx = null, masterGain = null, musicNodes = [], musicPlaying = false;

function toggleMusic() {
  const btn = document.getElementById('music-btn');
  if (!musicPlaying) {
    startMusic();
    btn.classList.add('playing');
    btn.innerHTML = '<span class="ctrl-tooltip">Music On</span>▶';
  } else {
    stopMusic();
    btn.classList.remove('playing');
    btn.innerHTML = '<span class="ctrl-tooltip">Music</span>♫';
  }
  musicPlaying = !musicPlaying;
}

function startMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 2.5);

  /* Reverb */
  const convolver = audioCtx.createConvolver();
  const bufLen = audioCtx.sampleRate * 2.8;
  const revBuf = audioCtx.createBuffer(2, bufLen, audioCtx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = revBuf.getChannelData(c);
    for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2.2);
  }
  convolver.buffer = revBuf;
  const revGain = audioCtx.createGain();
  revGain.gain.value = 0.35;
  convolver.connect(revGain);
  revGain.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  /* Drone layer */
  [55, 82.4, 110, 165].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfog = audioCtx.createGain();
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    lfo.frequency.value = 0.12 + i * 0.04;
    lfog.gain.value = 0.8;
    lfo.connect(lfog); lfog.connect(osc.frequency);
    lfo.start();
    g.gain.value = 0.06 / (i + 1);
    osc.connect(g); g.connect(masterGain); g.connect(convolver);
    osc.start();
    musicNodes.push(osc, lfo);
  });

  /* Pad layer */
  [220, 261.6, 329.6, 392, 523.2].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq + (Math.random() - 0.5) * 0.5;
    g.gain.value = 0;
    osc.connect(g); g.connect(masterGain); g.connect(convolver);
    osc.start();
    musicNodes.push(osc);
    const swellPeriod = 9000 + i * 1800;
    const doSwell = () => {
      if (!musicPlaying && !audioCtx) return;
      const maxG = 0.028 / (i * 0.5 + 1);
      const t = audioCtx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(maxG, t + swellPeriod / 2000);
      g.gain.linearRampToValueAtTime(0, t + swellPeriod / 1000);
      setTimeout(doSwell, swellPeriod);
    };
    setTimeout(doSwell, i * 800);
  });

  /* Sparkle layer */
  const sparkle = () => {
    if (!audioCtx) return;
    const sparkNotes = [1046.5, 1318.5, 1567.9, 2093, 2637];
    const freq = sparkNotes[Math.floor(Math.random() * sparkNotes.length)];
    const osc = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = audioCtx.currentTime;
    g.gain.setValueAtTime(0.028, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
    osc.connect(g); g.connect(masterGain); g.connect(convolver);
    osc.start(t); osc.stop(t + 2.2);
    setTimeout(sparkle, 2800 + Math.random() * 5500);
  };
  setTimeout(sparkle, 3500);
}

function stopMusic() {
  if (!audioCtx) return;
  masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.8);
  setTimeout(() => {
    musicNodes.forEach(n => { try { n.stop(); } catch (e) {} });
    musicNodes = [];
    audioCtx.close();
    audioCtx = null; masterGain = null;
  }, 2000);
}

/* ════════════════════════════════════
   STAR CANVAS — Twinkling starfield
════════════════════════════════════ */
(function starField() {
  const canvas = document.getElementById('star-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.4 + 0.15,
      opacity: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.4 + 0.05,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      isSparkle: Math.random() < 0.15,
    });
  }

  let pmx = 0, pmy = 0;
  document.addEventListener('mousemove', e => {
    pmx = (e.clientX / innerWidth  - 0.5) * 2;
    pmy = (e.clientY / innerHeight - 0.5) * 2;
  });

  function drawSparkle(ctx, x, y, r, opacity) {
    const s = r * 3.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = opacity;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
    const col = getComputedStyle(document.documentElement).getPropertyValue('--star').trim() || '#E8D8B8';
    grad.addColorStop(0, col);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle  = (i * Math.PI) / 2;
      const outerR = s;
      const innerR = s * 0.18;
      ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
      ctx.lineTo(Math.cos(angle + Math.PI / 4) * innerR, Math.sin(angle + Math.PI / 4) * innerR);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    stars.forEach(s => {
      const tw = Math.sin(s.twinklePhase + frame * s.twinkleSpeed);
      const op = s.opacity * (0.55 + 0.45 * tw);
      const px = (s.x + pmx * 18 * s.speed) % W;
      const py = (s.y + pmy * 12 * s.speed) % H;
      if (s.isSparkle && tw > 0.4) {
        drawSparkle(ctx, px, py, s.r, op * 0.9);
      } else {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r * 2.5);
        grad.addColorStop(0, `rgba(232,216,184,${op})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════
   BUBBLE CANVAS — Floating iridescent bubbles
════════════════════════════════════ */
(function bubbleSystem() {
  const canvas = document.getElementById('bubble-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  canvas.style.pointerEvents = 'all';

  const bubbles = [];
  for (let i = 0; i < 16; i++) bubbles.push(createBubble());

  function createBubble() {
    const r = 18 + Math.random() * 70;
    return {
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.35 - 0.1,
      opacity: 0.12 + Math.random() * 0.22,
      shimmer: Math.random() * Math.PI * 2,
      shimmerSpeed: 0.012 + Math.random() * 0.016,
      swing: 0, swingV: 0,
    };
  }

  function handleInteraction(cx, cy) {
    bubbles.forEach(b => {
      const dx   = b.x - cx, dy = b.y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < b.r + 60) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - dist / (b.r + 80)) * 8;
        b.swingV += Math.cos(angle) * force;
        b.vy    -= Math.abs(Math.sin(angle)) * force * 0.4;
      }
    });
  }

  canvas.addEventListener('mousemove', e => handleInteraction(e.clientX, e.clientY));
  canvas.addEventListener('touchmove', e => {
    const t = e.touches[0]; handleInteraction(t.clientX, t.clientY);
  }, { passive: true });
  canvas.addEventListener('touchstart', e => {
    const t = e.touches[0]; handleInteraction(t.clientX, t.clientY);
  }, { passive: true });

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    bubbles.forEach((b, i) => {
      b.swingV *= 0.88; b.swing += b.swingV; b.swing *= 0.92;
      b.x += b.vx + Math.sin(frame * 0.008 + i) * 0.25;
      b.y += b.vy + Math.cos(frame * 0.010 + i * 0.7) * 0.18;

      if (b.x < -b.r * 2) b.x = W + b.r;
      if (b.x > W + b.r * 2) b.x = -b.r;
      if (b.y < -b.r * 2) b.y = H + b.r;
      if (b.y > H + b.r * 2) b.y = -b.r;

      b.shimmer += b.shimmerSpeed;

      ctx.save();
      ctx.translate(b.x + b.swing, b.y);
      ctx.rotate(b.swing * 0.04);

      /* Bubble gradient — theme-aware */
      const grd = ctx.createRadialGradient(-b.r * 0.35, -b.r * 0.32, 0, 0, 0, b.r);
      const shimVal    = (Math.sin(b.shimmer) + 1) / 2;
      const theme      = document.documentElement.dataset.theme;
      const baseAlpha  = b.opacity * (0.7 + 0.3 * shimVal);

      if (theme === 'pro') {
        /* Cherry reddish-pink bubbles */
        grd.addColorStop(0, `rgba(232, 80, 110, ${baseAlpha * 0.55})`);
        grd.addColorStop(0.5, `rgba(180, 40, 70,  ${baseAlpha * 0.14})`);
        grd.addColorStop(1,   `rgba(100, 15, 35,  ${baseAlpha * 0.06})`);
      } else if (theme === 'light') {
        grd.addColorStop(0, `rgba(200,170,120,${baseAlpha * 0.45})`);
        grd.addColorStop(0.5, `rgba(160,130,90, ${baseAlpha * 0.10})`);
        grd.addColorStop(1,   `rgba(120,100,60, ${baseAlpha * 0.04})`);
      } else {
        grd.addColorStop(0, `rgba(232,216,184,${baseAlpha * 0.45})`);
        grd.addColorStop(0.5, `rgba(184,168,136,${baseAlpha * 0.10})`);
        grd.addColorStop(1,   `rgba(122,106,80, ${baseAlpha * 0.04})`);
      }

      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.strokeStyle = `rgba(232,216,184,${b.opacity * 0.25 + shimVal * 0.1})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      /* Inner highlight */
      const hGrd = ctx.createRadialGradient(
        -b.r * 0.32, -b.r * 0.3, 0,
        -b.r * 0.32, -b.r * 0.3, b.r * 0.45
      );
      hGrd.addColorStop(0, `rgba(255,252,240,${b.opacity * 0.55 + shimVal * 0.22})`);
      hGrd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(-b.r * 0.32, -b.r * 0.3, b.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = hGrd;
      ctx.fill();

      /* Bottom reflection */
      const rGrd = ctx.createRadialGradient(b.r * 0.2, b.r * 0.3, 0, b.r * 0.2, b.r * 0.3, b.r * 0.28);
      rGrd.addColorStop(0, `rgba(255,250,235,${b.opacity * 0.18})`);
      rGrd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(b.r * 0.2, b.r * 0.3, b.r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = rGrd;
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════
   CURSOR TRAIL CANVAS
════════════════════════════════════ */
(function trailSystem() {
  const canvas = document.getElementById('trail-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const trail = [];
  const MAX   = 28;

  document.addEventListener('mousemove', e => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > MAX) trail.shift();
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    trail.forEach((p, i) => {
      p.life -= 0.04;
      if (p.life <= 0) return;
      const r     = 3 * p.life * (i / trail.length);
      const alpha = p.life * 0.35 * (i / trail.length);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
      g.addColorStop(0, `rgba(232,216,184,${alpha})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════
   FORM SUBMIT
════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Sent! ✓';
  btn.style.background  = 'transparent';
  btn.style.color       = 'var(--accent)';
  btn.style.border      = '1px solid var(--accent)';
  btn.disabled = true;
}
