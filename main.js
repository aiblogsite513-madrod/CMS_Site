/*
 * CHAMBER MANAGEMENT SYSTEM — PUBLIC MARKETING WEBSITE
 * Motion powered by GSAP + ScrollTrigger and Lenis when available.
 * Spotlight cards adapt the public React Bits "SpotlightCard" interaction
 * to this no-build vanilla-JavaScript static site for easy Cloudflare Pages hosting.
 * https://github.com/DavidHDev/react-bits
 * All page copy and demonstration data are independent of the chamber portal.
 */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('#site-header');
  const progress = $('#reading-progress');
  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  const toastNode = $('#toast');

  const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 28);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });
  window.addEventListener('scroll', () => {
    const height = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, window.scrollY / height)})`;
  }, { passive: true });

  function showToast(text) {
    if (!toastNode) return;
    toastNode.textContent = text;
    toastNode.classList.add('show');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toastNode.classList.remove('show'), 3000);
  }

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
  }
  toggle?.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  $('#year').textContent = new Date().getFullYear();

  // React Bits SpotlightCard behavior — adapted to ordinary semantic articles.
  $$('[data-spotlight]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
  });

  // Explorable front-end demonstration. All data are fictional local markup;
  // there are no API calls, cookies, sign-in controls or real chamber records.
  const screenButtons = $$('.app-side-link');
  const screens = $$('.app-screen');
  screenButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      const screen = button.dataset.screen;
      screenButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      screens.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === screen));
      window.ScrollTrigger?.refresh();
    });
  });

  // A gentle pointer glow; disabled on touch and for reduced motion.
  const halo = $('#cursor-halo');
  if (!reduceMotion.matches && window.matchMedia('(pointer: fine)').matches && halo) {
    let cx = -300, cy = -300, tx = -300, ty = -300, alive = true;
    window.addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      halo.style.opacity = '.8';
    }, { passive: true });
    window.addEventListener('pointerleave', () => halo.style.opacity = '0');
    function move() {
      if (!alive) return;
      cx += (tx - cx) * .11;
      cy += (ty - cy) * .11;
      halo.style.left = cx + 'px';
      halo.style.top = cy + 'px';
      requestAnimationFrame(move);
    }
    move();
    reduceMotion.addEventListener('change', () => { alive = false; halo.style.opacity = 0; }, { once: true });
  }

  // Copy-to-clipboard, with graceful fallback to ordinary mailto link.
  $('#copy-email')?.addEventListener('click', async () => {
    const email = 'madushangarodrigo@gmail.com';
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      showToast('Email address copied');
    } catch {
      showToast('Email: ' + email);
    }
  });

  let lenis = null;
  let gsapInstance = window.gsap;
  let ScrollTriggerInstance = window.ScrollTrigger;
  if (!reduceMotion.matches && typeof window.Lenis === 'function') {
    try {
      lenis = new window.Lenis({ duration: 1.25, smoothWheel: true, anchors: true, wheelMultiplier: .86 });
      if (gsapInstance && ScrollTriggerInstance) {
        lenis.on('scroll', ScrollTriggerInstance.update);
        gsapInstance.ticker.add(time => lenis?.raf(time * 1000));
        gsapInstance.ticker.lagSmoothing(0);
      } else {
        const raf = time => { if (!lenis) return; lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (error) {
      console.warn('Lenis was not initialized; native scrolling remains available.', error);
    }
  }

  // Honor anchor links even if Lenis failed to load.
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href === '#top') {
      if (lenis) { e.preventDefault(); lenis.scrollTo(0, { duration: 1.2 }); }
      return;
    }
    const target = document.querySelector(href);
    if (target && lenis) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.1 });
      history.replaceState(null, '', href);
    }
  }));

  // GSAP / ScrollTrigger progressive enhancement.
  if (!reduceMotion.matches && gsapInstance && ScrollTriggerInstance) {
    gsapInstance.registerPlugin(ScrollTriggerInstance);
    document.documentElement.classList.add('js-gsap');

    gsapInstance.from('.hero-intro', { y: 20, opacity: 0, duration: .85, ease: 'power3.out', delay: .22 });
    gsapInstance.from('.hero h1', { y: 42, opacity: 0, duration: 1.35, ease: 'power3.out', delay: .38 });
    gsapInstance.from('.hero-lede', { y: 24, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .65 });
    gsapInstance.from('.hero-actions > *', { y: 20, opacity: 0, duration: .9, ease: 'power3.out', delay: .87, stagger: .13 });
    gsapInstance.from('.hero-meta', { opacity: 0, y: 20, duration: .7, delay: 1.2 });
    gsapInstance.from('.sculpture-wrap', { opacity: 0, scale: .92, duration: 1.8, delay: .3, ease: 'power2.out' });

    $$('.reveal').forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      // Reveals are explicitly created even if the element starts in viewport.
      gsapInstance.fromTo(el, { opacity: 0, y: 48 }, {
        opacity: 1, y: 0, duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true, invalidateOnRefresh: true },
        onComplete: () => el.classList.add('is-visible')
      });
    });

    gsapInstance.to('.hero-grid', { yPercent: 19, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
    gsapInstance.to('.sculpture-wrap', { yPercent: 14, scale: .94, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 } });
    gsapInstance.fromTo('#product-window', { rotateX: 7, y: 60 }, { rotateX: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.product-showcase', start: 'top bottom', end: 'center center', scrub: 1.2 } });
    gsapInstance.to('.statement-ghost', { x: 150, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    gsapInstance.to('.contact-aura', { y: -90, rotate: 10, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    gsapInstance.to('.orbit-visual', { rotate: 35, ease: 'none', scrollTrigger: { trigger: '.features-section', start: 'top bottom', end: 'bottom top', scrub: 1.7 } });
    ScrollTriggerInstance.refresh();
  }

  // Scroll and motion still work without any third-party network access.
  // This covers offline previews, strict privacy settings and CDN outages.
  if (!gsapInstance || !ScrollTriggerInstance || reduceMotion.matches) {
    $$('.reveal').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // Links to the contact address intentionally use mailto — no personal data
  // leaves this website unless the visitor chooses to send an email.
})();
