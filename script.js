/* =============================================
   MebelArt — script.js
   ============================================= */

'use strict';

/* ---------- Loader ---------- */
// Hide loader as soon as DOM is ready, don't wait for external resources
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120 + 200);
    });
  }, 800);
});

/* ---------- Custom cursor ---------- */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

if (window.innerWidth > 768 && cursor && cursorDot) {
  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .project-card, .service-card, .step, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ---------- Header scroll ---------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ---------- Burger / Mobile Menu ---------- */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ---------- Intersection Observer — Reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  // skip hero elements — they animate via CSS loader callback
  if (!el.closest('.hero')) revealObserver.observe(el);
});

/* ---------- Counter animation ---------- */
function animateCounter(el, target, duration = 1600) {
  const startTime = performance.now();
  const isPercent = target === 100;

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(ease * target);
    el.textContent = current + (isPercent ? '%' : '+');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = parseInt(entry.target.dataset.target);
    animateCounter(entry.target, target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ---------- Contact Form ---------- */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const btnLoader  = document.getElementById('btnLoader');
const btnText    = submitBtn?.querySelector('.btn-text');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    if (!name || !phone) {
      shakeField(!name ? '#name' : '#phone');
      return;
    }

    // Simulate sending
    btnText.style.opacity = '0';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnLoader.style.display = 'none';
      btnText.style.opacity   = '1';
      submitBtn.disabled      = false;
      form.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });
}

function shakeField(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

/* Inject shake keyframes dynamically */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(shakeStyle);

/* ---------- Smooth active nav link ---------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--c-accent)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ---------- Parallax hero shapes on mousemove ---------- */
const heroShapes = document.querySelectorAll('.hero-shape');
if (heroShapes.length) {
  document.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
    heroShapes.forEach((shape, i) => {
      const factor = (i + 1) * 10;
      shape.style.transform = `translate(${xRatio * factor}px, ${yRatio * factor}px)`;
    });
  }, { passive: true });
}

/* ---------- Modal Gallery ---------- */
(function () {
  const modal        = document.getElementById('modal');
  const modalImg     = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalCounter = document.getElementById('modalCounter');
  const modalSpinner = document.getElementById('modalSpinner');
  const modalClose   = document.getElementById('modalClose');
  const modalPrev    = document.getElementById('modalPrev');
  const modalNext    = document.getElementById('modalNext');
  const backdrop     = document.getElementById('modalBackdrop');

  // Collect all real project cards (exclude placeholders)
  const cards = Array.from(
    document.querySelectorAll('.project-card:not(.project-card--placeholder)')
  );

  let current = 0;

  // Build gallery data from each card
  const gallery = cards.map(card => ({
    src:     card.querySelector('img').src,
    alt:     card.querySelector('img').alt,
    name:    card.querySelector('.project-name')?.textContent || '',
    year:    card.querySelector('.project-year')?.textContent || '',
  }));

  function openModal(index) {
    current = index;
    showSlide(current);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showSlide(index) {
    const item = gallery[index];
    modalImg.classList.add('loading');
    modalSpinner.classList.add('active');

    const tmp = new Image();
    tmp.onload = () => {
      modalImg.src = item.src;
      modalImg.alt = item.alt;
      modalImg.classList.remove('loading');
      modalSpinner.classList.remove('active');
    };
    tmp.src = item.src;

    modalCaption.textContent = item.name + (item.year ? ' · ' + item.year : '');
    modalCounter.textContent = (index + 1) + ' / ' + gallery.length;
  }

  function prev() {
    current = (current - 1 + gallery.length) % gallery.length;
    showSlide(current);
  }

  function next() {
    current = (current + 1) % gallery.length;
    showSlide(current);
  }

  // Click on project card
  cards.forEach((card, i) => {
    card.addEventListener('click', () => openModal(i));
  });

  // Also click on about image
  const aboutImg = document.querySelector('.about-img-wrap img');
  if (aboutImg) {
    aboutImg.style.cursor = 'pointer';
    aboutImg.addEventListener('click', () => {
      // show it standalone
      const src = aboutImg.src;
      modalImg.src = src;
      modalImg.alt = aboutImg.alt;
      modalCaption.textContent = 'Наші роботи';
      modalCounter.textContent = '';
      modalPrev.style.display = 'none';
      modalNext.style.display = 'none';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  // Controls
  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  modalNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch swipe
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  modal.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  }, { passive: true });
})();

// Ensure all reveals visible on short pages
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.1) {
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay + 300);
      }
    });
  }, 2000);
});
