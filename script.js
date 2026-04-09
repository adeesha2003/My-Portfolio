/* ══ CURSOR GLOW ═══════════════════════════════════════════ */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ══ NAVBAR ═════════════════════════════════════════════════ */
const nav     = document.getElementById('nav');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 50);
  if (backTop) backTop.classList.toggle('show', y > 400);
  highlightNav();
});

/* ══ MOBILE NAV ══════════════════════════════════════════════ */
document.getElementById('navBurger').addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('open');
});
document.querySelectorAll('.nl').forEach(l =>
  l.addEventListener('click', () => document.getElementById('navMenu').classList.remove('open'))
);

/* ══ ACTIVE NAV ON SCROLL ════════════════════════════════════ */
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 140;
  sections.forEach(sec => {
    const link = document.querySelector(`.nl[href="#${sec.id}"]`);
    if (!link) return;
    const inView = scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', inView);
  });
}

/* ══ TYPED TEXT ══════════════════════════════════════════════ */
const phrases = [
  'IT Undergraduate',
  'Web Developer',
  'Full-Stack Developer',
  'Software Developer',
  'AI Enthusiast',
  'MERN Stack Developer',
];
let pi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed');
function type() {
  if (!typedEl) return;
  const p = phrases[pi];
  typedEl.textContent = del ? p.slice(0, --ci) : p.slice(0, ++ci);
  if (!del && ci === p.length) { del = true; setTimeout(type, 1800); return; }
  if (del && ci === 0)         { del = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, del ? 50 : 90);
}
type();

/* ══ REVEAL ON SCROLL ════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => revealObs.observe(r));

/* ══ SKILL BARS ══════════════════════════════════════════════ */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bf').forEach(b => {
        b.style.width = b.dataset.w + '%';
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.sk-card').forEach(g => barObs.observe(g));


/* ══ BACK TO TOP ═════════════════════════════════════════════ */
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══ CONTACT FORM ════════════════════════════════════════════ */
function handleContact(e) {
  e.preventDefault();
  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value.trim() || 'Portfolio Contact';
  const message = document.getElementById('cf-message')?.value.trim();
  const status  = document.getElementById('cf-status');
  const btn     = e.target.querySelector('.cf-btn');

  if (!name || !email || !message) {
    if (status) { status.textContent = '⚠ Please fill in all required fields.'; status.className = 'cf-note error'; }
    return;
  }

  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening mail…'; }

  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  window.location.href = `mailto:adeeshadilmira2@gmail.com?subject=${encodeURIComponent(subject + ' – from ' + name)}&body=${encodeURIComponent(body)}`;

  if (status) { status.textContent = '✓ Your mail client is opening…'; status.className = 'cf-note success'; }
  e.target.reset();

  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
  setTimeout(() => { if (status) { status.textContent = ''; status.className = 'cf-note'; } }, 5000);
}

/* ══ MODAL SYSTEM ════════════════════════════════════════════ */
let modalData = null;

function getModalData() {
  if (modalData) return modalData;
  const el = document.getElementById('modalData');
  if (!el) return {};
  try { modalData = JSON.parse(el.textContent); } catch(e) { modalData = {}; }
  return modalData;
}

function openModal(id) {
  const data = getModalData();
  const item = data[id];
  if (!item) return;

  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  if (!overlay || !content) return;

  content.innerHTML = item.type === 'project'
    ? buildProjectModal(item)
    : buildCertModal(item);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* Close on backdrop click */
document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

/* Close on Escape key */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── Project Modal Builder ─────────────────────────────────── */
function buildProjectModal(d) {
  /* GitHub & external links */
  const githubLink = d.github
    ? `<a href="${d.github}" target="_blank" class="m-link-github"><i class="fab fa-github"></i> View on GitHub</a>`
    : '';
  const extraLinks = d.links && d.links.length
    ? d.links.map(l =>
        `<a href="${l.url}" target="_blank"><i class="${l.icon || 'fas fa-external-link-alt'}"></i> ${l.label}</a>`
      ).join('')
    : '';
  const linksHtml = (githubLink || extraLinks)
    ? `<div class="m-links">${githubLink}${extraLinks}</div>`
    : '';

  const featuresHtml = d.features && d.features.length
    ? `<p class="m-section"><i class="fas fa-list-check"></i> Key Features</p>
       <ul class="m-feats">${d.features.map(f => `<li>${f}</li>`).join('')}</ul>`
    : '';

  const stackHtml = d.stack && d.stack.length
    ? `<p class="m-section"><i class="fas fa-layer-group"></i> Tech Stack</p>
       <div class="m-stack">${d.stack.map(s => `<span>${s}</span>`).join('')}</div>`
    : '';

  const toolsHtml = d.tools && d.tools.length
    ? `<div class="m-tools"><i class="fas fa-wrench"></i> ${d.tools.join(' &nbsp;·&nbsp; ')}</div>`
    : '';

  /* Image gallery */
  const imagesHtml = d.images && d.images.length
    ? `<div class="m-gallery">${d.images.map(src =>
        `<img src="${src}" alt="${d.title}" loading="lazy"/>`).join('')}</div>`
    : (d.image
        ? `<img src="${d.image}" alt="${d.title}" class="m-img-single"/>`
        : '');

  return `
    ${d.period ? `<span class="m-period">${d.period}</span>` : ''}
    <h2>${d.title}${d.role ? `<span class="m-role">${d.role}</span>` : ''}</h2>
    ${d.subtitle ? `<div class="m-org"><i class="fas fa-building"></i> ${d.subtitle}</div>` : ''}
    ${imagesHtml}
    ${d.description ? `<p class="m-desc">${d.description}</p>` : ''}
    ${featuresHtml}
    ${stackHtml}
    ${toolsHtml}
    ${linksHtml}`;
}

/* ── Certificate Modal Builder ────────────────────────────── */
function buildCertModal(d) {
  const linksHtml = d.links && d.links.length
    ? `<div class="m-links">${d.links.map(l =>
        `<a href="${l.url}" target="_blank">
           <i class="${l.icon || 'fas fa-certificate'}"></i> ${l.label}
         </a>`).join('')}</div>`
    : '';

  const categoryHtml = d.category
    ? `<div class="m-cert-cat"><i class="fas fa-tag"></i> ${d.category}</div>`
    : '';

  const skillsHtml = d.skills && d.skills.length
    ? `<p class="m-section"><i class="fas fa-star"></i> Skills Covered</p>
       <div class="m-stack">${d.skills.map(s => `<span>${s}</span>`).join('')}</div>`
    : '';

  return `
    ${d.date ? `<span class="m-period">${d.date}</span>` : ''}
    <h2>${d.title}</h2>
    ${d.org ? `<div class="m-org"><i class="fas fa-building"></i> ${d.org}</div>` : ''}
    ${categoryHtml}
    ${d.credentialId ? `<div class="m-credid"><i class="fas fa-id-card"></i> Credential ID: ${d.credentialId}</div>` : ''}
    ${d.description ? `<p class="m-desc">${d.description}</p>` : ''}
    ${skillsHtml}
    ${linksHtml}`;
}
