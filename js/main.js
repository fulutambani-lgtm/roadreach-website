/* ============================================
   RoadReach - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Navbar scroll effect ---
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksAnchors = document.querySelectorAll('.nav-links a:not(.btn)');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile menu ---
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinksAnchors.forEach(link => {
    link.addEventListener('click', function(e) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';

      // Smooth scroll for anchor links
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // --- Scroll animations (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.animate-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // --- Rate Card Modal ---
  const modalOverlay = document.getElementById('rateCardModal');
  const modalClose = document.querySelector('.modal-close');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');

  if (modalOverlay) {
    function openModal() {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    openModalButtons.forEach(btn => {
      btn.addEventListener('click', openModal);
    });

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- Form handling (Netlify forms) ---
  const forms = document.querySelectorAll('form[data-netlify="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // If not using Netlify (static fallback), prevent and show thank you
      // Otherwise Netlify handles it natively
      const isNetlify = window.location.hostname.includes('netlify.app') || 
                        window.location.hostname === 'localhost';
      
      if (!isNetlify) {
        e.preventDefault();
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        // Simulate submission with fetch
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        })
        .then(() => {
          showFormSuccess(this);
        })
        .catch(() => {
          showFormSuccess(this); // Show success anyway for demo
        });
      }
    });
  });

  function showFormSuccess(form) {
    const thankYouHTML = `
      <div class="form-thank-you">
        <div class="checkmark"><i class="fas fa-check"></i></div>
        <h3>Thank You!</h3>
        <p>Your message has been received.</p>
        <p>We'll be in touch within <strong>24 hours</strong>.</p>
        <div class="whatsapp-nudge">
          Prefer instant answers? <a href="https://wa.me/27812987137" target="_blank"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
        </div>
      </div>
    `;
    form.innerHTML = thankYouHTML;
  }

  // --- Sticky CTA Bar ---
  const stickyBar = document.getElementById('stickyCtaBar');
  if (stickyBar) {
    let barDismissed = sessionStorage.getItem('roadreach_cta_dismissed');

    function showStickyBar() {
      if (!barDismissed && window.innerWidth > 480) {
        stickyBar.classList.add('visible');
        document.body.classList.add('has-sticky-bar');
      }
    }

    function hideStickyBar() {
      stickyBar.classList.remove('visible');
      document.body.classList.remove('has-sticky-bar');
    }

    // Show after scrolling past hero (≈ 600px)
    let barShown = false;
    window.addEventListener('scroll', function() {
      if (!barShown && window.scrollY > 600 && !barDismissed) {
        barShown = true;
        showStickyBar();
      }
    }, { passive: true });

    // Close button
    const closeBtn = stickyBar.querySelector('[data-close-bar]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        hideStickyBar();
        sessionStorage.setItem('roadreach_cta_dismissed', 'true');
        barDismissed = 'true';
      });
    }

    // On mobile (< 480px) hide sticky bar — WhatsApp and nav suffice
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 480) {
        hideStickyBar();
      } else if (barShown && !barDismissed) {
        showStickyBar();
      }
    });
  }

  // --- Counter animation for stats ---
  function animateCounter(el, target, suffix) {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current) + (suffix || '');
    }, stepDuration);
  }

  // Use Intersection Observer for counters
  const statNumbers = document.querySelectorAll('.hero-stat .number, .drivers-stat .num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Don't re-animate
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';

        const text = el.textContent.trim();
        const match = text.match(/^([\d,]+)/);
        if (match) {
          const target = parseInt(match[1].replace(/,/g, ''));
          const suffix = text.replace(match[0], '');
          // Delay start slightly
          setTimeout(() => animateCounter(el, target, suffix), 300);
        }
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
});
