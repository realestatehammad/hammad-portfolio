/* Hammad Mahmud portfolio: interactions.
   No tracking, no external requests, no data collection. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // Keep a tabbed card at the height of its tallest state, so switching never changes the page length
  var lockHeight = function (el, n, fill) {
    var measure = function () {
      var w = el.getBoundingClientRect().width;
      if (!w) return;
      var c = el.cloneNode(true);
      c.removeAttribute('id'); c.setAttribute('aria-hidden', 'true');
      c.style.cssText += ';position:absolute;visibility:hidden;pointer-events:none;left:-9999px;top:0;min-height:0;height:auto;width:' + w + 'px';
      el.parentNode.appendChild(c);
      var max = 0;
      for (var i = 0; i < n; i++) { fill(c, i); max = Math.max(max, c.getBoundingClientRect().height); }
      c.parentNode.removeChild(c);
      el.style.minHeight = Math.ceil(max) + 'px';
    };
    measure();
    var t;
    addEventListener('resize', function () { clearTimeout(t); t = setTimeout(measure, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    addEventListener('load', measure);
  };

  /* ---------- Footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  }

  /* ---------- Header: scrolled state, full-screen mobile menu, active link ---------- */
  var header = $('#site-header');
  var navToggle = $('.nav-toggle');
  var mmenu = $('#mobile-menu');
  var nav = $('#site-nav');

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      mmenu.hidden = false;
      requestAnimationFrame(function () { mmenu.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      var first = $('a', mmenu); if (first) setTimeout(function () { first.focus(); }, 50);
    } else {
      mmenu.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { if (!mmenu.classList.contains('is-open')) mmenu.hidden = true; }, reduceMotion ? 0 : 300);
    }
  }
  navToggle.addEventListener('click', function () { setMenu(navToggle.getAttribute('aria-expanded') !== 'true'); });
  $$('a', mmenu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') { setMenu(false); navToggle.focus(); }
    if (e.key === 'Tab' && navToggle.getAttribute('aria-expanded') === 'true') {
      var items = $$('a', mmenu).concat([navToggle]);
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 900 && navToggle.getAttribute('aria-expanded') === 'true') setMenu(false); });

  /* ---------- Cinematic hero ---------- */
  var hero = $('.cine');
  if (hero) {
    // Split the name into letters for the rise-in
    $$('[data-split]', hero).forEach(function (row) {
      var n = 0;
      row.innerHTML = row.textContent.split('').map(function (c) { return '<span class="ch" style="--i:' + (n++) + '">' + esc(c) + '</span>'; }).join('');
    });

    // Typing line
    var typedEl = $('#typed');
    var WORDS = ['found.', 'understood.', 'contacted.', 'booked.'];
    if (typedEl && !reduceMotion) {
      var w = 0, c = WORDS[0].length, deleting = true;
      var tick = function () {
        if (deleting) {
          c--; typedEl.textContent = WORDS[w].slice(0, c);
          if (c <= 0) { deleting = false; w = (w + 1) % WORDS.length; }
          return setTimeout(tick, 45);
        }
        c++; typedEl.textContent = WORDS[w].slice(0, c);
        if (c >= WORDS[w].length) { deleting = true; return setTimeout(tick, 2200); }
        setTimeout(tick, 85);
      };
      setTimeout(tick, 2600);
    }

    // Living dot field: a grid of points that ripples slowly and parts around the cursor, then springs back
    var canvas = $('#field');
    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2), dots = [], t = 0, running = false, visible = true;
      var pm = { x: -9999, y: -9999, on: false, s: 0 };
      var GAP = 26, R = 170;
      var size = function () {
        var r = hero.getBoundingClientRect();
        W = r.width; H = r.height;
        GAP = W < 600 ? 22 : 26;
        canvas.width = W * DPR; canvas.height = H * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        dots = [];
        for (var y = GAP / 2; y < H; y += GAP) for (var x = GAP / 2; x < W; x += GAP) dots.push({ ox: x, oy: y, x: x, y: y, vx: 0, vy: 0 });
      };
      var draw = function () {
        ctx.clearRect(0, 0, W, H);
        pm.s += ((pm.on ? 1 : 0) - pm.s) * .08;
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          // slow travelling wave
          var w = Math.sin(d.ox * .012 + t * 1.1) * Math.cos(d.oy * .014 - t * .8);
          var tx = d.ox, ty = d.oy + w * 3;
          var glow = 0;
          if (pm.s > .01) {
            var dx = d.ox - pm.x, dy = d.oy - pm.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < R) {
              var f = (1 - dist / R); f = f * f * pm.s;
              tx += (dx / (dist || 1)) * f * 38; ty += (dy / (dist || 1)) * f * 38;
              glow = f;
            }
          }
          d.vx = (d.vx + (tx - d.x) * .12) * .78; d.vy = (d.vy + (ty - d.y) * .12) * .78;
          d.x += d.vx; d.y += d.vy;
          var lum = .5 + w * .5;
          var rad = .9 + lum * .5 + glow * 2.2;
          if (glow > .02) ctx.fillStyle = 'rgba(214,244,91,' + (.25 + glow * .75).toFixed(3) + ')';
          else ctx.fillStyle = 'rgba(' + (157 + lum * 60 | 0) + ',' + (176 + lum * 50 | 0) + ',255,' + (.14 + lum * .24).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(d.x, d.y, rad, 0, 6.2832); ctx.fill();
        }
        t += .016;
      };
      var loop = function () {
        if (!visible || document.hidden) { running = false; return; }
        draw(); requestAnimationFrame(loop);
      };
      var start = function () { if (!running) { running = true; requestAnimationFrame(loop); } };
      size();
      if (reduceMotion) draw();
      else {
        start();
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(hero);
        }
        document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
        hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); pm.x = e.clientX - r.left; pm.y = e.clientY - r.top; pm.on = true; });
        hero.addEventListener('pointerleave', function () { pm.on = false; });
        hero.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') pm.on = false; });
      }
      var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (Math.abs(hero.getBoundingClientRect().width - W) > 2) { size(); if (reduceMotion) draw(); } }, 200); });
    }

    // Mouse parallax and spotlight (fine pointers only)
    var fine = window.matchMedia('(pointer: fine)').matches;
    if (fine && !reduceMotion) {
      var layers = $$('[data-depth]', hero), raf = null, mx = 0, my = 0;
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
        hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
        if (!raf) raf = requestAnimationFrame(function () {
          raf = null;
          layers.forEach(function (l) { var d = Number(l.getAttribute('data-depth')); l.style.transform = 'translate3d(' + (mx * d) + 'px,' + (my * d) + 'px,0)'; });
        });
      });
      hero.addEventListener('mouseleave', function () { layers.forEach(function (l) { l.style.transform = ''; }); });
      // Magnetic buttons
      $$('.magnetic', hero).forEach(function (b) {
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28) + 'px)';
        });
        b.addEventListener('mouseleave', function () { b.style.transform = ''; });
      });
    }
  }

  var navLinks = $$('a[href^="#"]', nav);
  var sections = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var activeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) {
            var on = a.getAttribute('href') === '#' + en.target.id;
            a.classList.toggle('is-active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { activeObs.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Project filter ---------- */
  var filterBtns = $$('.filters button');
  var cards = $$('.work-card');
  var filterStatus = $('#filter-status');
  var filterNames = { all: 'all', websites: 'website', seo: 'SEO', content: 'content', social: 'social media', ops: 'marketing ops' };
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      cards.forEach(function (c) {
        var match = f === 'all' || (c.getAttribute('data-tags') || '').split(' ').indexOf(f) > -1;
        c.hidden = !match;
        if (match) { shown++; c.classList.add('is-in'); }
      });
      filterStatus.textContent = f === 'all'
        ? 'Showing all ' + shown + ' projects.'
        : 'Showing ' + shown + ' ' + filterNames[f] + ' project' + (shown === 1 ? '' : 's') + '.';
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lb-img'), lbCap = $('#lb-caption'), lbCount = $('#lb-count'), lbStage = $('#lb-stage');
  var lbGroup = [], lbIndex = 0, lbReturn = null;

  function lbShow(i) {
    lbIndex = (i + lbGroup.length) % lbGroup.length;
    var btn = lbGroup[lbIndex];
    var thumb = $('img', btn);
    // Live thumbnails (map plane, export globe) open as a running, larger copy
    var oldLive = $('.live', lbStage); if (oldLive) oldLive.remove();
    var liveSrc = btn.hasAttribute('data-live') && $('.live', btn);
    lbImg.hidden = !!liveSrc;
    if (liveSrc) {
      var copy = liveSrc.cloneNode(true);
      copy.__mounted = false;
      $$('img', copy).forEach(function (im) { im.loading = 'eager'; });
      lbStage.appendChild(copy);
      if (window.LiveThumbs) window.LiveThumbs.mount(copy, true);
    }
    lbImg.src = liveSrc ? 'data:,' : btn.getAttribute('data-src');
    lbImg.alt = thumb ? thumb.alt : '';
    lbCap.textContent = btn.getAttribute('data-caption') || '';
    lbCount.textContent = (lbIndex + 1) + ' / ' + lbGroup.length;
    var tall = thumb && thumb.naturalHeight > thumb.naturalWidth * 1.15 && thumb.naturalWidth > 600;
    lbStage.classList.toggle('is-tall', !!tall);
    lbStage.scrollTop = 0;
    var multi = lbGroup.length > 1;
    $('#lb-prev').hidden = !multi; $('#lb-next').hidden = !multi;
  }
  function lbOpen(btn) {
    var group = btn.getAttribute('data-lightbox');
    lbGroup = $$('[data-lightbox="' + group + '"]');
    lbReturn = btn;
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    lbShow(lbGroup.indexOf(btn));
    $('#lb-close').focus();
  }
  function lbClose() {
    if (typeof lb.close === 'function' && lb.open) lb.close(); else lb.removeAttribute('open');
  }
  lb.addEventListener('close', function () {
    document.body.style.overflow = '';
    lbImg.src = 'data:,';
    var live = $('.live', lbStage); if (live) live.remove();
    if (lbReturn) lbReturn.focus();
  });
  $$('[data-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', function () { lbOpen(btn); });
  });
  $('#lb-close').addEventListener('click', lbClose);
  $('#lb-prev').addEventListener('click', function () { lbShow(lbIndex - 1); });
  $('#lb-next').addEventListener('click', function () { lbShow(lbIndex + 1); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); lbClose(); return; }
    if (e.key === 'ArrowLeft' && lbGroup.length > 1) { e.preventDefault(); lbShow(lbIndex - 1); }
    if (e.key === 'ArrowRight' && lbGroup.length > 1) { e.preventDefault(); lbShow(lbIndex + 1); }
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbStage) lbClose(); });

  /* ---------- Generic roving tabs helper ---------- */
  function rovingTabs(tabs, onSelect, orientation) {
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, true); });
      t.addEventListener('keydown', function (e) {
        var keysNext = orientation === 'vertical' ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight', 'ArrowDown'];
        var keysPrev = orientation === 'vertical' ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft', 'ArrowUp'];
        var n = null;
        if (keysNext.indexOf(e.key) > -1) n = (i + 1) % tabs.length;
        else if (keysPrev.indexOf(e.key) > -1) n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); tabs[n].focus(); }
      });
    });
    function select(i, fromUser) {
      tabs.forEach(function (t, j) {
        t.setAttribute('aria-selected', String(i === j));
        t.tabIndex = i === j ? 0 : -1;
      });
      onSelect(i, fromUser);
    }
    return select;
  }

  /* ---------- Automation workflow explorer ---------- */
  var FLOW = [
    { title: 'Attract a prospective buyer', short: 'Attract',
      purpose: 'Give first-time buyers a reason to start. The homepage, city pages, the free guide and Instagram all point to one value-first offer: a free, personal Buyer Blueprint.',
      tools: ['Website builder', 'Canva', 'Instagram', 'Facebook'],
      benefit: 'One clear offer across every channel turns passive visitors into people who want to take part. No hard sell is needed to get them started.' },
    { title: 'Capture preferences and requirements', short: 'Capture',
      purpose: 'A short mobile-friendly questionnaire collects budget, savings, timeline, property type, preferred area and readiness signals such as pre-approval.',
      tools: ['Custom web form', 'Google Sheets'],
      benefit: 'Structured first-party data instead of a vague "contact me" message. Every lead arrives with the context needed to help them.' },
    { title: 'Process the questionnaire', short: 'Process',
      purpose: 'Google Apps Script picks up each new submission, cleans the answers and runs the calculations the Blueprint needs.',
      tools: ['Google Apps Script', 'Google Sheets'],
      benefit: 'Consistent processing in minutes, with no copy-pasting or manual data entry. The same rules apply to every lead.' },
    { title: 'Generate a personalized Buyer Blueprint', short: 'Generate',
      purpose: 'The script fills a branded, pitch-deck-style template with the buyer\'s own numbers and next steps, then exports it as a PDF.',
      tools: ['Google Apps Script', 'ChatGPT', 'Claude', 'Google AI Studio'],
      benefit: 'Personalization at scale. Each buyer gets a plan that feels hand-made, and AI tools helped me write the copy and develop the script logic.' },
    { title: 'Categorize the lead for follow-up', short: 'Categorize',
      purpose: 'Each submission gets an internal status: hot, warm, cold or needs work. The status depends on timeline, finances and readiness.',
      tools: ['Google Apps Script', 'Google Sheets'],
      benefit: 'Lead qualification means follow-up time goes to the people ready to act. Longer-term leads still get nurtured instead of forgotten.' },
    { title: 'Send communications and enable booking', short: 'Communicate',
      purpose: 'The Blueprint is emailed to the buyer automatically. A booking system built into the site (not a third-party widget) checks calendar availability, sends confirmation emails and creates the meeting link, so the buyer books without leaving the page.',
      tools: ['Gmail', 'Google Calendar', 'Google Meet', 'Google Apps Script'],
      benefit: 'Instant value, then a frictionless next step. The buyer is never waiting on a manual reply to book.' },
    { title: 'Track submissions and appointments', short: 'Track',
      purpose: 'Questionnaire submissions and bookings are logged in separate spreadsheets, so I have a simple, searchable record of the pipeline.',
      tools: ['Google Sheets'],
      benefit: 'A lightweight CRM. I can see how many leads are at each stage and follow up on time, without paying for software.' }
  ];

  var flowSteps = $('.flow__steps');
  var flowPanel = $('#flow-panel');
  var flowProgress = $('.flow__progress');
  if (flowSteps && flowPanel) {
    flowSteps.innerHTML = FLOW.map(function (s, i) {
      return '<div class="flow__step" role="presentation"><button type="button" class="flow__tab" role="tab" id="flow-tab-' + i + '" aria-controls="flow-panel" aria-selected="false" tabindex="-1">' +
        '<span class="flow__dot">0' + (i + 1) + '</span><span class="flow__label">' + esc(s.short) + '</span></button></div>';
    }).join('');
    var flowTabs = $$('.flow__tab', flowSteps);
    var flowHTML = function (i) {
      var s = FLOW[i];
      return '<div class="flow__fade"><p class="flow__k">Step ' + (i + 1) + ' of ' + FLOW.length + '</p>' +
        '<h3>' + esc(s.title) + '</h3><p>' + esc(s.purpose) + '</p>' +
        '<div class="flow__nav"><button type="button" data-dir="-1"' + (i === 0 ? ' disabled' : '') + '>← Previous</button>' +
        '<button type="button" data-dir="1"' + (i === FLOW.length - 1 ? ' disabled' : '') + '>Next step →</button></div></div>' +
        '<div class="flow__fade"><p class="flow__k">Tools</p><div class="flow__tools">' + s.tools.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<p class="flow__k">Marketing and operational benefit</p><p>' + esc(s.benefit) + '</p></div>';
    };
    var renderFlow = function (i) {
      var s = FLOW[i];
      flowTabs.forEach(function (t, j) { t.classList.toggle('is-done', j < i); });
      flowPanel.setAttribute('aria-labelledby', 'flow-tab-' + i);
      if (flowProgress) flowProgress.style.width = (94 * i / (FLOW.length - 1)) + '%';
      flowPanel.innerHTML = flowHTML(i);
      $$('[data-dir]', flowPanel).forEach(function (b) {
        b.addEventListener('click', function () {
          var n = i + Number(b.getAttribute('data-dir'));
          selectFlow(n, true);
          flowTabs[n].focus({ preventScroll: true });
        });
      });
      var active = flowTabs[i];
      if (active && active.scrollIntoView && flowSteps.scrollWidth > flowSteps.clientWidth) {
        flowSteps.scrollTo({ left: active.parentNode.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    };
    var selectFlow = rovingTabs(flowTabs, renderFlow, 'horizontal');
    selectFlow(0, false);
    lockHeight(flowPanel, FLOW.length, function (c, i) { c.innerHTML = flowHTML(i); });
  }

  /* ---------- Sample Buyer Blueprint demo (fictional data only) ---------- */
  var PERSONAS = [
    { name: 'Alex', city: 'Mississauga', type: 'Condo apartment', budget: '550', down: '10', time: '3', pre: 'yes' },
    { name: 'Jordan', city: 'Milton', type: 'Townhouse', budget: '950', down: '5', time: '6', pre: 'progress' },
    { name: 'Sam', city: 'Oakville', type: 'Detached', budget: '1200', down: '0', time: '99', pre: 'no' }
  ];
  var BUDGET_LABEL = { '550': 'Up to $550K', '750': '$550K to $750K', '950': '$750K to $950K', '1200': '$950K to $1.2M' };
  var DOWN_LABEL = { '20': '20% or more', '10': '10% to 19%', '5': '5% to 9%', '0': 'Under 5%' };
  var TIME_LABEL = { '3': 'Within 3 months', '6': '3 to 6 months', '12': '6 to 12 months', '99': 'Just researching' };
  var PRE_LABEL = { yes: 'Pre-approved', progress: 'In progress', no: 'Not started' };

  var form = $('#demo-form');
  if (form) {
    var personaBtns = $$('[data-persona]', form);
    var currentName = 'Alex';
    var fields = { city: $('#d-city'), type: $('#d-type'), budget: $('#d-budget'), down: $('#d-down'), time: $('#d-time'), pre: $('#d-pre') };

    var applyPersona = function (i) {
      var p = PERSONAS[i];
      currentName = p.name;
      personaBtns.forEach(function (b, j) { b.setAttribute('aria-pressed', String(i === j)); });
      Object.keys(fields).forEach(function (k) { fields[k].value = p[k]; });
      renderBlueprint();
    };

    var computeBlueprint = function (v) {
      // Illustrative scoring only.
      var score = 20;
      score += { '20': 30, '10': 24, '5': 14, '0': 2 }[v.down];
      score += { '3': 25, '6': 18, '12': 10, '99': 2 }[v.time];
      score += { yes: 25, progress: 14, no: 3 }[v.pre];
      // A big budget with a thin down payment lowers readiness.
      if (Number(v.budget) >= 950 && Number(v.down) <= 5) score -= 8;
      score = Math.max(5, Math.min(98, score));

      var status, cls, why;
      if (score >= 80) { status = 'Hot lead'; cls = 'hot'; why = 'Ready to act soon: finances and timeline line up.'; }
      else if (score >= 60) { status = 'Warm lead'; cls = 'warm'; why = 'Serious, but a step or two away from making offers.'; }
      else if (score >= 40) { status = 'Needs work'; cls = 'work'; why = 'Motivated, but the down payment or pre-approval needs attention first.'; }
      else { status = 'Cold lead'; cls = 'cold'; why = 'Early research stage, so a nurture sequence fits better than a sales call.'; }
      // Word under the ring: how close the buyer is to making offers
      var ringWord = score >= 80 ? 'Ready' : score >= 40 ? 'Close' : 'Far';

      var moves = [];
      if (v.pre !== 'yes') moves.push(v.pre === 'progress' ? 'Finish your mortgage pre-approval and confirm your rate hold.' : 'Talk to a lender or broker about pre-approval.');
      if (Number(v.down) < 10) moves.push('Open or top up an FHSA and check the RRSP Home Buyers\' Plan.');
      if (v.time === '99' || v.time === '12') moves.push('Read the free GTA First-Time Buyer Guide at your own pace.');
      moves.push('Shortlist two or three ' + v.city + ' neighbourhoods that fit a ' + v.type.toLowerCase() + '.');
      moves.push(cls === 'hot' || cls === 'warm' ? 'Book a 30-minute strategy call to plan your offer approach.' : 'Book a call when you\'re ready. No pressure.');
      return { v: v, score: score, status: status, cls: cls, why: why, ringWord: ringWord, moves: moves.slice(0, 3) };
    };

    var fillBlueprint = function (root, d, name) {
      var q = function (id) { return root.querySelector('#' + id); };
      q('bp-name').textContent = name + ' (fictional)';
      q('bp-sub').textContent = d.v.type + ' · ' + d.v.city;
      q('bp-range').textContent = BUDGET_LABEL[d.v.budget];
      q('bp-down').textContent = DOWN_LABEL[d.v.down];
      q('bp-time').textContent = TIME_LABEL[d.v.time];
      q('bp-pre').textContent = PRE_LABEL[d.v.pre];
      var st = q('bp-status'); st.textContent = d.status; st.className = 'status status--' + d.cls;
      q('bp-why').textContent = d.why;
      q('bp-ringword').textContent = d.ringWord;
      q('bp-moves').innerHTML = d.moves.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('');
    };

    var renderBlueprint = function () {
      var v = {}; Object.keys(fields).forEach(function (k) { v[k] = fields[k].value; });
      var d = computeBlueprint(v), score = d.score;
      fillBlueprint(document, d, currentName);
      lastScore = score;
      if (bpSeen) fillGauge(score);
    };

    // Score meter fills from empty each time, like the sample report on hammadtherealtor.ca
    var lastScore = 0, bpSeen = false;
    var fillGauge = function (score) {
      var ring = $('#ring-fg'), circ = 307.88, target = String(circ - circ * score / 100);
      if (reduceMotion) { ring.style.strokeDashoffset = target; $('#bp-score').textContent = score; return; }
      ring.style.transition = 'none'; ring.style.strokeDashoffset = String(circ);
      ring.getBoundingClientRect();
      ring.style.transition = ''; ring.style.strokeDashoffset = target;
      $('#bp-score').textContent = '0';
      animateNumber($('#bp-score'), score);
    };
    var bpCard = $('#bp');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, ob) {
        if (es[0].isIntersecting) { bpSeen = true; fillGauge(lastScore); ob.disconnect(); }
      }, { threshold: 0.4 }).observe(bpCard);
    } else bpSeen = true;

    var animateNumber = function (el, to) {
      var from = Number(el.textContent) || 0;
      if (reduceMotion) { el.textContent = to; return; }
      var start = null, dur = 1600;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    personaBtns.forEach(function (b) { b.addEventListener('click', function () { applyPersona(Number(b.getAttribute('data-persona'))); }); });
    Object.keys(fields).forEach(function (k) {
      fields[k].addEventListener('change', function () {
        personaBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        currentName = 'Custom buyer';
        renderBlueprint();
      });
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    applyPersona(0);
    // Every answer combination, so the card keeps one height whatever the visitor picks
    var combos = [];
    ['Condo apartment', 'Townhouse', 'Semi-detached', 'Detached'].forEach(function (type) {
      ['20', '10', '5', '0'].forEach(function (down) {
        ['3', '6', '12', '99'].forEach(function (time) {
          ['yes', 'progress', 'no'].forEach(function (pre) {
            combos.push({ city: 'Mississauga', type: type, budget: '1200', down: down, time: time, pre: pre });
          });
        });
      });
    });
    lockHeight(bpCard, combos.length, function (c, i) { fillBlueprint(c, computeBlueprint(combos[i]), 'Custom buyer'); });
  }

  /* ---------- Skills explorer ---------- */
  var L = { 3: 'Applied', 2: 'Familiar', 1: 'Coursework' };
  var SKILLS = [
    { name: 'SEO and search', items: [
      { s: 'Google Search Console', l: 3, ev: 'Set up on both live sites. I used it to get the relaunched real estate site indexed, and I monitor queries and impressions.', link: '#case-realestate', lt: 'Real estate case study' },
      { s: 'Local SEO and service-area pages', l: 3, ev: 'City guides for Mississauga, Milton and Oakville, built around first-time buyer searches.', link: 'https://hammadtherealtor.ca/mississauga/', lt: 'Mississauga page' },
      { s: 'On-page SEO and information architecture', l: 3, ev: 'Descriptive titles, FAQ content and grade and price pages on Castoreum Canada.', link: '#case-castoreum', lt: 'Castoreum case study' },
      { s: 'Bilingual (EN/FR) content structure', l: 3, ev: 'A French homepage for the French perfumery market.', link: '#case-castoreum', lt: 'Castoreum case study' },
      { s: 'Keyword research', l: 2, ev: 'Used to plan page topics. Formal methods covered in Google course 2.', link: '#learning', lt: 'Learning' }
    ]},
    { name: 'Content and copywriting', items: [
      { s: 'Conversion copywriting', l: 3, ev: 'Value-first headlines and CTAs, for example "Your first home starts with a plan, not a guess."', link: '#case-realestate', lt: 'Real estate case study' },
      { s: 'Long-form lead magnets', l: 3, ev: 'A 28-page GTA First-Time Buyer Guide with a gated landing page.', link: 'https://hammadtherealtor.ca/guides/gta-first-time-buyer-guide/', lt: 'Buyer guide' },
      { s: 'Educational and FAQ content', l: 3, ev: 'A buyer FAQ answering grades, legality, documents and pricing questions.', link: '#case-castoreum', lt: 'Castoreum case study' },
      { s: 'B2B content strategy', l: 3, ev: 'Content that educates specialist international buyers before they inquire.', link: '#case-castoreum', lt: 'Castoreum case study' },
      { s: 'AI-assisted content workflows', l: 3, ev: 'ChatGPT, Claude and Google AI Studio for drafting, with my own editing and fact-checking.', link: '#automation', lt: 'Automation' }
    ]},
    { name: 'Social media and creative', items: [
      { s: 'Branded social content', l: 3, ev: 'Real estate posts on Instagram and Facebook: wins, education and behind the scenes.', link: 'https://instagram.com/hammadtherealtor', lt: '@hammadtherealtor' },
      { s: 'Canva', l: 2, ev: 'Graphics and marketing creative for my real estate brand.', link: 'https://instagram.com/hammadtherealtor', lt: '@hammadtherealtor' },
      { s: 'CapCut', l: 2, ev: 'Short-form video editing for social.', link: '#learning', lt: 'Learning' },
      { s: 'Meta Business Suite', l: 2, ev: 'Facebook and Instagram presence for my real estate brand.', link: '#learning', lt: 'Learning' },
      { s: 'Landing-page content', l: 3, ev: 'City pages, a gated guide page and seller report page, each with one clear CTA.', link: '#case-realestate', lt: 'Real estate case study' }
    ]},
    { name: 'Websites and CRO', items: [
      { s: 'Website building', l: 3, ev: 'Two live sites: relaunched hammadtherealtor.ca and built castoreumcanada.ca.', link: '#case-realestate', lt: 'Real estate case study' },
      { s: 'Landing pages and funnels', l: 3, ev: 'Buyer Blueprint, seller report and guide download pages, each with one clear CTA.', link: '#case-realestate', lt: 'Real estate case study' },
      { s: 'Low-friction inquiry design', l: 3, ev: 'Pre-written quote and WhatsApp messages for export buyers.', link: '#case-castoreum', lt: 'Castoreum case study' },
      { s: 'Site health (SSL, maintenance)', l: 3, ev: 'Fixed the SSL and maintenance problems on the older real estate site.', link: '#case-realestate', lt: 'Real estate case study' }
    ]},
    { name: 'Marketing ops and automation', items: [
      { s: 'Google Apps Script', l: 3, ev: 'Processes the questionnaire, generates the PDFs, sends the emails and powers booking.', link: '#automation', lt: 'Workflow explorer' },
      { s: 'Google Sheets as a lightweight CRM', l: 3, ev: 'Separate trackers for submissions and bookings.', link: '#automation', lt: 'Workflow explorer' },
      { s: 'Lead scoring and qualification', l: 3, ev: 'Hot, warm, cold and needs-work categorization for follow-up.', link: '#blueprint-demo', lt: 'Blueprint demo' },
      { s: 'Make (no-code automation)', l: 2, ev: 'Make Intermediate badge: HTTP requests, webhooks, error handling and functions.', link: '#learning', lt: 'Learning' },
      { s: 'Email workflows', l: 3, ev: 'Automated Blueprint delivery and booking confirmations.', link: '#automation', lt: 'Workflow explorer' }
    ]},
    { name: 'Analytics and ads', items: [
      { s: 'Google Analytics 4', l: 3, ev: 'Tracking both live sites behind a cookie consent banner. Funnel events are the next step.', link: '#case-realestate', lt: 'Real estate case study' },
      { s: 'Privacy and cookie consent', l: 2, ev: 'Optional analytics cookies the visitor can decline.', link: '#case-realestate', lt: 'Real estate case study' },
      { s: 'Google Ads and SEM', l: 1, ev: 'Covered in "Attract and Engage Customers with Digital Marketing" (October 2026).', link: '#learning', lt: 'Learning' },
      { s: 'Campaign tracking (UTMs, events)', l: 1, ev: 'Next step for both sites, set out in each case study\'s Measurement section.', link: '#case-castoreum', lt: 'Castoreum case study' }
    ]},
    { name: 'E-commerce', items: [
      { s: 'E-commerce fundamentals', l: 1, ev: 'Foundations of Digital Marketing and E-commerce (September 2026).', link: '#learning', lt: 'Learning' },
      { s: 'Shopify', l: 1, ev: 'Covered in the Google certificate curriculum.', link: '#learning', lt: 'Learning' },
      { s: 'Product information for buyers', l: 3, ev: 'Grade cards, a minimum order and an ordering process for a B2B export product.', link: '#case-castoreum', lt: 'Castoreum case study' }
    ]}
  ];

  var skillTabsEl = $('.skills__tabs');
  var skillPanel = $('#skills-panel');
  if (skillTabsEl && skillPanel) {
    skillTabsEl.innerHTML = SKILLS.map(function (g, i) {
      return '<button type="button" role="tab" id="sk-tab-' + i + '" aria-controls="skills-panel" aria-selected="false" tabindex="-1">' + esc(g.name) + '<span class="count">' + g.items.length + '</span></button>';
    }).join('');
    var skillTabs = $$('[role="tab"]', skillTabsEl);
    var skillHTML = function (i) {
      var g = SKILLS[i];
      return '<ul class="skill-list">' + g.items.map(function (it) {
        return '<li class="skill"><span class="skill__name">' + esc(it.s) + '</span>' +
          '<span class="skill__level"><span class="lvl" data-l="' + it.l + '" aria-hidden="true"><i></i><i></i><i></i></span>' + L[it.l] + '</span>' +
          '<p class="skill__ev">' + esc(it.ev) + ' <a href="' + it.link + '"' + (it.link.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + esc(it.lt) + (it.link.indexOf('http') === 0 ? ' ↗' : ' →') + '</a></p></li>';
      }).join('') + '</ul>';
    };
    var renderSkills = function (i) {
      skillPanel.setAttribute('aria-labelledby', 'sk-tab-' + i);
      skillPanel.innerHTML = skillHTML(i);
      skillPanel.classList.remove('skills__panel'); void skillPanel.offsetWidth; skillPanel.classList.add('skills__panel');
    };
    var mq = window.matchMedia('(max-width: 860px)');
    var selectSkill = rovingTabs(skillTabs, renderSkills, mq.matches ? 'horizontal' : 'vertical');
    selectSkill(0, false);
    lockHeight(skillPanel, SKILLS.length, function (c, i) { c.innerHTML = skillHTML(i); });
  }

  /* ---------- Approach walkthrough ---------- */
  var APPROACH = [
    { t: 'Research', d: 'Understand who the customer is, what they need to know before they act, and where they already look for answers.',
      ex: 'For Castoreum Canada, that meant learning what perfumers and traders check before they buy: grade, minimum order, legality and export documents.' },
    { t: 'Strategy', d: 'Choose one clear goal and a single next step, then decide what content and proof will earn that step.',
      ex: 'The goal was a qualified quote request rather than a checkout. So the plan was to educate first, then make inquiring take one tap.' },
    { t: 'Execution', d: 'Build it properly: pages, copy, visuals, forms and automations. Then test it on mobile and desktop.',
      ex: 'Grade cards, a French page, a FAQ, real warehouse photos, and a pre-written quote form with a WhatsApp option.' },
    { t: 'Measurement', d: 'Decide what success looks like before launch, track it with privacy in mind, and improve from what the data shows.',
      ex: 'Search Console and GA4 are already tracking the site. Next, I\'m adding GA4 events to compare quote-form sends with WhatsApp clicks.' }
  ];
  var apTabs = $$('.stepper [role="tab"]');
  var apPanel = $('#ap-panel');
  if (apTabs.length && apPanel) {
    var apHTML = function (i) {
      var a = APPROACH[i];
      return '<div class="flow__fade"><p class="index-num">Step 0' + (i + 1) + ' / 04</p><h3>' + esc(a.t) + '</h3><p>' + esc(a.d) + '</p>' +
        '<div class="example"><strong>Example: Castoreum Canada</strong>' + esc(a.ex) + '</div></div>';
    };
    var renderAp = function (i) {
      apPanel.setAttribute('aria-labelledby', 'ap-tab-' + i);
      apPanel.innerHTML = apHTML(i);
    };
    var selectAp = rovingTabs(apTabs, renderAp, 'horizontal');
    selectAp(0, false);
    lockHeight(apPanel, APPROACH.length, function (c, i) { c.innerHTML = apHTML(i); });
  }

  /* ---------- Cinematic sections: scroll progress, parallax backdrops, ghost words, cursor glow ---------- */
  (function () {
    var bar = $('#scrollbar');
    var cins = $$('.cin');
    var pars = $$('[data-par]');
    var drifts = $$('[data-drift]');
    var wallCols = $$('[data-colspeed]');
    if ('IntersectionObserver' in window) {
      document.documentElement.classList.add('cin-ready');
      var lit = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-lit'); lit.unobserve(e.target); } });
      }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
      cins.forEach(function (c) { lit.observe(c); });
    }
    var ticking = false;
    function frame() {
      ticking = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
      if (reduceMotion) return;
      var vh = innerHeight;
      pars.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = 'translate3d(0,' + (p * -60).toFixed(1) + 'px,0) scale(1.12)';
      });
      drifts.forEach(function (el, i) {
        var r = el.parentNode.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (vh - r.top) / (vh + r.height);
        el.style.setProperty('--dx', ((i % 2 ? -1 : 1) * (p * 24 - 12)).toFixed(2) + 'vw');
      });
      wallCols.forEach(function (col) {
        var r = col.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        col.style.transform = 'translate3d(0,' + (p * Number(col.getAttribute('data-colspeed')) * 2).toFixed(1) + 'px,0)';
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    frame();

    var glow = $('#cursor-glow');
    if (glow && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      var gx = 0, gy = 0, tx = 0, ty = 0, running = false;
      var hero = $('#top');
      addEventListener('pointermove', function (e) {
        tx = e.clientX; ty = e.clientY;
        var inHero = hero && hero.getBoundingClientRect().bottom > ty;
        glow.classList.toggle('is-on', !inHero);
        if (!running) { running = true; requestAnimationFrame(loop); }
      }, { passive: true });
      document.addEventListener('pointerleave', function () { glow.classList.remove('is-on'); });
      var loop = function () {
        gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
        glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
        if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) requestAnimationFrame(loop); else running = false;
      };
    }
  })();

  /* ---------- Copy email ---------- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { toast('Email address copied'); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }
})();
