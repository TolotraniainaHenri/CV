/* =========================================================
   PORTFOLIO — Tolotraniaina Henri
   ========================================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Thème clair / sombre ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  const savedTheme = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    themeBtn.textContent = mode === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('theme', mode); } catch {}
  }
  themeBtn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- 2. Menu mobile ---------- */
  const menu = document.getElementById('nav-menu');
  const burger = document.getElementById('nav-toggle');

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.textContent = open ? '✕' : '☰';
  });
  menu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.textContent = '☰';
    })
  );

  /* ---------- 3. Header, bouton retour haut ---------- */
  const header = document.getElementById('header');
  const toTop = document.getElementById('to-top');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    toTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 4. Lien actif selon la section visible ---------- */
  const links = document.querySelectorAll('.nav__link');
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href')));

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && spy.observe(s));

  /* ---------- 5. Effet machine à écrire ---------- */
  const roles = ['Développeur Web', 'Passionné de DevOps', 'Étudiant en Innovation & Technologie', 'Curieux de Data & IA'];
  const typingEl = document.getElementById('typing');
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word = roles[roleIdx];
    typingEl.textContent = word.substring(0, charIdx);

    if (!deleting && charIdx < word.length) { charIdx++; setTimeout(type, 80); }
    else if (!deleting) { deleting = true; setTimeout(type, 1500); }
    else if (charIdx > 0) { charIdx--; setTimeout(type, 40); }
    else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 400); }
  }
  type();

  /* ---------- 6. Animations au scroll (reveal + barres + compteurs) ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      const fill = el.querySelector('.bar__fill');
      if (fill) fill.style.width = fill.dataset.level + '%';

      el.querySelectorAll('[data-count]').forEach(animateCounter);
      obs.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  function animateCounter(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '+';
    const duration = 1400;
    const start = performance.now();

    (function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target) + (progress === 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- 7. Filtre des projets ---------- */
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project');

  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projects.forEach(p => p.classList.toggle('hide', cat !== 'all' && p.dataset.category !== cat));
  }));

  /* ---------- 8. Formulaire de contact (validation) ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const RECEIVER = 'henritolotraniaina@gmail.com';

  const rules = {
    name:    v => v.trim().length >= 2 || 'Veuillez entrer votre nom.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Adresse email invalide.',
    message: v => v.trim().length >= 10 || 'Message trop court (10 caractères minimum).'
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach(name => {
      const input = form.elements[name];
      const field = input.closest('.field');
      const result = rules[name](input.value);
      field.classList.toggle('invalid', result !== true);
      field.querySelector('.error').textContent = result === true ? '' : result;
      if (result !== true) valid = false;
    });
    if (!valid) return;

    // Étape 1 : ouvre le client mail. Étape suivante : brancher Formspree / EmailJS / un backend.
    const { name, email, message } = form.elements;
    const subject = encodeURIComponent('Contact portfolio — ' + name.value.trim());
    const body = encodeURIComponent(message.value.trim() + '\n\n— ' + name.value.trim() + ' (' + email.value.trim() + ')');
    window.location.href = `mailto:${RECEIVER}?subject=${subject}&body=${body}`;

    status.textContent = '✅ Merci ! Votre application de messagerie va s\'ouvrir.';
    status.classList.add('ok');
    form.reset();
  });

  /* ---------- 9. Année du footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
