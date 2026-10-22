(function () {
  'use strict';
  const data = window.SITE_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const html = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const safeHref = (value) => /^(https?:\/\/|mailto:|assets\/)/i.test(String(value || '')) ? html(value) : '#';
  const sorted = (list) => [...list].sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')) || a.title.localeCompare(b.title));

  // Shared navigation, theme toggle and reveal animations.
  $$('[data-year]').forEach(el => {el.textContent = new Date().getFullYear()});
  const page = document.body.dataset.page;
  $$(`[data-nav="${page}"]`).forEach(a => {a.classList.add('active');a.setAttribute('aria-current','page')});
  const mobileToggle = $('.mobile-menu-toggle');
  const mobileNav = $('#mobile-navigation');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileToggle.getAttribute('aria-expanded') !== 'true';
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      mobileNav.hidden = !open;
    });
    $$('#mobile-navigation a').forEach(a => a.addEventListener('click', () => {
      mobileNav.hidden = true; mobileToggle.setAttribute('aria-expanded','false'); mobileToggle.setAttribute('aria-label','Open navigation');
    }));
    document.addEventListener('keydown', ev => {
      if (ev.key === 'Escape' && !mobileNav.hidden) {
        mobileNav.hidden = true;
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation');
        mobileToggle.focus();
      }
    });
    // Dismiss the phone/tablet drawer when tapping outside the header.
    document.addEventListener('pointerdown', ev => {
      if (!mobileNav.hidden && !ev.target.closest('.site-header')) {
        mobileNav.hidden = true;
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation');
      }
    });
    // Keep the menu state consistent on device rotation and window resizing.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && !mobileNav.hidden) {
        mobileNav.hidden = true;
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }
  const refreshThemeIcons = () => {
    const dark = document.documentElement.dataset.theme !== 'light';
    $$('.theme-icon').forEach(el => el.textContent = dark ? '☼' : '☾');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0c1423' : '#f8faf8');
  };
  $$('.theme-toggle').forEach(el => el.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {localStorage.setItem('hkm-theme', next)} catch(err) {}
    refreshThemeIcons();
  }));
  refreshThemeIcons();

  // Profile-photo editing is owner-only in the sense that the editor is not
  // shown on the public page by default. This is not an authentication system:
  // updates stay local until the downloaded file is committed to the host.
  // Open about.html?edit=profile to use the editor.
  const photoEditor = $('#photo-editor');
  const isPhotoEdit = new URLSearchParams(location.search).get('edit') === 'profile';
  const photoImages = $$('[data-profile-photo]');
  if (photoEditor && isPhotoEdit) photoEditor.hidden = false;
  const preview = $('#photo-preview');
  const savedPreview = (() => {
    try {return sessionStorage.getItem('hkm-photo-preview')} catch (_) {return null}
  })();
  if (savedPreview) {
    photoImages.forEach(img => {img.src = savedPreview});
    if (preview) preview.src = savedPreview;
  }
  // A 404 on a deleted photo should not leave a broken image.
  photoImages.forEach(img => img.addEventListener('error', () => {
    if (!img.src.endsWith('profile-placeholder.svg')) img.src='assets/img/profile-placeholder.svg';
  }));
  if (preview) preview.addEventListener('error', () => {
    if (!preview.src.endsWith('profile-placeholder.svg')) preview.src='assets/img/profile-placeholder.svg';
  });
  if (photoEditor && isPhotoEdit) {
    const fileInput = $('#photo-file');
    const status = $('#photo-status');
    const download = $('#photo-download');
    let editedBlob = null;
    const setStatus = (msg, isError=false) => {
      status.textContent = msg;
      status.style.color = isError ? '#ee9f9f' : 'var(--accent)';
    };
    fileInput?.addEventListener('change', async () => {
      editedBlob = null;
      download.disabled = true;
      const file = fileInput.files?.[0];
      if (!file) return;
      if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10*1024*1024) {
        setStatus('Please choose a JPG, PNG, or WebP image no larger than 10 MB.',true);
        return;
      }
      let objectURL;
      try {
        objectURL = URL.createObjectURL(file);
        const image = new Image();
        await new Promise((resolve,reject) => {
          image.onload = resolve; image.onerror = reject; image.src = objectURL;
        });
        if (!image.naturalWidth || !image.naturalHeight) throw Error('Invalid image');
        const canvas = document.createElement('canvas');
        canvas.width = 720; canvas.height = 720;
        const context = canvas.getContext('2d');
        if (!context) throw Error('Canvas unavailable');
        const edge = Math.min(image.naturalWidth,image.naturalHeight);
        const x = Math.round((image.naturalWidth-edge)/2);
        const y = Math.round((image.naturalHeight-edge)/2);
        context.drawImage(image,x,y,edge,edge,0,0,720,720);
        editedBlob = await new Promise((resolve,reject) => canvas.toBlob(blob => {
          if (blob?.type === 'image/webp') resolve(blob);
          else reject(Error('This browser cannot save WebP images'));
        },'image/webp',0.88));
        const rendered = canvas.toDataURL('image/webp',0.82);
        photoImages.forEach(img => img.src = rendered);
        if (preview) preview.src = rendered;
        try {sessionStorage.setItem('hkm-photo-preview',rendered)} catch (_) {}
        download.disabled = false;
        setStatus(`Ready! Your new image is ${Math.round(editedBlob.size/1024)} KB. Download it to publish.`);
      } catch (err) {
        editedBlob = null;
        setStatus('Could not process this image. Try another JPG, PNG or WebP file.',true);
      } finally {
        if (objectURL) URL.revokeObjectURL(objectURL);
      }
    });
    download?.addEventListener('click', () => {
      if (!editedBlob) return;
      const objectURL = URL.createObjectURL(editedBlob);
      const anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = 'profile.webp';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setStatus('Downloaded profile.webp. Replace assets/img/profile.webp on GitHub and commit to publish.');
      setTimeout(() => URL.revokeObjectURL(objectURL),3000);
    });
  }

  // Shared research focus cards.
  function focusCard(track) {
    return `<article class="focus-card"><div class="focus-top"><span class="focus-icon" aria-hidden="true">${html(track.icon)}</span></div><h3>${html(track.title)}</h3><p>${html(track.description)}</p><div class="keyword-row">${track.keywords.map(t=>`<span>${html(t)}</span>`).join('')}</div></article>`;
  }
  const homeFocus = $('#home-focus-grid');
  if (homeFocus) homeFocus.innerHTML = data.researchTracks.map(focusCard).join('');
  const researchFocus = $('#research-focus-grid');
  if (researchFocus) researchFocus.innerHTML = data.researchTracks.map(focusCard).join('');

  // Home: current teaching appointments and education highlights.
  const appointments = $('#home-appointments');
  if (appointments) {
    appointments.innerHTML = data.teaching.filter(item=>item.current).map(item=>
      `<article class="appointment-card"><span class="appointment-status"><span class="status-dot"></span> CURRENT APPOINTMENT</span><h3>${html(item.title)}</h3><strong>${html(item.location)}</strong><p>${html(item.department||'')}</p><div class="appointment-date">${html(item.years)}</div></article>`
    ).join('');
  }
  const educationSummary = $('#home-education-summary');
  if (educationSummary) {
    educationSummary.innerHTML = data.education.slice(0,2).map(item=>
      `<div class="credential-row"><span class="credential-year">${html(item.years)}</span><div><strong>${html(item.title)}</strong><span>${html(item.location)}</span></div><small>${html(item.badge||'')}</small></div>`
    ).join('');
  }

  // Home: dynamically displays the first three newest journal records.
  const featured = $('#home-featured-publications');
  if (featured) {
    featured.innerHTML = sorted(data.journals).slice(0,3).map(p=> {
      const url = p.doi ? `https://doi.org/${encodeURIComponent(p.doi)}` : p.url || data.profile.scholar;
      return `<a class="featured-row" href="${safeHref(url)}" target="_blank" rel="noopener noreferrer"><span class="featured-year">${html(p.year)}</span><div><h3>${html(p.title)}</h3><p>${html(p.venue)} · ${html(p.topic)}</p></div><span class="publication-arrow" aria-hidden="true">↗</span></a>`;
    }).join('');
  }

  // Current research public preprint highlights.
  const highlights = $('#research-highlights');
  if (highlights) {
    highlights.innerHTML = data.researchHighlights.map(item => `<div class="highlight-panel"><div><div class="section-kicker">${html(item.label)}</div><h3>${html(item.title)}</h3><p>${html(item.description)}</p></div><a class="button button-outline" href="${safeHref(item.url)}" target="_blank" rel="noopener noreferrer">${html(item.action || 'Read more')} ↗</a></div>`).join('');
  }

  // Under-review list: clearly separate demonstration placeholders from genuine submissions.
  const reviews = $('#under-review-list');
  if (reviews) {
    const entries = sorted(data.underReview);
    const demoNotice = $('#review-demo-notice');
    if (demoNotice) demoNotice.hidden = !entries.some(item => item.isDemo);
    reviews.innerHTML = entries.length ? entries.map((item, index) => `<article class="review-entry${item.isDemo ? ' review-demo' : ''}"><div class="review-content"><div class="review-overline">${item.isDemo ? `EXAMPLE ${String(index + 1).padStart(2,'0')} · PLACEHOLDER` : 'MANUSCRIPT'}</div><h3>${html(item.title)}</h3><p>${html([item.venue, item.topic, item.notes].filter(Boolean).join(' · '))}</p></div><span class="status-chip${item.isDemo ? ' demo-chip' : ''}">${html(item.isDemo ? 'Sample · Not submitted' : (item.status || 'Under review'))}</span></article>`).join('') : `<div class="review-placeholder"><div class="review-placeholder-icon" aria-hidden="true">◇</div><div><h3>Manuscript updates coming soon.</h3><p>No under-review manuscripts have been added to this website yet. Once titles and statuses are approved for public display, they can appear here with dates, areas, and submission status.</p><p class="collection-note">To update, add an entry to <code>underReview</code> in <code>assets/js/data.js</code>.</p></div></div>`;
  }

  // Searchable publication lists: all sorting is latest-first, regardless of data entry order.
  function renderCollection(kind) {
    const list = $(`#${kind}-list`);
    if (!list) return;
    const items = sorted(kind==='journal' ? data.journals : data.conferences);
    const search = $(`#${kind}-search`);
    const select = $(`#${kind}-year`);
    const total = $(`#${kind}-total`);
    const years = [...new Set(items.map(item=>item.year))].sort((a,b)=>b-a);
    if (select) select.innerHTML = '<option value="all">All years</option>' + years.map(year=>`<option value="${html(year)}">${html(year)}</option>`).join('');
    function render() {
      const q = String(search?.value||'').toLocaleLowerCase().trim();
      const year = select?.value || 'all';
      const filtered = items.filter(p => (year==='all'||String(p.year)===year) && [p.title,p.venue,p.topic,p.year,p.doi||'',p.publisher||'',p.publicationType||'',p.pages||'',...(Array.isArray(p.authors)?p.authors:[])].join(' ').toLocaleLowerCase().includes(q));
      if (total) total.textContent = `${filtered.length} ${kind === 'journal' ? 'journal article' : 'conference paper'}${filtered.length===1?'':'s'}`;
      list.innerHTML = filtered.length ? filtered.map(p=> {
        const link = p.url || (p.doi ? `https://doi.org/${encodeURIComponent(p.doi)}` : data.profile.dblp);
        const linkLabel = p.doi ? 'DOI / Paper' : 'Paper';
        const dateDisplay = /^\d{4}-\d{2}-\d{2}$/.test(p.date||'') ? new Date(p.date+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}) : /^\d{4}-\d{2}$/.test(p.date||'') ? new Date(p.date+'-01T12:00:00Z').toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'}) : (p.date || String(p.year));
        const exactDate = p.date && /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? new Date(p.date+'T12:00:00') : null;
        const isNew = !!(exactDate && (Date.now()-exactDate.getTime())<1000*60*60*24*120 && (Date.now()-exactDate.getTime())>=0);
        return `<article class="publication-row"><span class="publication-date">${html(p.year)}</span><div class="publication-main"><h3>${html(p.title)}</h3>${Array.isArray(p.authors)&&p.authors.length?`<p class="publication-authors">${html(p.authors.join(', '))}</p>`:''}<div class="publication-meta"><span>${html(p.venue)}</span><span class="pub-tag">${html(p.topic || 'Research')}</span>${isNew?'<span class="new-chip">RECENT</span>':''}</div><div class="publication-citation">${[dateDisplay,p.volume?`Vol. ${p.volume}`:'',p.issue?`No. ${p.issue}`:'',p.pages?`pp. ${p.pages}`:'',p.publicationType||'',p.publisher||''].filter(Boolean).map(html).join(' · ')}</div></div><div class="publication-actions"><a href="${safeHref(link)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${html(p.title)}">${linkLabel} ↗</a></div></article>`;
      }).join('') : `<div class="empty-results">No matching papers. Try a different search term or year.</div>`;
    }
    search?.addEventListener('input',render);
    select?.addEventListener('change',render);
    render();
  }
  renderCollection('journal');
  renderCollection('conference');

  // About page academic timeline and awards.
  const interestCloud = $('#interest-cloud');
  if (interestCloud) interestCloud.innerHTML = data.interests.map(item=>`<span>${html(item)}</span>`).join('');
  function renderTimeline(selector, items) {
    const root = $(selector);
    if (!root) return;
    root.innerHTML = items.map(item=>`<article class="timeline-item"><span class="timeline-year">${html(item.years)}</span><div><h3>${html(item.title)}${item.current?' <span class="timeline-current">Current</span>':''}</h3><div class="timeline-place">${html(item.location)}</div>${item.department?`<div class="timeline-department">${html(item.department)}</div>`:''}${item.badge?`<span class="timeline-badge">${html(item.badge)}</span>`:''}<p>${html(item.detail)}</p></div></article>`).join('');
  }
  renderTimeline('#education-timeline',data.education);
  renderTimeline('#experience-timeline',data.experience);
  renderTimeline('#teaching-timeline',data.teaching);
  renderTimeline('#service-timeline',data.service);
  const awardRoot = $('#award-grid');
  if (awardRoot) awardRoot.innerHTML = data.awards.map(item=>`<article class="award-card"><div class="award-icon" aria-hidden="true">✳</div><h3>${html(item.title)}</h3><div class="award-meta">${html([item.location,item.years].filter(Boolean).join(' · '))}</div><p>${html(item.detail)}</p></article>`).join('');

  // Contact cards.
  const socialRoot = $('#social-cards');
  if (socialRoot) {
    const profiles = [
      ['Google Scholar','Research publications','GS',data.profile.scholar],
      ['ScholarGPS',`ScholarGPS® ID: ${data.profile.scholargpsId || '60176498191431'}`,'SG',data.profile.scholargps],
      ['ORCID','Researcher identifier','iD',data.profile.orcid],
      ['DBLP','Computer science bibliography','DB',data.profile.dblp],
      ['GitHub','Code & projects','GH',data.profile.github],
      ['LinkedIn','Professional network','in',data.profile.linkedin],
      ['ResearchGate','Research community','RG',data.profile.researchgate]
    ];
    socialRoot.innerHTML = profiles.filter(p=>p[3]).map(p=>`<a class="social-card" href="${safeHref(p[3])}" target="_blank" rel="noopener noreferrer"><span class="social-symbol">${html(p[2])}</span><div><strong>${html(p[0])}</strong><small>${html(p[1])}</small></div><span class="social-arrow" aria-hidden="true">↗</span></a>`).join('');
  }
  const emailLink = $('#contact-email');
  if (emailLink) {emailLink.textContent=data.profile.email;emailLink.href=`mailto:${data.profile.email}`;}
  const ctaEmail = $('#email-cta');
  if (ctaEmail) ctaEmail.href=`mailto:${data.profile.email}?subject=${encodeURIComponent('Research collaboration inquiry')}`;
  const copyEmail = $('.copy-email');
  if (copyEmail) copyEmail.addEventListener('click',async()=> {
    const label=copyEmail.querySelector('span');
    try {
      await navigator.clipboard.writeText(data.profile.email);
      if (label) label.textContent='Copied!';
    } catch(err) {
      // Clipboard API may be unavailable on file:// or insecure HTTP.
      if (label) label.textContent='Select email';
      emailLink?.focus();
    }
  });

  // Reveals animate only where supported, and remain visible without JS / observer.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}});
    },{rootMargin:'0px 0px -35px 0px',threshold:0.03});
    $$('.reveal').forEach(el=>observer.observe(el));
    document.documentElement.classList.add('js-ready');
  }
})();
