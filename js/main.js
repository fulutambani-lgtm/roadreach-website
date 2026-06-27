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
  if (hamburger && navLinks) {
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
  }

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

  // --- Form handling (Vercel API) ---
  const forms = document.querySelectorAll('form');

  function getFormEndpoint(form) {
    var name = (form.querySelector('[name="form-name"]') || {}).value || '';
    var action = form.getAttribute('action') || '';
    if (action) return action;
    if (name === 'rate-card') return '/api/rate-card';
    if (name === 'book-meeting') return '/api/book-meeting';
    if (name === 'booking-response') return '/api/meeting-response';
    if (name === 'driver-waitlist') return '/api/driver-waitlist';
    return '/api/contact';
  }

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var formData = new FormData(this);
      var submitBtn = this.querySelector('button[type="submit"]');
      var originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      // Disable button & show sending state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      var endpoint = getFormEndpoint(this);

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          showFormSuccess(this);
        } else {
          alert('Something went wrong. Please try again or email us directly at info@roadreach.co.za.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        }
      }.bind(this))
      .catch(function() {
        alert('Network error. Please check your connection and try again, or email us directly at info@roadreach.co.za.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      });
    });
  });

  function showFormSuccess(form) {
    var formName = (form.querySelector('[name="form-name"]') || {}).value || '';
    var type = 'contact';
    if (formName === 'rate-card') type = 'rate-card';
    else if (formName === 'book-meeting' || formName === 'booking-response') type = 'booking';
    else if (formName === 'driver-waitlist') type = 'driver-waitlist';
    window.location.href = '/thank-you.html?type=' + type;
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
