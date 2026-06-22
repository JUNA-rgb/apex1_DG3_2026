/* ============================================
   APEX SIM-RACING Academy — Main JS
   ============================================ */

'use strict';

/* ── Utilities ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================
   SVG ICONS (inline, no external deps)
   ============================================ */
const Icons = {
  email: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`,
  eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};


/* ============================================
   LOGO SVG
   ============================================ */
const logoSVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
  </defs>
  <!-- Outer hex -->
  <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke="url(#logoGrad)" stroke-width="1.5"/>
  <!-- Inner A shape -->
  <path d="M12 30 L20 10 L28 30" fill="none" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linejoin="round"/>
  <line x1="14.5" y1="23" x2="25.5" y2="23" stroke="url(#logoGrad)" stroke-width="2"/>
  <!-- Speed tick -->
  <line x1="8" y1="20" x2="14" y2="20" stroke="#dc2626" stroke-width="1.5" opacity="0.7"/>
  <line x1="26" y1="20" x2="32" y2="20" stroke="#dc2626" stroke-width="1.5" opacity="0.7"/>
</svg>`;


/* ============================================
   DOM BUILDER
   ============================================ */

function buildBackgroundScene() {
  const scene = document.createElement('div');
  scene.className = 'bg-scene';
  scene.innerHTML = `
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>
    <div class="bg-glow bg-glow-3"></div>
    <div class="bg-grid"></div>
    <div class="bg-lines">
      <div class="speed-line"></div>
      <div class="speed-line"></div>
      <div class="speed-line"></div>
      <div class="speed-line"></div>
      <div class="speed-line"></div>
      <div class="speed-line"></div>
    </div>
  `;
  document.body.prepend(scene);
}

function buildNavbar(activePage = '') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <a href="index.html" class="logo">
      <div class="logo-icon">${logoSVG}</div>
      <div class="logo-text">
        <span class="logo-apex">APEX</span>
        <span class="logo-sub">Sim-Racing Academy</span>
      </div>
    </a>
    <ul class="nav-links">
      <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Inicio</a></li>
      <li><a href="login.html" class="${activePage === 'login' ? 'active' : ''}">Login</a></li>
      <li><a href="register.html" class="nav-cta ${activePage === 'register' ? 'active' : ''}">Registrarse</a></li>
    </ul>
  `;
  return nav;
}

function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <span class="footer-logo">APEX</span>
    <span class="footer-copy">© 2025 APEX SIM-RACING Academy. Todos los derechos reservados.</span>
    <ul class="footer-links">
      <li><a href="#">Términos</a></li>
      <li><a href="#">Privacidad</a></li>
      <li><a href="#">Contacto</a></li>
    </ul>
  `;
  return footer;
}


/* ============================================
   FORM HELPERS
   ============================================ */

function showAlert(container, type, message) {
  const existing = $('.alert', container);
  if (existing) existing.remove();

  const icons = { error: Icons.alertCircle, success: Icons.checkCircle };
  const div = document.createElement('div');
  div.className = `alert alert-${type}`;
  div.innerHTML = `<span class="alert-icon">${icons[type]}</span><span>${message}</span>`;
  container.prepend(div);
}

function clearErrors(form) {
  $$('.form-group.has-error', form).forEach(g => g.classList.remove('has-error'));
  $$('.alert', form).forEach(a => a.remove());
}

function setError(input, message) {
  const group = input.closest('.form-group');
  if (!group) return;
  group.classList.add('has-error');
  const err = $('.field-error', group);
  if (err) err.textContent = message;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setButtonLoading(btn, loading) {
  btn.classList.toggle('loading', loading);
  btn.disabled = loading;
}

/* Simulate async API call */
function fakeRequest(ms = 1800) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Password strength */
function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

function updateStrengthBar(bar, fill, label, pw) {
  const score = getPasswordStrength(pw);
  const pct = pw.length === 0 ? 0 : Math.max(10, (score / 5) * 100);
  const colors = ['#dc2626','#dc2626','#f97316','#eab308','#22c55e','#22c55e'];
  const labels = ['','Muy débil','Débil','Regular','Fuerte','Muy fuerte'];
  fill.style.width = pct + '%';
  fill.style.background = colors[score] || '#dc2626';
  label.textContent = pw.length ? labels[score] || '' : '';
  label.style.color = colors[score] || 'var(--color-gray-500)';
}

/* Toggle password visibility */
function setupPasswordToggle(wrapper) {
  const input  = $('input[type="password"], input[type="text"]', wrapper);
  const toggle = $('.input-toggle', wrapper);
  if (!input || !toggle) return;
  toggle.innerHTML = Icons.eyeOff;
  toggle.addEventListener('click', () => {
    const isPass = input.type === 'password';
    input.type  = isPass ? 'text' : 'password';
    toggle.innerHTML = isPass ? Icons.eye : Icons.eyeOff;
  });
}

/* Inject icons into icon wrappers */
function injectIcons(form) {
  $$('[data-icon]', form).forEach(el => {
    el.innerHTML = Icons[el.dataset.icon] || '';
  });
}


/* ============================================
   PAGE: LOGIN
   ============================================ */

function initLoginPage() {
  const wrapper = $('.page-wrapper');
  wrapper.prepend(buildNavbar('login'));
  wrapper.append(buildFooter());

  const form = $('#loginForm');
  if (!form) return;

  injectIcons(form);
  setupPasswordToggle($('.input-wrapper.pw-wrap', form));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const emailEl = $('#loginEmail', form);
    const passEl  = $('#loginPassword', form);
    let valid = true;

    if (!validateEmail(emailEl.value)) {
      setError(emailEl, 'Ingresá un email válido.');
      valid = false;
    }
    if (passEl.value.length < 6) {
      setError(passEl, 'La contraseña debe tener al menos 6 caracteres.');
      valid = false;
    }
    if (!valid) return;

    const btn = $('[type="submit"]', form);
    setButtonLoading(btn, true);
    await fakeRequest();
    setButtonLoading(btn, false);

    // Simulate wrong credentials demo
    if (emailEl.value !== 'demo@apex.com') {
      showAlert(form, 'error', 'Credenciales inválidas. Probá con demo@apex.com');
    } else {
      showAlert(form, 'success', '¡Bienvenido de vuelta, piloto! Redirigiendo...');
    }
  });
}


