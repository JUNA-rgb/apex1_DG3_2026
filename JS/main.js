/* ============================================================
   APEX SIM-RACING — main.js
   Sections: Navbar | Hero Telemetry Canvas | Countdown |
             Prize Pool | Telemetry Slider | Leaderboard |
             Pricing Hover | Signup Toast | Accordion |
             Scroll Reveal | Plan Tabs
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. NAVBAR — scroll style + mobile burger
  ────────────────────────────────────────────────────────── */
  const navbar  = document.getElementById('navbar');
  const burger  = document.querySelector('.nav-burger');
  const navMenu = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  burger?.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });


  /* ──────────────────────────────────────────────────────────
     2. TELEMETRY CANVAS BACKGROUND (Hero)
     Animated racing lines + G-force arc + particles
  ────────────────────────────────────────────────────────── */
  const canvas = document.getElementById('telemetry-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], lines = [], frame = 0;

    function resizeCanvas() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Telemetry lines (horizontal scan-type data strips)
    function createLines() {
      lines = [];
      for (let i = 0; i < 6; i++) {
        lines.push({
          y:      Math.random() * H,
          speed:  0.4 + Math.random() * 0.8,
          points: generateTelemetryPoints(),
          offset: Math.random() * 800,
          alpha:  0.3 + Math.random() * 0.4,
          color:  Math.random() > 0.5 ? '#66FCF1' : '#E63946'
        });
      }
    }

    function generateTelemetryPoints() {
      const pts = [0];
      for (let i = 1; i < 120; i++) {
        pts.push(pts[i - 1] + (Math.random() - 0.5) * 18);
      }
      return pts;
    }

    // Floating particles
    function createParticles() {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.5 + Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.1 - Math.random() * 0.3,
          alpha: 0.2 + Math.random() * 0.5,
          color: Math.random() > 0.6 ? '#66FCF1' : '#E63946'
        });
      }
    }
    createLines();
    createParticles();

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Grid overlay
      ctx.strokeStyle = 'rgba(102,252,241,0.04)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Telemetry lines
      lines.forEach(l => {
        l.offset += l.speed;
        if (l.offset > 800) {
          l.points = generateTelemetryPoints();
          l.offset = 0;
        }
        ctx.beginPath();
        ctx.strokeStyle = l.color;
        ctx.globalAlpha = l.alpha * (0.6 + 0.4 * Math.sin(frame * 0.02));
        ctx.lineWidth = 1.5;
        const startX = -l.offset % 800;
        l.points.forEach((p, i) => {
          const x = startX + i * 10;
          const y = l.y + p;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0)  p.y = H;
        if (p.x < 0)  p.x = W;
        if (p.x > W)  p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  }


  /* ──────────────────────────────────────────────────────────
     3. COUNTDOWN TIMER — 72h from page load (simulated)
  ────────────────────────────────────────────────────────── */
  const TARGET_KEY = 'apex_deadline';
  let deadline = localStorage.getItem(TARGET_KEY);
  if (!deadline) {
    deadline = Date.now() + 72 * 60 * 60 * 1000;
    localStorage.setItem(TARGET_KEY, deadline);
  }

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  function padZ(n) { return String(n).padStart(2, '0'); }

  function animateFlip(el, newVal) {
    if (el && el.textContent !== newVal) {
      el.classList.add('flip');
      setTimeout(() => {
        el.textContent = newVal;
        el.classList.remove('flip');
      }, 150);
    }
  }

  function updateCountdown() {
    const diff = Number(deadline) - Date.now();
    if (diff <= 0) {
      [cdDays, cdHours, cdMins, cdSecs].forEach(el => el && (el.textContent = '00'));
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    animateFlip(cdDays,  padZ(d));
    animateFlip(cdHours, padZ(h));
    animateFlip(cdMins,  padZ(m));
    animateFlip(cdSecs,  padZ(s));
  }
  if (cdDays) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }


  /* ──────────────────────────────────────────────────────────
     4. PRIZE POOL COUNTER — animates up to current total
  ────────────────────────────────────────────────────────── */
  const prizeEl = document.getElementById('prize-counter');
  const PRIZE_TARGET = 18400;

  function animateCounter(el, target, duration = 2500) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = '$' + Math.floor(eased * target).toLocaleString('en-US');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Trigger when scrolled into view
  if (prizeEl) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(prizeEl, PRIZE_TARGET);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(prizeEl);
  }

  // Live prize ticker (simulate growth)
  const tickerEl = document.getElementById('prize-ticker');
  if (tickerEl) {
    setInterval(() => {
      tickerEl.textContent = '+$' + (Math.floor(Math.random() * 50) + 20) + ' ACABA DE INGRESAR ▲';
    }, 4800);
  }


  /* ──────────────────────────────────────────────────────────
     5. TELEMETRY SLIDER
  ────────────────────────────────────────────────────────── */
  const slider     = document.getElementById('lap-slider');
  const currentLap = document.getElementById('current-lap');
  const apexLap    = document.getElementById('apex-lap');
  const lapDelta   = document.getElementById('lap-delta');
  const lapPrize   = document.getElementById('lap-prize');

  // Base lap = 1:28.500, slider = 0–5 seconds to improve
  const BASE_LAP_MS = 88500; // 1:28.500 in ms

  function msToLap(ms) {
    const mins  = Math.floor(ms / 60000);
    const secs  = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins}:${String(secs).padStart(2,'0')}.${String(millis).padStart(3,'0')}`;
  }

  function calcPrize(improvementMs) {
    // $0 at 0ms improvement, up to max prize pool at 5s improvement
    const ratio = Math.min(improvementMs / 5000, 1);
    const prize = Math.floor(ratio * PRIZE_TARGET);
    return prize;
  }

  function updateSlider() {
    const improvement = parseInt(slider.value); // 0–5000 ms
    const yourLapMs   = BASE_LAP_MS;
    const apexLapMs   = BASE_LAP_MS - improvement;
    const deltaMs     = improvement;
    const prize       = calcPrize(improvement);

    if (currentLap) currentLap.textContent = msToLap(yourLapMs);
    if (apexLap)    apexLap.textContent    = msToLap(apexLapMs);
    if (lapDelta)   lapDelta.textContent   = '-' + (deltaMs / 1000).toFixed(3) + 's';
    if (lapPrize) {
      lapPrize.textContent = '$' + prize.toLocaleString('en-US');
      lapPrize.style.transform = 'scale(1.06)';
      setTimeout(() => lapPrize.style.transform = '', 200);
    }
  }

  if (slider) {
    slider.addEventListener('input', updateSlider);
    updateSlider();
  }


  /* ──────────────────────────────────────────────────────────
     6. LIVE LEADERBOARD — updates every 3.5s
  ────────────────────────────────────────────────────────── */
  const pilots = [
    { name: 'M. Verstappen',  flag: '🇳🇱', base: 82341 },
    { name: 'C. Leclerc',     flag: '🇲🇨', base: 82487 },
    { name: 'L. Hamilton',    flag: '🇬🇧', base: 82612 },
    { name: 'F. Alonso',      flag: '🇪🇸', base: 82798 },
    { name: 'C. Sainz',       flag: '🇪🇸', base: 82934 },
    { name: 'G. Russell',     flag: '🇬🇧', base: 83122 },
    { name: 'S. Perez',       flag: '🇲🇽', base: 83287 },
    { name: 'L. Norris',      flag: '🇬🇧', base: 83401 },
    { name: 'O. Piastri',     flag: '🇦🇺', base: 83598 },
    { name: 'Y. Tsunoda',     flag: '🇯🇵', base: 83844 },
  ];

  const lbBody = document.getElementById('lb-body');

  function msToLapTime(ms) {
    const m  = Math.floor(ms / 60000);
    const s  = Math.floor((ms % 60000) / 1000);
    const mi = Math.floor((ms % 1000) / 10);
    return `${m}:${String(s).padStart(2,'0')}.${String(mi).padStart(3,'0')}`;
  }

  function jitter(base) {
    return base + Math.floor((Math.random() - 0.5) * 400);
  }

  function renderLeaderboard() {
    if (!lbBody) return;

    const current = pilots.map(p => ({ ...p, lapMs: jitter(p.base) }));
    current.sort((a, b) => a.lapMs - b.lapMs);

    const existing = lbBody.querySelectorAll('.lb-row');
    current.forEach((p, i) => {
      const pos  = i + 1;
      const posClass = pos <= 3 ? `pos-${pos}` : '';
      const lapStr   = msToLapTime(p.lapMs);

      if (existing[i]) {
        const row = existing[i];
        const oldTime = row.querySelector('.lb-time').textContent;
        if (oldTime !== lapStr) {
          row.querySelector('.lb-pos').className  = `lb-pos ${posClass}`;
          row.querySelector('.lb-pos').textContent = pos;
          row.querySelector('.lb-name').textContent = p.name;
          row.querySelector('.lb-time').textContent = lapStr;
          row.querySelector('.lb-flag').textContent = p.flag;
          row.classList.add('updated');
          setTimeout(() => row.classList.remove('updated'), 700);
        }
      } else {
        const row = document.createElement('div');
        row.className = 'lb-row' + (pos === 1 ? ' highlight' : '');
        row.innerHTML = `
          <span class="lb-pos ${posClass}">${pos}</span>
          <span class="lb-name">${p.name}</span>
          <span class="lb-time">${lapStr}</span>
          <span class="lb-flag">${p.flag}</span>
        `;
        lbBody.appendChild(row);
      }
    });
  }

  if (lbBody) {
    renderLeaderboard();
    setInterval(renderLeaderboard, 3500);
  }


  /* ──────────────────────────────────────────────────────────
     7. PRICING — hover dims others, toast signup popup
  ────────────────────────────────────────────────────────── */
  const pricingGrid = document.querySelector('.pricing-grid');
  const priceCards  = document.querySelectorAll('.price-card');
  const toast       = document.getElementById('signup-toast');

  priceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      priceCards.forEach(c => {
        if (c !== card) c.classList.add('dimmed');
      });
    });
    card.addEventListener('mouseleave', () => {
      priceCards.forEach(c => c.classList.remove('dimmed'));
    });
  });

  // Random pilot signup toast
  const toastPilots = [
    'Lucas M. (🇧🇷 Brasil)',
    'Tomás V. (🇦🇷 Argentina)',
    'Pierre D. (🇫🇷 Francia)',
    'Jake R. (🇬🇧 UK)',
    'Hiroshi K. (🇯🇵 Japón)',
    'Carlos B. (🇪🇸 España)',
    'Alex N. (🇩🇪 Alemania)',
    'Marco F. (🇮🇹 Italia)',
  ];
  let toastActive = false;

  function showToast() {
    if (toastActive || !toast) return;
    toastActive = true;
    const pilot = toastPilots[Math.floor(Math.random() * toastPilots.length)];
    const plans  = ['Plan F3', 'Plan F2', 'Plan PRO'];
    const plan   = plans[Math.floor(Math.random() * plans.length)];
    toast.innerHTML = `🏁 <strong>${pilot}</strong> acaba de inscribirse en <strong>${plan}</strong>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toastActive = false;
    }, 4000);
  }

  setInterval(showToast, 7000);
  setTimeout(showToast, 3000);


  /* ──────────────────────────────────────────────────────────
     8. ACCORDION (Hardware + FAQ)
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close all siblings
      btn.closest('.accordion-item').parentElement
        .querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.accordion-body').style.maxHeight = null;
        });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });


  /* ──────────────────────────────────────────────────────────
     9. PLAN TABS
  ────────────────────────────────────────────────────────── */
  const tabs  = document.querySelectorAll('.plan-tab');
  const grids = document.querySelectorAll('.plan-grid');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t  => t.classList.remove('active'));
      grids.forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });


  /* ──────────────────────────────────────────────────────────
     10. SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));


  /* ──────────────────────────────────────────────────────────
     11. SMOOTH SCROLL for all anchor links
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ──────────────────────────────────────────────────────────
     12. NEWSLETTER FORM
  ────────────────────────────────────────────────────────── */
  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm?.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input?.value.trim()) {
      if (toast) {
        toastActive = false;
        toast.innerHTML = `✅ <strong>¡Inscrito!</strong> Recibirás alertas de telemetría en <strong>${input.value}</strong>`;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); toastActive = false; }, 4000);
      }
      input.value = '';
    }
  });

  // Prevent normal submit
  document.querySelectorAll('form').forEach(f => {
    f.addEventListener('submit', e => e.preventDefault());
  });

});
