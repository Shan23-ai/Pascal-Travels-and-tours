/* =========================================================
   GOV-JOBS ABROAD — Frontend Logic
   Countdown timer, slots counter, jobs render, forms, whatsapp
   ========================================================= */
(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const COMPANY_EMAIL = 'Pascaltravelsdoc@gmail.com';
  const WHATSAPP_NUMBER = '971568242388';

  /* =====================================================
   * JOBS DATA (limited-time offers tied to countdown)
   * ===================================================== */
  const JOBS = [
    {
      title: 'Software Engineer',
      flag: '🇨🇦',
      country: 'Canada',
      type: 'Full-time',
      salary: 'CAD 80K–120K/yr',
      offer: 'Work permit sponsorship',
      desc: 'Join leading Canadian tech firms. 3+ years experience required.',
      benefits: ['Work permit available', 'Verified employer', 'Relocation support']
    },
    {
      title: 'Registered Nurse',
      flag: '🇬🇧',
      country: 'United Kingdom',
      type: 'Full-time',
      salary: '£28K–38K/yr',
      offer: 'Relocation assistance',
      desc: 'NHS & private hospitals. Registered nurses with NMC eligibility.',
      benefits: ['Relocation assistance', 'NMC registration', 'Verified employer']
    },
    {
      title: 'Construction Worker',
      flag: '🇦🇺',
      country: 'Australia',
      type: 'Full-time',
      salary: 'AUD 55K–75K/yr',
      offer: 'Employer sponsorship',
      desc: 'Skilled construction roles with major Australian developers.',
      benefits: ['Employer sponsorship', '2+ yrs experience', 'Verified employer']
    },
    {
      title: 'Teacher',
      flag: '🇦🇪',
      country: 'UAE',
      type: 'Full-time',
      salary: 'AED 12K–20K/mo',
      offer: 'Tax-free + housing',
      desc: 'Teaching roles in international schools across Dubai & Abu Dhabi.',
      benefits: ['Tax-free salary', 'Housing allowance', 'Verified employer']
    },
    {
      title: 'Mechanical Engineer',
      flag: '🇩🇪',
      country: 'Germany',
      type: 'Full-time',
      salary: '€45K–70K/yr',
      offer: 'EU Blue Card',
      desc: 'Automotive & manufacturing roles. EU Blue Card sponsorship available.',
      benefits: ['EU Blue Card', 'IHK recognition', 'Verified employer']
    },
    {
      title: 'Healthcare Assistant',
      flag: '🇸🇦',
      country: 'Saudi Arabia',
      type: 'Full-time',
      salary: 'SAR 2K–3.5K/mo',
      offer: 'Free accommodation',
      desc: 'Hospital & clinic roles. Free accommodation, transport, medical cover.',
      benefits: ['Free accommodation', 'Transport provided', 'Verified employer']
    }
  ];

  function renderJobs() {
    const grid = $('#jobs-grid');
    if (!grid) return;
    grid.innerHTML = JOBS.map((j, i) => `
      <div class="job-card">
        <div class="job-card-top">
          <span class="job-flag">${j.flag}</span>
          <div>
            <h3 class="job-title">${j.title}</h3>
            <div class="job-meta">
              <span>${j.country}</span>
              <span>${j.type}</span>
              <span>${j.salary}</span>
            </div>
          </div>
        </div>
        <div class="job-offer-tag">🔥 ${j.offer}</div>
        <p class="job-desc">${j.desc}</p>
        <ul class="job-benefits">${j.benefits.map(b => `<li>✅ ${b}</li>`).join('')}</ul>
        <a href="#apply" class="btn btn-gold btn-sm">Apply Now — Free</a>
      </div>
    `).join('');
  }

  /* =====================================================
   * COUNTDOWN — offer ending in 3 months from today
   * ===================================================== */
  function initCountdown() {
    // 3 months from today's dynamic date
    const end = new Date();
    end.setMonth(end.getMonth() + 3);
    end.setHours(23, 59, 59, 999);

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      const now = new Date();
      let diff = end - now;
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('cd-days', pad(days));
      set('cd-hours', pad(hours));
      set('cd-mins', pad(mins));
      set('cd-secs', pad(secs));
    }
    tick();
    setInterval(tick, 1000);
  }

  /* =====================================================
   * SLOTS REMAINING — dynamically decreasing counter
   * ===================================================== */
  function initSlots() {
    const el = $('#slots-count');
    if (!el) return;
    let slots = 47; // starting value
    const MIN = 12;
    el.textContent = slots;
    // Decrease randomly every few minutes
    setInterval(() => {
      if (slots <= MIN) return;
      // 70% chance to decrease by 1-3
      if (Math.random() < 0.7) {
        slots = Math.max(MIN, slots - (1 + Math.floor(Math.random() * 3)));
        el.textContent = slots;
      }
    }, 120000); // every 2 minutes
  }

  /* =====================================================
   * FORMS — send to company email (mailto) + show confirmation
   * ===================================================== */
  function buildMailto(recipient, subject, body) {
    return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function initJobForm() {
    const form = $('#job-apply-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const body = [
        '🏢 NEW JOB APPLICATION',
        '----------------------',
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Destination/Job: ${data.destination || 'Not specified'}`,
        `DOB: ${data.dob || 'Not specified'}`,
        `Has Passport: ${data.hasPassport === 'yes' ? 'Yes' : (data.hasPassport === 'no' ? 'No — needs one' : 'Not specified')}`,
        `Documents: ${Array.from(fd.getAll('documents')).map(f => f.name).join(', ') || 'None'}`
      ].join('\n');
      const subject = 'New Job Application — Gov Jobs Abroad';
      const link = buildMailto(COMPANY_EMAIL, subject, body);
      // Open mail client with prefilled details
      window.location.href = link;
      // Show confirmation
      const ok = $('#job-apply-ok');
      if (ok) ok.style.display = 'block';
      form.reset();
      // If no passport, prompt to passport section
      if (data.hasPassport === 'no') {
        setTimeout(() => {
          document.getElementById('passport')?.scrollIntoView({ behavior: 'smooth' });
        }, 1200);
      }
    });
  }

  function initPassportForm() {
    const form = $('#passport-form-id');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const body = [
        '🛂 PASSPORT APPLICATION',
        '----------------------',
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `National ID: ${data.idnumber || 'Not specified'}`,
        `Documents: ${Array.from(fd.getAll('documents')).map(f => f.name).join(', ') || 'None'}`
      ].join('\n');
      window.location.href = buildMailto(COMPANY_EMAIL, 'Passport Application — Fast Track', body);
      const ok = $('#passport-ok');
      if (ok) ok.style.display = 'block';
      form.reset();
    });
  }

  function initAgentForm() {
    const form = $('#agent-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const body = [
        '🤝 AGENT PARTNERSHIP REQUEST',
        '----------------------',
        `Name: ${data.name}`,
        `Location: ${data.location}`,
        `Contact: ${data.contact}`
      ].join('\n');
      window.location.href = buildMailto(COMPANY_EMAIL, 'Agent Partnership Request', body);
      const ok = $('#agent-ok');
      if (ok) ok.style.display = 'block';
      form.reset();
    });
  }

  /* =====================================================
   * NAV TOGGLE + SMOOTH SCROLL + BACK TO TOP
   * ===================================================== */
  function initNav() {
    const toggle = $('#nav-toggle');
    const nav = $('#site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('open');
      });
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('open'));
      });
    }
    // Smooth scroll for all in-page links
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* =====================================================
   * WHATSAPP LINK (pre-filled message)
   * ===================================================== */
  function initWhatsApp() {
    const wa = $('#wa-float');
    if (wa) {
      const msg = 'Hello! I would like to chat about working abroad.';
      wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }
  }

  /* =====================================================
   * INIT
   * ===================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    renderJobs();
    initCountdown();
    initSlots();
    initJobForm();
    initPassportForm();
    initAgentForm();
    initNav();
    initBackToTop();
    initWhatsApp();
    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
