// Shamaz Hooda Portfolio - Enhanced UX
(function() {
  'use strict';

  // Theme Management
  function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle event
    if (toggle) {
      toggle.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add animation feedback
        toggle.style.transform = 'scale(0.9)';
        setTimeout(function() {
          toggle.style.transform = 'scale(1)';
        }, 100);
      });
    }
  }
  
  function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
      icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }

  // Intersection Observer for Animations
  function initAnimations() {
    if (!window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe animated elements
    const animatedElements = document.querySelectorAll(
      '.expertise-card, .skill-category, .experience-item, .education-card, .soft-skills'
    );
    
    animatedElements.forEach(function(el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.transitionDelay = (index * 0.1) + 's';
      observer.observe(el);
    });
  }

  // Enhanced Interactions
  function initInteractions() {
    // Skill chip hover effects
    const skillItems = document.querySelectorAll('.skill-item, .tech-tag');
    skillItems.forEach(function(item) {
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(btn) {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-1px)';
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });

    // Card hover effects
    const cards = document.querySelectorAll('.expertise-card, .experience-item, .education-card');
    cards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // Smooth Scrolling
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          const headerHeight = document.querySelector('.site-header').offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Mobile Touch Enhancements
  function initMobileEnhancements() {
    // Add touch feedback for mobile
    const touchElements = document.querySelectorAll('button, .btn, .skill-item, .tech-tag, .contact-link');
    
    touchElements.forEach(function(el) {
      el.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
        this.style.transition = 'transform 0.1s ease';
      });
      
      el.addEventListener('touchend', function() {
        this.style.transform = '';
      });
      
      el.addEventListener('touchcancel', function() {
        this.style.transform = '';
      });
    });

    // Handle viewport changes
    function updateViewport() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', function() {
      setTimeout(updateViewport, 100);
    });
  }

  // Performance Optimizations
  function initPerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img');
    
    if ('loading' in HTMLImageElement.prototype) {
      images.forEach(function(img) {
        img.loading = 'lazy';
      });
    } else if (window.IntersectionObserver) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
  }

  // Accessibility Enhancements
  function initAccessibility() {
    // Keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(function(el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (this.tagName === 'BUTTON' || (this.tagName === 'A' && this.href)) {
            return; // Let default behavior handle it
          }
          e.preventDefault();
          this.click();
        }
      });
    });

    // Focus management
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-navigation');
    });

    // Reading progress
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--brand);
      z-index: 1000;
      transition: width 0.25s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
      const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = Math.min(scrolled, 100) + '%';
    });
  }

  // Initialize everything when DOM is ready
  function init() {
    initTheme();
    initAnimations();
    initInteractions();
    initSmoothScroll();
    initMobileEnhancements();
    initPerformance();
    initAccessibility();

    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Add loaded class
    document.body.classList.add('loaded');

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 2px solid var(--brand) !important;
        outline-offset: 2px !important;
      }
      
      @media (max-width: 767px) {
        .hero-title { animation-delay: 0.2s; }
        .hero-subtitle { animation-delay: 0.4s; }
        .hero-tagline { animation-delay: 0.6s; }
      }
    `;
    document.head.appendChild(style);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Error handling
  window.addEventListener('error', function(e) {
    console.error('Portfolio error:', e.error);
  });

})();