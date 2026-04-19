// ============================================================
// LUGANO.AI — Premium Interactive Layer
// ============================================================

// 1. HERO CANVAS — Neural-mesh particle field
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0, H = 0;
  let nodes = [];
  const mouse = { x: -99999, y: -99999, active: false };

  const COUNT = () => {
    const areaCss = (W / DPR) * (H / DPR);
    return Math.round(Math.min(420, Math.max(220, areaCss / 2600)));
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width * DPR));
    H = Math.max(1, Math.floor(rect.height * DPR));
    canvas.width = W;
    canvas.height = H;
    seed();
  }

  function seed() {
    nodes = [];
    const n = COUNT();
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.14 * DPR,
        vy: (Math.random() - 0.5) * 0.14 * DPR,
        r: (Math.random() * 0.9 + 0.5) * DPR,
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    const linkDist = 110 * DPR;
    const linkDistSq = linkDist * linkDist;
    const mouseRadius = 220 * DPR;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (mouse.active) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < mouseRadiusSq && dSq > 1) {
          const d = Math.sqrt(dSq);
          const falloff = 1 - d / mouseRadius;
          const pull = falloff * falloff * 0.55 * DPR;
          n.x += (dx / d) * pull;
          n.y += (dy / d) * pull;
        }
      }
      n.vx *= 0.995;
      n.vy *= 0.995;
      if (Math.random() < 0.003) {
        n.vx += (Math.random() - 0.5) * 0.08 * DPR;
        n.vy += (Math.random() - 0.5) * 0.08 * DPR;
      }
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
    }

    ctx.lineWidth = 1 * DPR;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < linkDistSq) {
          const t = 1 - dSq / linkDistSq;
          let alpha = t * 0.28;
          if (mouse.active) {
            const mx = (a.x + b.x) * 0.5 - mouse.x;
            const my = (a.y + b.y) * 0.5 - mouse.y;
            const mdSq = mx * mx + my * my;
            if (mdSq < mouseRadiusSq) {
              const mt = 1 - mdSq / mouseRadiusSq;
              alpha = Math.min(0.85, alpha + mt * 0.45);
            }
          }
          ctx.strokeStyle = `rgba(74, 222, 128, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      let glow = 0;
      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < mouseRadiusSq) glow = 1 - dSq / mouseRadiusSq;
      }
      const alpha = 0.55 + glow * 0.45;
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 1.3 * DPR, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * DPR;
    mouse.y = (e.clientY - rect.top) * DPR;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => { mouse.active = false; });
  window.addEventListener('blur', () => { mouse.active = false; });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) resize();
  });

  resize();
  requestAnimationFrame(step);
})();


// 2. SCROLL REVEAL with fallback
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-line');

  // Fallback: if elements are already in view on load, reveal them
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
    // Also run fallback after a short delay in case observer doesn't fire
    setTimeout(fallbackReveal, 300);
  } else {
    // No IntersectionObserver support: reveal everything
    els.forEach(el => el.classList.add('in'));
  }
})();


// 3. NAV SCROLL STATE
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const on = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', on, { passive: true });
  on();
})();


// 4. SMOOTH ANCHOR SCROLL
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


// 5. CUSTOM CURSOR
(function () {
  // Only on desktop with fine pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  // Hide default cursor on body
  document.body.style.cursor = 'none';

  let cx = 0, cy = 0; // current position
  let tx = 0, ty = 0; // target position
  let visible = false;

  // Smooth follow with lerp
  function animate() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!visible) {
      visible = true;
      cursor.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', () => {
    visible = false;
    cursor.classList.remove('visible');
  });

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .btn, .g-card, .who-card, .arch-node, .step, .trust-cell, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
    }
  });

  // Click state
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  // Hide cursor on all interactive elements too
  const style = document.createElement('style');
  style.textContent = `
    a, button, .btn, .g-card, .who-card, .arch-node, .step, .trust-cell,
    input, textarea, .nav .apply, .marquee-strip { cursor: none !important; }
  `;
  document.head.appendChild(style);
})();


// 6. MAGNETIC BUTTONS
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const magneticEls = document.querySelectorAll('.btn-primary, .btn-ghost, .nav .apply');

  magneticEls.forEach(el => {
    el.classList.add('magnetic');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Button moves toward cursor (magnetic pull)
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      // Inner text moves less for parallax depth
      const inner = el.querySelector('svg, .arrow, span');
      if (inner) {
        inner.style.transition = 'transform 0.2s ease';
        inner.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      const inner = el.querySelector('svg, .arrow, span');
      if (inner) {
        inner.style.transform = '';
      }
    });
  });
})();


// 7. SPLIT-TEXT REVEAL for large headings
// Preserves inner HTML structure (strikethrough, em, etc.)
(function () {
  const headings = document.querySelectorAll('.hero h1, .final h2');

  function wrapTextNodes(el, lineIdx, wordCounter) {
    const children = Array.from(el.childNodes);
    children.forEach(child => {
      if (child.nodeType === 3) { // Text node
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
      } else if (child.nodeType === 1) { // Element node (s, em, span, etc.)
        // Don't descend into .line spans, those are handled at the top level
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

    // Fallback
    setTimeout(() => {
      const rect = heading.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        heading.querySelectorAll('.split-word').forEach(w => w.classList.add('in'));
      }
    }, 500);
  });
})();


// 8. SPOTLIGHT MASKING on Trust/Privacy section
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


// 9. 3D TILT on glassmorphism cards (improved, no conflict with CSS hover)
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = document.querySelectorAll('.g-card, .who-card, .arch-node');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// 10. HERO GLOW PARALLAX
(function () {
  const hero = document.querySelector('.hero');
  const glow = document.querySelector('.hero-glow');
  if (!hero || !glow) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    glow.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  });
})();


// 11. STAT PULSE animation
(function () {
  const pulses = document.querySelectorAll('.stat .v .pulse');
  pulses.forEach(p => {
    p.style.transition = 'color 0.3s ease, text-shadow 0.3s ease';
    setInterval(() => {
      p.style.textShadow = '0 0 12px rgba(74,222,128,0.4)';
      setTimeout(() => { p.style.textShadow = 'none'; }, 800);
    }, 3000);
  });
})();
