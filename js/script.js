/* ============================================================
   APEX GYM — MASTER SCRIPT
   Handles: Loader, Cursor, Nav, Scroll Reveals, Tilt Cards,
            Before/After Slider, Countdown, Form Validation,
            Counter Animation, Marquee
============================================================ */

'use strict';

// ── LOADER ──────────────────────────────────────────────────
const loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', () => {
    // Reset scroll to top on every load for transition consistency
    window.scrollTo(0, 0);
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => { loader.style.display = 'none'; }, 800);
    }, 1800);
  });
}

// ── CUSTOM CURSOR ─────────────────────────────────────────
const cursor = document.querySelector('.cursor');
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (cursor && dot && ring) {
  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { mx = -100; my = -100; });

  function animateCursor() {
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    raf = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .card, .trainer-card, .program-card, .tilt-card, .gallery-item, .plan-card, .hud-box, .contact-info-item, .perk, .step').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // HUD Spotlight Interaction (Generic)
  document.querySelectorAll('.hud-box').forEach(box => {
    box.addEventListener('mousemove', e => {
      const rect = box.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      box.style.setProperty('--mouse-x', `${x}%`);
      box.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

// ── NAVIGATION ───────────────────────────────────────────
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (nav) {
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Set active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── SCROLL REVEAL ─────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));
}

// ── COUNTER ANIMATION ────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  const isFloat = target % 1 !== 0;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const value = target * ease;
    el.textContent = isFloat ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseFloat(el.dataset.count));
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));
}

// ── TILT EFFECT ───────────────────────────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${cx * 14}deg) rotateX(${-cy * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── BEFORE / AFTER SLIDER ────────────────────────────────
const baContainer = document.querySelector('.ba-container');
if (baContainer) {
  const baAfter = baContainer.querySelector('.ba-after');
  const baHandle = baContainer.querySelector('.ba-handle');
  let isDragging = false;

  function setPosition(x) {
    const rect = baContainer.getBoundingClientRect();
    let pct = (x - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));

    const baBefore = baContainer.querySelector('.ba-before');
    const baAfter = baContainer.querySelector('.ba-after');
    const baHandle = baContainer.querySelector('.ba-handle');

    if (baBefore) baBefore.style.clipPath = `inset(0 ${(1 - pct) * 100}% 0 0)`;
    if (baAfter) baAfter.style.clipPath = `inset(0 0 0 ${pct * 100}%)`;
    if (baHandle) baHandle.style.left = `${pct * 100}%`;
  }

  baContainer.addEventListener('mousedown', e => { isDragging = true; setPosition(e.clientX); });
  baContainer.addEventListener('touchstart', e => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mousemove', e => { if (isDragging) setPosition(e.clientX); });
  document.addEventListener('touchmove', e => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mouseup', () => isDragging = false);
  document.addEventListener('touchend', () => isDragging = false);
}

// ── COUNTDOWN TIMER ──────────────────────────────────────
const countdownEl = document.querySelector('.countdown');
if (countdownEl) {
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(23, 59, 59, 0);

  const daysEl = countdownEl.querySelector('[data-cd="days"] .cd-num');
  const hrsEl = countdownEl.querySelector('[data-cd="hrs"] .cd-num');
  const minEl = countdownEl.querySelector('[data-cd="min"] .cd-num');
  const secEl = countdownEl.querySelector('[data-cd="sec"] .cd-num');

  function updateCountdown() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hrsEl) hrsEl.textContent = String(h).padStart(2, '0');
    if (minEl) minEl.textContent = String(m).padStart(2, '0');
    if (secEl) secEl.textContent = String(s).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ── FORM VALIDATION ──────────────────────────────────────
function validateField(field) {
  const group = field.closest('.form-group');
  let errEl = group.querySelector('.field-error');

  const clearError = () => {
    field.classList.remove('error');
    if (errEl) errEl.textContent = '';
  };
  const showError = msg => {
    field.classList.add('error');
    if (!errEl) { errEl = document.createElement('p'); errEl.className = 'field-error'; group.appendChild(errEl); }
    errEl.textContent = msg;
  };

  const val = field.value.trim();
  if (field.required && !val) { showError('This field is required.'); return false; }
  if (field.type === 'email' && val) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError('Enter a valid email address.'); return false; }
  }
  if (field.dataset.minlength && val.length < +field.dataset.minlength) {
    showError(`Minimum ${field.dataset.minlength} characters.`); return false;
  }
  clearError(); return true;
}

