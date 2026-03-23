document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     GOOGLE APPS SCRIPT WEB APP URL
     Replace this with your deployed Apps Script URL.
     See setup instructions below.
     ================================================================ */
  const SHEETS_ENDPOINT = '__GOOGLE_APPS_SCRIPT_URL__';

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById('mobileToggle');
  const panel  = document.getElementById('mobilePanel');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggle.classList.remove('is-active');
      document.body.style.overflow = '';
    }));
    // Close mobile panel when beta button inside it is clicked (modal will open)
    panel.querySelectorAll('[data-open-beta]').forEach(btn => btn.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggle.classList.remove('is-active');
      document.body.style.overflow = '';
    }));
  }

  /* ---- Nav hide on scroll down / show on scroll up ---- */
  const nav = document.getElementById('nav');
  let lastY = 0, ticking = false, scrollDelta = 0;
  const HIDE_THRESHOLD = 8;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastY;

        if (y < 80) {
          nav.classList.remove('is-hidden');
          scrollDelta = 0;
        } else if (diff > 0) {
          scrollDelta += diff;
          if (scrollDelta > HIDE_THRESHOLD) {
            nav.classList.add('is-hidden');
          }
        } else {
          scrollDelta = 0;
          nav.classList.remove('is-hidden');
        }

        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---- Scroll reveal with staggered children ---- */
  const targets = document.querySelectorAll(
    '.hero-image, .strip, .section, .statement, .finale'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.04, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => { el.classList.add('reveal'); io.observe(el); });

  /* ---- Smooth scroll for hash links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---- Subtle parallax on hero image ---- */
  const heroImg = document.querySelector('.hero-image img');
  if (heroImg && window.matchMedia('(min-width: 860px)').matches) {
    let pTicking = false;
    window.addEventListener('scroll', () => {
      if (!pTicking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < 1200) {
            heroImg.style.transform = `translateY(${y * 0.08}px) scale(1.02)`;
          }
          pTicking = false;
        });
        pTicking = true;
      }
    }, { passive: true });
  }


  /* ================================================================
     BETA ACCESS MODAL
     ================================================================ */
  const modal      = document.getElementById('betaModal');
  const modalClose = document.getElementById('modalClose');
  const betaForm   = document.getElementById('betaForm');
  const betaSubmit = document.getElementById('betaSubmit');
  const betaSuccess= document.getElementById('betaSuccess');
  const openers    = document.querySelectorAll('[data-open-beta]');

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Focus first input after transition
    setTimeout(() => {
      const first = betaForm.querySelector('input');
      if (first) first.focus();
    }, 350);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function resetForm() {
    betaForm.reset();
    betaForm.style.display = '';
    betaSuccess.style.display = 'none';
    betaSubmit.disabled = false;
    betaSubmit.textContent = 'Submit application';
  }

  // Open modal from any CTA
  openers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    resetForm();
    openModal();
  }));

  // Close on X button
  modalClose.addEventListener('click', closeModal);

  // Close on overlay click (not modal body)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Form submission
  betaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name:    betaForm.querySelector('#beta-name').value.trim(),
      email:   betaForm.querySelector('#beta-email').value.trim(),
      company: betaForm.querySelector('#beta-company').value.trim(),
      role:    betaForm.querySelector('#beta-role').value.trim(),
      timestamp: new Date().toISOString()
    };

    // Validate
    if (!data.name || !data.email || !data.company || !data.role) return;

    // Disable button, show sending state
    betaSubmit.disabled = true;
    betaSubmit.textContent = 'Submitting...';

    try {
      // Post to Google Apps Script web app
      if (SHEETS_ENDPOINT && SHEETS_ENDPOINT !== '__GOOGLE_APPS_SCRIPT_URL__') {
        await fetch(SHEETS_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      // Show success state
      betaForm.style.display = 'none';
      betaSuccess.style.display = '';

    } catch (err) {
      // Still show success to user (no-cors means we can't read response)
      betaForm.style.display = 'none';
      betaSuccess.style.display = '';
    }
  });

});
