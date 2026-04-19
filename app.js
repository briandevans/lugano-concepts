// ============================================================
// LUGANO.AI — Interactive Layer (Enterprise)
// ============================================================

// 1. SCROLL REVEAL with fallback
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-line');

  function fallbackReveal() {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    setTimeout(fallbackReveal, 300);
    // Also reveal on scroll as backup
    window.addEventListener('scroll', fallbackReveal, { passive: true });
  } else {
    els.forEach(el => el.classList.add('in'));
  }
})();


// 2. NAV SCROLL STATE
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const on = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', on, { passive: true });
  on();
})();


// 3. SMOOTH ANCHOR SCROLL
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const t = document.querySelector(id);
  if (t) {
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
  }
});


// 4. SPLIT-TEXT REVEAL for large headings
// Preserves inner HTML structure (strikethrough, em, etc.)
(function () {
  const headings = document.querySelectorAll('.hero h1, .final h2');

  function wrapTextNodes(el, lineIdx, wordCounter) {
    const children = Array.from(el.childNodes);
    children.forEach(child => {
      if (child.nodeType === 3) {
        const text = child.textContent;
        const parts = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(part => {
          if (/^\s+$/.test(part) || part === '') {
            if (part) frag.appendChild(document.createTextNode(part));
            return;
          }
          const wrapper = document.createElement('span');
          wrapper.className = 'split-word';
          const inner = document.createElement('span');
          inner.className = 'split-inner';
          inner.textContent = part;
          inner.style.transitionDelay = `${(lineIdx * 0.15) + (wordCounter.count * 0.06)}s`;
          wordCounter.count++;
          wrapper.appendChild(inner);
          frag.appendChild(wrapper);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        if (!child.classList || !child.classList.contains('line')) {
          wrapTextNodes(child, lineIdx, wordCounter);
        }
      }
    });
  }

  headings.forEach(heading => {
    const lines = heading.querySelectorAll('.line');
    const targets = lines.length > 0 ? lines : [heading];

    targets.forEach((target, lineIdx) => {
      const wordCounter = { count: 0 };
      wrapTextNodes(target, lineIdx, wordCounter);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heading.querySelectorAll('.split-word').forEach(w => w.classList.add('in'));
          observer.unobserve(heading);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(heading);

    setTimeout(() => {
      const rect = heading.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        heading.querySelectorAll('.split-word').forEach(w => w.classList.add('in'));
      }
    }, 500);
  });
})();


// 5. SPOTLIGHT MASKING on Trust/Privacy section
(function () {
  const trust = document.querySelector('.trust');
  if (!trust) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  trust.addEventListener('mouseenter', () => {
    trust.classList.add('spotlight-active');
  });

  trust.addEventListener('mouseleave', () => {
    trust.classList.remove('spotlight-active');
  });

  trust.addEventListener('mousemove', (e) => {
    const rect = trust.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    trust.style.setProperty('--spot-x', x + 'px');
    trust.style.setProperty('--spot-y', y + 'px');
  });
})();


// 6. STAT PULSE animation (subtle)
(function () {
  const pulses = document.querySelectorAll('.stat .v .pulse');
  pulses.forEach(p => {
    p.style.transition = 'color 0.3s ease, text-shadow 0.3s ease';
    setInterval(() => {
      p.style.textShadow = '0 0 6px rgba(74,222,128,0.2)';
      setTimeout(() => { p.style.textShadow = 'none'; }, 800);
    }, 4000);
  });
})();