/* ============================================
   PAGE: REGISTER
   ============================================ */

function initRegisterPage() {
  const wrapper = $('.page-wrapper');
  wrapper.prepend(buildNavbar('register'));
  wrapper.append(buildFooter());

  const form = $('#registerForm');
  if (!form) return;

  injectIcons(form);
  $$('.input-wrapper.pw-wrap', form).forEach(setupPasswordToggle);

  /* Strength meter */
  const passInput = $('#regPassword', form);
  const fill      = $('.strength-fill', form);
  const label     = $('.strength-label', form);
  if (passInput && fill && label) {
    passInput.addEventListener('input', () =>
      updateStrengthBar(null, fill, label, passInput.value)
    );
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const nameEl    = $('#regName', form);
    const emailEl   = $('#regEmail', form);
    const passEl    = $('#regPassword', form);
    const pass2El   = $('#regPassword2', form);
    const termsEl   = $('#regTerms', form);
    let valid = true;

    if (nameEl.value.trim().length < 2) {
      setError(nameEl, 'Ingresá tu nombre completo.'); valid = false;
    }
    if (!validateEmail(emailEl.value)) {
      setError(emailEl, 'Ingresá un email válido.'); valid = false;
    }
    if (getPasswordStrength(passEl.value) < 2) {
      setError(passEl, 'La contraseña es muy débil.'); valid = false;
    }
    if (passEl.value !== pass2El.value) {
      setError(pass2El, 'Las contraseñas no coinciden.'); valid = false;
    }
    if (!termsEl.checked) {
      showAlert(form, 'error', 'Debés aceptar los términos y condiciones.');
      valid = false;
    }
    if (!valid) return;

    const btn = $('[type="submit"]', form);
    setButtonLoading(btn, true);
    await fakeRequest(2000);
    setButtonLoading(btn, false);

    showAlert(form, 'success', '¡Cuenta creada! Revisá tu email para verificar tu cuenta.');
    form.reset();
    if (fill) fill.style.width = '0';
    if (label) label.textContent = '';
  });
}


/* ============================================
   PAGE: FORGOT PASSWORD
   ============================================ */

function initForgotPage() {
  const wrapper = $('.page-wrapper');
  wrapper.prepend(buildNavbar());
  wrapper.append(buildFooter());

  const form = $('#forgotForm');
  if (!form) return;

  injectIcons(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form);

    const emailEl = $('#forgotEmail', form);
    if (!validateEmail(emailEl.value)) {
      setError(emailEl, 'Ingresá un email válido.');
      return;
    }

    const btn = $('[type="submit"]', form);
    setButtonLoading(btn, true);
    await fakeRequest(1600);
    setButtonLoading(btn, false);

    // Show success state
    form.innerHTML = `
      <div class="alert alert-success">
        <span class="alert-icon">${Icons.checkCircle}</span>
        <span>
          Si existe una cuenta con <strong>${emailEl.value}</strong>, recibirás un email con instrucciones para restablecer tu contraseña.
        </span>
      </div>
      <a href="login.html" class="btn btn-secondary" style="margin-top:8px">
        ${Icons.arrowLeft} <span>Volver al Login</span>
      </a>
    `;
  });
}


/* ============================================
   PAGE: INDEX (Home placeholder)
   ============================================ */

function initHomePage() {
  const wrapper = $('.page-wrapper');
  wrapper.prepend(buildNavbar('home'));
  wrapper.append(buildFooter());
}


/* ============================================
   ROUTER
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  buildBackgroundScene();

  const page = document.body.dataset.page;
  switch (page) {
    case 'login':    initLoginPage();    break;
    case 'register': initRegisterPage(); break;
    case 'forgot':   initForgotPage();   break;
    default:         initHomePage();     break;
  }
});