document.querySelectorAll('.apex-form').forEach(form => {
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input[required], textarea[required], select[required]')];
    const valid = fields.map(f => validateField(f)).every(Boolean);
    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    const successMsg = form.querySelector('.form-success');
    if (btn) {
      btn.classList.add('loading');
      btn.disabled = true;
      btn.textContent = '';
    }
    await new Promise(r => setTimeout(r, 1600));
    if (btn) { btn.classList.remove('loading'); btn.disabled = false; btn.textContent = 'Message Sent!'; }
    form.reset();
    if (successMsg) successMsg.classList.add('visible');
    setTimeout(() => {
      if (btn) btn.textContent = btn.dataset.label || 'Submit';
      if (successMsg) successMsg.classList.remove('visible');
    }, 5000);
  });
});

// ── PLAN TOGGLE (monthly/annual) ─────────────────────────
const planToggle = document.querySelector('.plan-toggle');
if (planToggle) {
  const prices = document.querySelectorAll('.plan-price-val');
  const monthly = planToggle.dataset.monthly?.split(',') || [];
  const annual = planToggle.dataset.annual?.split(',') || [];
  const periodEls = document.querySelectorAll('.plan-period');

  planToggle.addEventListener('change', () => {
    const isAnnual = planToggle.checked;
    prices.forEach((el, i) => {
      el.style.transform = 'translateY(-20px)';
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = isAnnual ? annual[i] : monthly[i];
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 200);
    });
    periodEls.forEach(p => {
      p.textContent = isAnnual ? 'per month, billed annually' : 'per month, billed monthly';
    });
  });
}

// ── LIGHTBOX ─────────────────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
if (galleryItems.length) {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `position:fixed;inset:0;z-index:5000;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.3s;`;
  lb.innerHTML = `<div style="text-align:center;color:#f5f5f0;"><div style="font-size:5rem;margin-bottom:20px"></div><p style="font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:0.1em;color:#b5ff2e" id="lb-label"></p></div><button id="lb-close" style="position:absolute;top:24px;right:32px;font-size:2rem;color:#b5ff2e;background:none;border:none;cursor:pointer;">✕</button>`;
  document.body.appendChild(lb);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lb.querySelector('div > div').textContent = item.dataset.emoji || '🏋️';
      document.getElementById('lb-label').textContent = item.dataset.lightbox;
      lb.style.opacity = '1'; lb.style.pointerEvents = 'auto';
    });
  });
  document.getElementById('lb-close').addEventListener('click', () => {
    lb.style.opacity = '0'; lb.style.pointerEvents = 'none';
  });
  lb.addEventListener('click', e => { if (e.target === lb) { lb.style.opacity = '0'; lb.style.pointerEvents = 'none'; } });
}

// ── MAGNETIC BUTTON ──────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ── PARALLAX HERO ────────────────────────────────────────
const heroSection = document.getElementById('hero');
if (heroSection) {
  const heroNum = heroSection.querySelector('.hero-number');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroNum) heroNum.style.transform = `translateY(calc(-55% + ${scrollY * 0.25}px))`;
  }, { passive: true });
}

// ── PROGRAM ROW HOVER ────────────────────────────────────
document.querySelectorAll('.program-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.zIndex = '2';
  });
  row.addEventListener('mouseleave', () => {
    row.style.zIndex = '';
  });
});

console.log('%c APEX GYM ', 'background: #b5ff2e; color: #080808; font-size: 20px; font-family: monospace; padding: 6px 12px; font-weight: bold;');
