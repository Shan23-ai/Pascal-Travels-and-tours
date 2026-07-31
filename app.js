(function () {
  'use strict';

  const PKG = window.PACKAGES_DATA;
  const REQ = window.REQUIREMENTS_DATA;

  const appState = {
    currentView: 'home',
    previousView: 'home',
    selectedPackage: null,
    stepperStep: 1,
    personalInfo: {},
    uploadedDocs: {},
    totalProcessing: 0,
    totalTicket: 0
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const DEFAULT_CURRENCY = 'USD';
  const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', KES: 'KES ' };
  function money(n, currency = DEFAULT_CURRENCY) {
    const sym = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.USD;
    return `${sym}${Number(n || 0).toLocaleString('en-US')}`;
  }
  const currencyOf = p => (p && p.processingCurrency) ? p.processingCurrency : DEFAULT_CURRENCY;
  const flagUrl = (prompt, size = 'square_hd') =>
    `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

  function flattenAllPackages() {
    return [
      ...(PKG.travelVisas || []),
      ...(PKG.workVisas || []),
      ...(PKG.studyVisas || []),
      ...(PKG.canadaPR || []),
      ...(PKG.eastAfricaTours || [])
    ];
  }

  function findPackage(id) {
    return flattenAllPackages().find(p => p.id === id);
  }

  function getPackageMeta(p) {
    if (!p) return {};
    const processing = typeof p.priceProcessing === 'number' ? p.priceProcessing : (p.pricePerPerson || 0);
    const ticket = typeof p.priceTicket === 'number' ? p.priceTicket : (p.pricePerPerson ? 0 : 0);
    const flag = p.flag || '🌍';
    const title = p.country || p.destination || p.stream || 'Package';
    const subtitle = p.city || p.country || p.destination || '';
    const est = p.estimatedDays || (p.days ? `${p.days} days` : 'Varies');
    const currency = currencyOf(p);
    return { processing, ticket, flag, title, subtitle, est, currency };
  }

  function setView(name, scrollTop = true) {
    appState.previousView = appState.currentView;
    appState.currentView = name;
    $$('.view').forEach(v => v.classList.remove('view-active'));
    const target = document.getElementById(`view-${name}`);
    if (target) target.classList.add('view-active');
    if (scrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#nav-links').classList.remove('open');
  }

  function renderServices() {
    const grid = $('#services-grid');
    if (!grid) return;
    grid.innerHTML = PKG.services.map(s => `
      <div class="card card-white">
        <div class="service-icon">${s.icon}</div>
        <h3>${s.name}</h3>
        <p style="margin-top:.2rem;">${s.tagline}</p>
        <p style="font-size:.9rem;">${s.description}</p>
        <div class="service-features">
          ${s.features.map(f => `<div>✔ ${f}</div>`).join('')}
        </div>
        <button class="btn btn-gold btn-sm" data-service="${s.id}">Explore ${s.shortName}</button>
      </div>
    `).join('');
  }

  function renderVisaCard(p) {
    const meta = getPackageMeta(p);
    const cur = meta.currency;
    const tags = p.popularTags || p.visaTypes || p.industries || p.degreeLevels || p.popularPNPs || [];
    const estText = meta.est;
    const priceShow = p.pricePerPerson ? money(p.pricePerPerson, cur) + ' / pp' : money(meta.processing + meta.ticket, cur);
    const fromLabel = p.pricePerPerson ? 'From' : 'Total from';
    return `
      <div class="visa-card" data-package="${p.id}">
        <div class="visa-card-header">
          <span class="visa-flag">${meta.flag}</span>
          <span class="visa-est">⏱ ${estText}</span>
        </div>
        <h3 class="visa-country">${meta.title}</h3>
        <div class="visa-city">${meta.subtitle}</div>
        <p class="visa-desc">${p.description || ''}</p>
        ${tags.length ? `<div class="visa-tags">${tags.slice(0, 3).map(t => `<span>${t}</span>`).join('')}</div>` : ''}
        <div class="visa-footer">
          <div>
            <div class="visa-price-from">${fromLabel}</div>
            <div class="visa-price">${priceShow}</div>
          </div>
          <button class="btn btn-gold btn-sm" data-select="${p.id}">Details →</button>
        </div>
      </div>
    `;
  }

  function renderTourCard(p) {
    const meta = getPackageMeta(p);
    const cur = meta.currency;
    const img = p.packageImage ? flagUrl(p.packageImage, 'landscape_4_3') : '';
    return `
      <div class="tour-card" data-package="${p.id}">
        <div class="tour-img">
          ${img ? `<img src="${img}" alt="${p.destination}" onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,var(--skyblue),var(--golden))'">` : ''}
        </div>
        <div class="tour-body">
          <div class="tour-head">
            <h3 style="margin:0;">${meta.flag} ${p.destination}</h3>
            <span class="tour-days">${p.days} Days</span>
          </div>
          <p style="font-size:.88rem;margin:0;">${p.description}</p>
          <div class="tour-includes">
            ${(p.inclusions || []).slice(0, 4).map(i => `<span>✔ ${i.split(' ')[0]} ${i.split(' ').slice(1,3).join(' ')}</span>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;">
            <div class="tour-price">${money(p.pricePerPerson, cur)}<span style="font-size:.75rem;color:var(--text-muted);font-weight:600;"> / person</span></div>
          </div>
          <button class="btn btn-gold btn-sm" data-select="${p.id}">Select Package →</button>
        </div>
      </div>
    `;
  }

  function renderVisaPackages(tab = 'travel') {
    const host = $('#visa-packages');
    if (!host) return;
    let list = [];
    if (tab === 'travel') list = PKG.travelVisas || [];
    if (tab === 'work') list = PKG.workVisas || [];
    if (tab === 'study') list = PKG.studyVisas || [];
    host.innerHTML = list.map(renderVisaCard).join('');
  }

  function renderTours() {
    const host = $('#tours-grid');
    if (!host) return;
    host.innerHTML = (PKG.eastAfricaTours || []).map(renderTourCard).join('');
  }

  function renderCanadaVisual() {
    const img = $('#pr-flag');
    if (!img) return;
    img.src = flagUrl('Photorealistic Canada maple leaf flag with Ottawa parliament buildings and snowy mountains background, golden hour lighting, high quality', 'landscape_4_3');
    img.onerror = () => { img.style.background = 'linear-gradient(135deg,#FF0000 0 33%,#FFFFFF 33% 66%,#FF0000 66% 100%)'; img.removeAttribute('src'); };
  }

  function selectPackage(id) {
    const p = findPackage(id);
    if (!p) return;
    appState.selectedPackage = p;
    appState.stepperStep = 1;
    appState.uploadedDocs = {};
    appState.personalInfo = {};
    const meta = getPackageMeta(p);
    appState.totalProcessing = meta.processing;
    appState.totalTicket = meta.ticket;

    renderPackageDetail(p);
    setView('package');
  }

  function renderPackageDetail(p) {
    const meta = getPackageMeta(p);
    const hero = $('#package-hero');
    hero.innerHTML = `
      <div class="ph-flag">${meta.flag}</div>
      <div style="flex:1;min-width:220px;">
        <h2>${meta.title}${meta.subtitle ? ' · ' + meta.subtitle : ''}</h2>
        <p style="color:rgba(255,255,255,0.9);margin:0;">${p.description || ''}</p>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.6rem;">
          <span class="badge badge-white-gold">⏱ ${meta.est}</span>
          <span class="badge badge-white-gold">📋 ${(p.requirements || []).length} documents</span>
          ${p.stream ? `<span class="badge badge-white-gold">🍁 ${p.stream}</span>` : ''}
          ${p.days ? `<span class="badge badge-white-gold">🗓 ${p.days} days</span>` : ''}
        </div>
      </div>
    `;

    const info = $('#package-info');
    const extraDetails = p => {
      const parts = [];
      if (p.visaTypes) parts.push({ k: 'Visa Types', v: p.visaTypes.join(' · ') });
      if (p.industries) parts.push({ k: 'Industries Hiring', v: p.industries.join(', ') });
      if (p.salaryRange) parts.push({ k: 'Salary Range', v: p.salaryRange });
      if (p.degreeLevels) parts.push({ k: 'Degree Levels', v: p.degreeLevels.join(' · ') });
      if (p.avgTuition) parts.push({ k: 'Avg Tuition (Year)', v: p.avgTuition });
      if (p.inclusions) parts.push({ k: 'Package Includes', v: '' });
      if (p.minCRS) parts.push({ k: 'Min CRS Score (typical)', v: p.minCRS });
      if (p.settlementFunds) parts.push({ k: 'Settlement Funds Required', v: p.settlementFunds });
      if (p.highlights) parts.push({ k: 'Tour Highlights', v: p.highlights.join(' · ') });
      if (p.popularPNPs) parts.push({ k: 'Popular PNPs', v: p.popularPNPs.join(' · ') });
      return parts;
    };

    info.innerHTML = `
      <h3 style="margin-bottom:.6rem;">📦 Package Details</h3>
      <div style="display:grid;gap:.55rem;">
        ${extraDetails(p).map(x => `
          <div style="padding:.5rem 0;border-bottom:1px dashed var(--skyblue-soft);font-size:.92rem;">
            <strong style="color:var(--skyblue-navy);">${x.k}:</strong>
            ${x.v ? `<span style="color:var(--text-muted);">${x.v}</span>` : ''}
            ${x.k === 'Package Includes' && p.inclusions ? `<ul style="margin:.4rem 0 0;padding-left:1.2rem;color:var(--text-muted);display:grid;gap:.25rem;">${p.inclusions.map(i => `<li style="list-style:disc;">${i}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('')}
      </div>
    `;

    const reqIds = p.requirements || [];
    const reqs = reqIds.map(id => REQ[id]).filter(Boolean);
    $('#req-count').textContent = `${reqs.length} document${reqs.length === 1 ? '' : 's'} required`;
    const check = $('#requirements-checklist');
    check.innerHTML = reqs.map(r => `
      <div class="req-item">
        <div class="req-icon">${r.icon}</div>
        <div>
          <div class="req-title">${r.title}</div>
          <p class="req-desc">${r.description}<br/>
            <em style="font-style:normal;color:var(--golden-deep);font-weight:600;">Format: ${r.formats.join(', ')} · Max ${r.maxSizeMB}MB</em>
          </p>
        </div>
        <div class="req-status">Required</div>
      </div>
    `).join('');

    const isTour = !!p.pricePerPerson && p.category !== 'travel-visa';
    if (isTour) {
      $('#price-processing').textContent = money(p.pricePerPerson, meta.currency);
      $('#price-ticket').textContent = money(0, meta.currency);
      $('#price-total').textContent = money(p.pricePerPerson, meta.currency);
      $('#btn-start-app').textContent = `Book Tour · ${money(p.pricePerPerson, meta.currency)} →`;
      const rowLabel1 = $('#price-row-1-label');
      if (rowLabel1) rowLabel1.textContent = 'Tour Price (per person)';
      const rowLabel2 = $('#price-row-2-label');
      if (rowLabel2) rowLabel2.textContent = 'Extras / Add-ons';
    } else {
      const rowLabel1 = $('#price-row-1-label');
      if (rowLabel1) rowLabel1.textContent = 'Visa Processing Fee';
      const rowLabel2 = $('#price-row-2-label');
      if (rowLabel2) rowLabel2.textContent = 'Round-trip Flight Ticket';
      $('#price-processing').textContent = money(meta.processing, meta.currency);
      $('#price-ticket').textContent = money(meta.ticket, meta.currency);
      $('#price-total').textContent = money(meta.processing + meta.ticket, meta.currency);
      $('#btn-start-app').textContent = `Start Application · ${money(meta.processing + meta.ticket, meta.currency)} →`;
    }
  }

  function startApplication() {
    if (!appState.selectedPackage) return;
    appState.stepperStep = 1;
    appState.uploadedDocs = {};
    resetStepperUI();
    renderPersonalInfo();
    setView('submit');
  }

  function resetStepperUI() {
    $$('.step-panel').forEach(p => p.classList.remove('step-active'));
    $('#step-1')?.classList.add('step-active');
    const stepItems = $$('#stepper .step');
    stepItems.forEach(s => { s.classList.remove('step-active', 'step-done'); });
    if (stepItems[0]) stepItems[0].classList.add('step-active');
  }

  function goToStep(n) {
    appState.stepperStep = n;
    $$('.step-panel').forEach(p => p.classList.remove('step-active'));
    const panel = document.getElementById(`step-${n}`);
    if (panel) panel.classList.add('step-active');
    const steps = $$('#stepper .step');
    steps.forEach((s, idx) => {
      const i = idx + 1;
      s.classList.remove('step-active', 'step-done');
      if (i < n) s.classList.add('step-done');
      if (i === n) s.classList.add('step-active');
    });
    if (n === 2) renderDocUploads();
    if (n === 3) renderReview();
    if (n === 4) renderPaymentSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderPersonalInfo() {
    const form = $('#form-personal');
    if (!form) return;
    Object.entries(appState.personalInfo).forEach(([k, v]) => {
      const el = form.elements[k];
      if (el && v) el.value = v;
    });
  }

  function collectPersonalInfo() {
    const form = $('#form-personal');
    const obj = {};
    let ok = true;
    if (!form) return { ok: false, obj };
    $$('.form-field .text-red-mark', form).forEach(e => e.remove());
    Array.from(form.elements).forEach(el => {
      if (!el.name) return;
      obj[el.name] = el.value.trim();
      if (el.required && !obj[el.name]) {
        el.style.borderColor = 'var(--red)';
        ok = false;
      } else {
        el.style.borderColor = '';
      }
    });
    if (obj.email && !/^[^\s@.][^\s@]*@[^\s@.][^\s@]*\.[^\s@.]{2,}$/.test(obj.email)) {
      ok = false;
      if (form.elements.email) form.elements.email.style.borderColor = 'var(--red)';
    }
    appState.personalInfo = obj;
    return { ok, obj };
  }

  function renderDocUploads() {
    const list = $('#docs-upload-list');
    const p = appState.selectedPackage;
    const reqIds = p.requirements || [];
    const reqs = reqIds.map(id => REQ[id]).filter(Boolean);
    const done = countDoneDocs();
    $('#docs-progress').textContent = `${done}/${reqs.length} uploaded.`;
    list.innerHTML = reqs.map(r => {
      const u = appState.uploadedDocs[r.id];
      const doneClass = u && u.uploaded ? 'done' : '';
      return `
        <div class="doc-item ${doneClass}" data-doc="${r.id}">
          <div class="doc-icon">${r.icon}</div>
          <div>
            <div class="doc-head">
              <div class="doc-title">${r.title}</div>
              <span class="status-chip ${u && u.uploaded ? 'ok' : 'pending'}">${u && u.uploaded ? '✔ Submitted' : 'Pending'}</span>
            </div>
            <p class="doc-hint">${r.description}</p>
            <p class="file-input-hint">Accepts ${r.formats.join(', ')} · up to ${r.maxSizeMB}MB</p>
          </div>
          <div>
            ${u && u.uploaded ? `
              <div class="doc-preview">
                📎 <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${u.fileName}</span>
                <span class="remove-doc" data-remove="${r.id}">✕</span>
              </div>
            ` : `
              <label class="btn-upload">
                ⬆ Upload
                <input type="file" style="display:none" data-upload="${r.id}" accept="${r.formats.map(f => '.' + f.toLowerCase().replace('jpg', 'jpeg')).join(',')}" />
              </label>
            `}
          </div>
        </div>
      `;
    }).join('');

    const total = reqs.length;
    $('#step2-next').disabled = done !== total;
    $('#doc-errors').style.display = 'none';
  }

  function countDoneDocs() {
    return Object.values(appState.uploadedDocs).filter(u => u && u.uploaded).length;
  }

  function validateAllDocsSubmitted() {
    const reqs = (appState.selectedPackage?.requirements || []).map(id => REQ[id]).filter(Boolean);
    const missing = reqs.filter(r => !appState.uploadedDocs[r.id] || !appState.uploadedDocs[r.id].uploaded);
    if (missing.length === 0) return { ok: true, missing };
    const errEl = $('#doc-errors');
    errEl.innerHTML = `⚠ ${missing.length} required document${missing.length === 1 ? '' : 's'} still missing: <strong>${missing.map(m => m.title).join(', ')}</strong>`;
    errEl.style.display = 'block';
    return { ok: false, missing };
  }

  function handleFileUpload(docId, file) {
    const req = REQ[docId];
    if (!req || !file) return;
    const sizeMB = file.size / (1024 * 1024);
    const ext = (file.name.split('.').pop() || '').toUpperCase();
    const extOk = req.formats.some(f => f.toUpperCase() === ext || (f === 'JPG' && ext === 'JPEG'));
    if (!extOk) {
      alert(`Invalid file format. Please upload ${req.formats.join(', ')}`);
      return;
    }
    if (sizeMB > req.maxSizeMB) {
      alert(`File too large (${sizeMB.toFixed(1)}MB). Maximum is ${req.maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      appState.uploadedDocs[docId] = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        dataUrl: e.target.result,
        uploaded: true,
        uploadedAt: Date.now()
      };
      renderDocUploads();
    };
    reader.readAsDataURL(file);
  }

  function removeDoc(docId) {
    delete appState.uploadedDocs[docId];
    renderDocUploads();
  }

  function renderReview() {
    const p = appState.selectedPackage;
    const meta = getPackageMeta(p);
    const pi = appState.personalInfo;
    const reqs = (p.requirements || []).map(id => REQ[id]).filter(Boolean);
    const summary = $('#review-summary');
    summary.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.3rem;">
        <div>
          <h4 style="color:var(--skyblue-navy);margin-bottom:.6rem;">🎫 Package</h4>
          <div style="padding:1rem;background:var(--skyblue-pale);border-radius:12px;">
            <div style="font-size:2rem;margin-bottom:.3rem;">${meta.flag}</div>
            <strong style="font-size:1.05rem;">${meta.title}</strong>
            <div style="font-size:.88rem;color:var(--text-muted);">${meta.subtitle}</div>
            <div style="margin-top:.5rem;font-size:.85rem;color:var(--text-muted);">⏱ ${meta.est}</div>
          </div>
          <h4 style="color:var(--skyblue-navy);margin:1rem 0 .6rem;">👤 Applicant</h4>
          <div style="display:grid;gap:.35rem;font-size:.88rem;">
            <div><strong>Name:</strong> ${pi.fullName || '—'}</div>
            <div><strong>Email:</strong> ${pi.email || '—'}</div>
            <div><strong>Phone:</strong> ${pi.phone || '—'}</div>
            <div><strong>Passport:</strong> ${pi.passport || '—'}</div>
            <div><strong>DOB:</strong> ${pi.dob || '—'}</div>
            <div><strong>Nationality:</strong> ${pi.nationality || '—'}</div>
            <div><strong>Address:</strong> ${pi.address || '—'}</div>
          </div>
        </div>
        <div>
          <h4 style="color:var(--skyblue-navy);margin-bottom:.6rem;">📋 Documents (${countDoneDocs()}/${reqs.length})</h4>
          <div style="display:grid;gap:.45rem;">
            ${reqs.map(r => {
              const u = appState.uploadedDocs[r.id];
              const ok = u && u.uploaded;
              return `<div style="display:flex;justify-content:space-between;padding:.5rem .7rem;background:${ok ? '#F0FFF4' : '#FFF5F5'};border-radius:10px;font-size:.85rem;border:1px solid ${ok ? '#C6F6D5' : '#FED7D7'};">
                <span>${r.icon} ${r.title}</span>
                <strong style="color:${ok ? '#38A169' : 'var(--red)'};">${ok ? '✔ Submitted' : '❌ Missing'}</span>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    const allDone = countDoneDocs() === reqs.length;
    const authConfirm = $('#auth-confirm');
    $('#step3-next').disabled = !(allDone && authConfirm.checked);
    authConfirm.onchange = () => {
      $('#step3-next').disabled = !(allDone && authConfirm.checked);
    };
  }

  function renderPaymentSummary() {
    const p = appState.selectedPackage;
    const processing = appState.totalProcessing;
    const ticket = p.pricePerPerson ? 0 : appState.totalTicket;
    const total = processing + ticket;
    const currency = getPackageMeta(p).currency;
    $('#order-summary-sm').innerHTML = `
      <strong>🛫 ${getPackageMeta(p).title}</strong> — ${getPackageMeta(p).est}<br/>
      <span style="font-size:.82rem;color:var(--text-muted);">Booking for: ${appState.personalInfo.fullName || 'Applicant'}</span>
    `;
    const rows = [
      ['Visa Processing Fee', processing],
      ['Round-trip Flight Ticket', ticket],
    ];
    $('#pay-summary-list').innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><strong>${money(v, currency)}</strong></div>`).join('');
    $('#pay-total').textContent = money(total, currency);
    $('#pay-btn-label').textContent = `Pay ${money(total, currency)}`;
  }

  function submitPayment() {
    const p = appState.selectedPackage;
    const processing = appState.totalProcessing;
    const ticket = p.pricePerPerson ? 0 : appState.totalTicket;
    const total = processing + ticket;
    const currency = getPackageMeta(p).currency;

    const overlay = $('#pay-processing');
    if (overlay) overlay.style.display = 'grid';

    setTimeout(() => {
      const ref = 'TT-' + Math.floor(100000 + Math.random() * 900000);
      const meta = getPackageMeta(p);
      $('#booking-ref').textContent = ref;
      $('#success-summary').innerHTML = `
        <div><span>Package</span><strong>${meta.flag} ${meta.title}</strong></div>
        <div><span>Applicant</span><strong>${appState.personalInfo.fullName || '—'}</strong></div>
        <div><span>Email</span><strong>${appState.personalInfo.email || '—'}</strong></div>
        <div><span>Visa Processing</span><strong>${money(processing, currency)}</strong></div>
        ${ticket > 0 ? `<div><span>Flight Ticket</span><strong>${money(ticket, currency)}</strong></div>` : ''}
        <div><span>Total Paid</span><strong>${money(total, currency)}</strong></div>
      `;
      if (overlay) overlay.style.display = 'none';
      setView('success');
    }, 1700);
  }

  function formatCardNumber(v) {
    return v.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
  }
  function formatExp(v) {
    v = v.replace(/\D/g, '').slice(0, 4);
    if (v.length <= 2) return v;
    return v.slice(0, 2) + ' / ' + v.slice(2);
  }
  function formatCvc(v) { return v.replace(/\D/g, '').slice(0, 4); }

  function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function attachGlobalHandlers() {
    const navToggle = $('#nav-toggle');
    if (navToggle) navToggle.addEventListener('click', () => $('#nav-links')?.classList.toggle('open'));

    document.addEventListener('click', e => {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        e.preventDefault();
        const target = nav.getAttribute('data-nav');
        if (appState.currentView !== 'home') setView('home', true);
        setTimeout(() => {
          const map = {
            home: 'view-home', services: 'services', visas: 'visas',
            work: 'visas', study: 'visas', pr: 'pr', tours: 'tours', contact: 'contact'
          };
          if (target === 'work') {
            switchTab('work');
          } else if (target === 'study') {
            switchTab('study');
          } else if (target === 'visas') {
            switchTab('travel');
          }
          if (map[target]) smoothScrollTo(map[target]);
        }, 50);
        return;
      }

      const select = e.target.closest('[data-select]');
      if (select) { e.preventDefault(); selectPackage(select.getAttribute('data-select')); return; }

      const selectCa = e.target.closest('[data-select-ca]');
      if (selectCa) { e.preventDefault(); selectPackage(selectCa.getAttribute('data-select-ca')); return; }

      const back = e.target.closest('[data-go-back]');
      if (back) { e.preventDefault(); const to = back.getAttribute('data-go-back'); setView(to); return; }

      const serviceBtn = e.target.closest('[data-service]');
      if (serviceBtn) {
        e.preventDefault();
        const sid = serviceBtn.getAttribute('data-service');
        const scrollMap = { jobs: 'services', 'work-visa': 'visas', 'schengen-visa': 'visas', 'study-visa': 'visas', 'canada-pr': 'pr', 'east-africa': 'tours' };
        const tabMap = { 'work-visa': 'work', 'schengen-visa': 'travel', 'study-visa': 'study' };
        if (tabMap[sid]) switchTab(tabMap[sid]);
        smoothScrollTo(scrollMap[sid] || 'services');
        return;
      }

      const prevStep = e.target.closest('[data-prev-step]');
      if (prevStep) {
        e.preventDefault();
        goToStep(parseInt(prevStep.getAttribute('data-prev-step'), 10));
        return;
      }

      const tabBtn = e.target.closest('.tab[data-tab]');
      if (tabBtn) {
        e.preventDefault();
        switchTab(tabBtn.getAttribute('data-tab'));
        return;
      }

      const uploadInput = e.target.closest('[data-upload]');
      if (uploadInput && uploadInput.files && uploadInput.files[0]) {
        handleFileUpload(uploadInput.getAttribute('data-upload'), uploadInput.files[0]);
        return;
      }

      const removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) {
        e.preventDefault();
        e.stopPropagation();
        removeDoc(removeBtn.getAttribute('data-remove'));
        return;
      }
    });

    function switchTab(name) {
      $$('#visa-tabs .tab').forEach(t => t.classList.toggle('tab-active', t.getAttribute('data-tab') === name));
      renderVisaPackages(name);
    }
    window.__switchTab = switchTab;

    const btnStartApp = $('#btn-start-app');
    if (btnStartApp) btnStartApp.addEventListener('click', startApplication);

    const step1Next = $('#step1-next');
    if (step1Next) step1Next.addEventListener('click', () => {
      const { ok } = collectPersonalInfo();
      if (!ok) {
        alert('Please fill all required fields correctly.');
        return;
      }
      goToStep(2);
    });

    const step2Next = $('#step2-next');
    if (step2Next) step2Next.addEventListener('click', () => {
      const v = validateAllDocsSubmitted();
      if (!v.ok) { renderDocUploads(); return; }
      goToStep(3);
    });

    const step3Next = $('#step3-next');
    if (step3Next) step3Next.addEventListener('click', () => goToStep(4));

    const payForm = $('#payment-form');
    if (payForm) {
      payForm.addEventListener('input', e => {
        if (e.target.classList.contains('card-number')) e.target.value = formatCardNumber(e.target.value);
        if (e.target.classList.contains('card-exp')) e.target.value = formatExp(e.target.value);
        if (e.target.classList.contains('card-cvc')) e.target.value = formatCvc(e.target.value);
      });
    }

    $('#btn-pay').addEventListener('click', () => {
      if (!payForm.checkValidity()) {
        payForm.reportValidity();
        return;
      }
      submitPayment();
    });

    const contactForm = $('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const original = btn.textContent;
        btn.textContent = '✓ Message Sent!';
        btn.disabled = true;
        contactForm.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
      });
    }

    const leadForm = $('#lead-form');
    if (leadForm) {
      leadForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = leadForm.querySelector('button');
        const success = $('#lead-form-success');
        const original = btn.textContent;
        btn.textContent = '✓ Request Received';
        btn.disabled = true;
        success.style.display = 'block';
        leadForm.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; success.style.display = 'none'; }, 4000);
      });
    }
  }

  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    });
  }

  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initNewsletter() {
    const form = $('#newsletter-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const success = $('#newsletter-success');
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      success.style.display = 'block';
      form.reset();
      setTimeout(() => { btn.textContent = original; btn.disabled = false; success.style.display = 'none'; }, 4000);
    });
  }

  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.testimonial-card, .faq-item, .newsletter-card, .svc-m-card, .wc-card, .t-card, .mv-card, .visa-card, .tour-card, .pr-banner').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  function init() {
    renderServices();
    renderVisaPackages('travel');
    renderTours();
    renderCanadaVisual();
    attachGlobalHandlers();
    initFAQ();
    initBackToTop();
    initNewsletter();
    initScrollReveal();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
