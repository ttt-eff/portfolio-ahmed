/**
 * Eng. Ahmed Atif Portfolio — Main JavaScript
 * Handles all interactive features, animations, and UI behavior
 */

(function () {
  'use strict';

  /* =========================================================
     DOM ELEMENT REFERENCES
     ========================================================= */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  const cursorGlow = document.getElementById('cursorGlow');
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const typingText = document.getElementById('typingText');
  const particlesCanvas = document.getElementById('particlesCanvas');
  const bgAnimation = document.getElementById('bgAnimation');
  const testimonialTrack = document.getElementById('testimonialTrack');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');
  const sliderDots = document.getElementById('sliderDots');
  const backToTop = document.getElementById('backToTop');
  const revealElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');
  const timeline = document.querySelector('.timeline');
  const rippleButtons = document.querySelectorAll('.ripple-btn');
  const starsLayer = document.getElementById('starsLayer');

  /* =========================================================
     SUBTLE STARS BACKGROUND
     ========================================================= */
  function initStars() {
    if (!starsLayer) return;

    const starCount = Math.min(Math.floor(window.innerWidth / 12), 120);
    starsLayer.innerHTML = '';

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('span');
      star.className = Math.random() > 0.7 ? 'star star-sm' : 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
      star.style.setProperty('--delay', (Math.random() * 5) + 's');
      starsLayer.appendChild(star);
    }
  }

  /* =========================================================
     LOADING SCREEN
     ========================================================= */
  function initLoader() {
    document.body.classList.add('loading');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        loaderProgress.style.width = '100%';

        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.remove('loading');
        }, 400);
      } else {
        loaderProgress.style.width = progress + '%';
      }
    }, 100);
  }

  /* =========================================================
     TYPING ANIMATION
     ========================================================= */
  const typingWords = ['Data Analysis', 'SQL', 'Python', 'Power BI'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = typingWords[wordIndex];

    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  /* =========================================================
     FLOATING PARTICLES (Canvas)
     ========================================================= */
  function initParticles() {
    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor(window.innerWidth / 15), 80);
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particlesCanvas.width,
          y: Math.random() * particlesCanvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

      particles.forEach((p, i) => {
        /* Mouse parallax influence */
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          p.x -= dx * 0.002;
          p.y -= dy * 0.002;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        /* Wrap around edges */
        if (p.x < 0) p.x = particlesCanvas.width;
        if (p.x > particlesCanvas.width) p.x = 0;
        if (p.y < 0) p.y = particlesCanvas.height;
        if (p.y > particlesCanvas.height) p.y = 0;

        /* Draw particle */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();

        /* Connect nearby particles */
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distX = p.x - p2.x;
          const distY = p.y - p2.y;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    return () => cancelAnimationFrame(animationId);
  }

  /* =========================================================
     CURSOR GLOW
     ========================================================= */
  function initCursorGlow() {
    if (window.innerWidth <= 768) return;

    document.body.classList.add('cursor-active');

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  /* =========================================================
     BACKGROUND PARALLAX (Mouse)
     ========================================================= */
  function initBackgroundParallax() {
    if (window.innerWidth <= 768) return;

    const orbs = document.querySelectorAll('.gradient-orb');
    const blurs = document.querySelectorAll('.blur-circle');
    const grid = document.querySelector('.animated-grid');

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });

      blurs.forEach((blur, i) => {
        const speed = (i + 1) * 10;
        blur.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });

      if (grid) {
        grid.style.transform = `perspective(500px) rotateX(60deg) translate(${x * 20}px, ${y * 20}px)`;
      }
    });
  }

  /* =========================================================
     SCROLL PROGRESS BAR
     ========================================================= */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* =========================================================
     NAVBAR — Scroll blur & active section
     ========================================================= */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */
  function initMobileNav() {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* =========================================================
     SMOOTH SCROLL (Enhanced)
     ========================================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* =========================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================= */
  function initScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));

    /* Timeline special animation */
    if (timeline) {
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            timelineObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      timelineObserver.observe(timeline);
    }
  }

  /* =========================================================
     RIPPLE BUTTON EFFECT
     ========================================================= */
  function initRippleEffect() {
    rippleButtons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        ripple.classList.add('ripple');
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* =========================================================
     TESTIMONIAL SLIDER
     ========================================================= */
  let currentSlide = 0;
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const totalSlides = slides.length;
  let autoSlideInterval;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentSlide = index;
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  function initTestimonialSlider() {
    sliderNext.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    sliderPrev.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index, 10));
        resetAutoSlide();
      });
    });

    /* Touch/swipe support */
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoSlide();
      }
    }, { passive: true });

    startAutoSlide();
  }

  /* =========================================================
     BACK TO TOP
     ========================================================= */
  function initBackToTop() {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================
     SCROLL EVENT HANDLER (Throttled)
     ========================================================= */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        handleNavbarScroll();
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* =========================================================
     INITIALIZE ALL
     ========================================================= */
  function init() {
    initLoader();
    initStars();
    typeEffect();
    initParticles();
    initCursorGlow();
    initBackgroundParallax();
    initMobileNav();
    initSmoothScroll();
    initScrollReveal();
    initRippleEffect();
    initTestimonialSlider();
    initBackToTop();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', initStars);

    /* Initial calls */
    updateScrollProgress();
    handleNavbarScroll();
    updateActiveNavLink();
  }

  /* Run when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
