// Enhanced portfolio with responsive UX and accessibility
(function () {
  'use strict';

  // ===== THEME MANAGEMENT =====
  const themeManager = {
    toggle: document.getElementById('themeToggle'),
    
    init() {
      // Set initial theme
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      const initialTheme = savedTheme || systemTheme;
      
      this.setTheme(initialTheme);
      this.bindEvents();
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update toggle icon
      const icon = this.toggle?.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
    },

    bindEvents() {
      this.toggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.setTheme(newTheme);
        this.animateToggle();
      });

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'light' : 'dark');
        }
      });
    },

    animateToggle() {
      this.toggle.style.transform = 'scale(0.9)';
      this.toggle.style.transition = 'transform 0.1s ease';
      
      setTimeout(() => {
        this.toggle.style.transform = 'scale(1)';
      }, 100);
      
      setTimeout(() => {
        this.toggle.style.transition = '';
      }, 200);
    }
  };

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  const animationObserver = {
    observer: null,

    init() {
      if (!window.IntersectionObserver) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      this.observeElements();
    },

    observeElements() {
      const elements = document.querySelectorAll(`
        .expertise-card,
        .skill-category,
        .experience-item,
        .education-card,
        .soft-skills,
        .contact-link
      `);

      elements.forEach((el, index) => {
        // Add staggered delay
        el.style.setProperty('--animation-delay', `${index * 0.1}s`);
        this.observer.observe(el);
      });
    }
  };

  // ===== SMOOTH SCROLLING =====
  const smoothScroll = {
    init() {
      // Handle anchor links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // ===== ENHANCED INTERACTIONS =====
  const interactions = {
    init() {
      this.enhanceSkillChips();
      this.enhanceTechTags();
      this.enhanceButtons();
      this.addKeyboardNavigation();
    },

    enhanceSkillChips() {
      const chips = document.querySelectorAll('.skill-item, .tech-tag');
      
      chips.forEach(chip => {
        // Add hover sound effect (visual feedback)
        chip.addEventListener('mouseenter', () => {
          chip.style.transform = 'translateY(-2px) scale(1.05)';
          chip.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        chip.addEventListener('mouseleave', () => {
          chip.style.transform = '';
        });

        // Add click ripple effect
        chip.addEventListener('click', (e) => {
          this.createRipple(e, chip);
        });
      });
    },

    enhanceTechTags() {
      const tags = document.querySelectorAll('.tech-tag');
      
      tags.forEach(tag => {
        tag.addEventListener('click', () => {
          // Could integrate with search or filtering in future
          console.log(`Clicked technology: ${tag.textContent}`);
        });
      });
    },

    enhanceButtons() {
      const buttons = document.querySelectorAll('.btn');
      
      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.createRipple(e, button);
        });

        // Add loading state for external links
        if (button.target === '_blank') {
          button.addEventListener('click', () => {
            button.style.opacity = '0.7';
            setTimeout(() => {
              button.style.opacity = '';
            }, 300);
          });
        }
      });
    },

    createRipple(event, element) {
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
      `;

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    },

    addKeyboardNavigation() {
      // Enhanced keyboard navigation for accessibility
      const focusableElements = document.querySelectorAll(`
        a[href],
        button,
        [tabindex]:not([tabindex="-1"])
      `);

      focusableElements.forEach(el => {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (el.tagName === 'BUTTON' || (el.tagName === 'A' && el.href)) {
              // Let default behavior handle it
              return;
            }
            e.preventDefault();
            el.click();
          }
        });
      });
    }
  };

  // ===== PERFORMANCE OPTIMIZATIONS =====
  const performance = {
    init() {
      this.optimizeImages();
      this.addLoadingStates();
      this.preloadCriticalAssets();
    },

    optimizeImages() {
      const images = document.querySelectorAll('img');
      
      if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading support
        images.forEach(img => {
          if (!img.loading) {
            img.loading = 'lazy';
          }
        });
      } else {
        // Fallback intersection observer for lazy loading
        this.lazyLoadImages(images);
      }
    },

    lazyLoadImages(images) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    },

    addLoadingStates() {
      // Add loading states for external resources
      const externalLinks = document.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        link.addEventListener('click', () => {
          link.setAttribute('aria-busy', 'true');
          setTimeout(() => {
            link.removeAttribute('aria-busy');
          }, 1000);
        });
      });
    },

    preloadCriticalAssets() {
      // Preload critical fonts and images
      const criticalAssets = [
        'https://github.com/shamazhooda.png'
      ];

      criticalAssets.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = url.includes('.png') || url.includes('.jpg') ? 'image' : 'font';
        link.href = url;
        if (link.as === 'font') link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  };

  // ===== ACCESSIBILITY ENHANCEMENTS =====
  const accessibility = {
    init() {
      this.addSkipLinks();
      this.enhanceFocusManagement();
      this.addAriaLabels();
      this.handleReducedMotion();
    },

    addSkipLinks() {
      const skipLink = document.createElement('a');
      skipLink.href = '#main';
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'skip-link sr-only';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--brand-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
      `;

      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });

      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });

      document.body.insertBefore(skipLink, document.body.firstChild);
    },

    enhanceFocusManagement() {
      // Add focus indicators for keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
      });
    },

    addAriaLabels() {
      // Enhance existing elements with better accessibility
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading && !section.getAttribute('aria-labelledby')) {
          heading.id = heading.id || `${section.id}-heading`;
          section.setAttribute('aria-labelledby', heading.id);
        }
      });

      // Add progress indicator for long content
      this.addReadingProgress();
    },

    addReadingProgress() {
      const progressBar = document.createElement('div');
      progressBar.className = 'reading-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--brand-primary);
        z-index: 1000;
        transition: width 0.25s ease-out;
      `;

      document.body.appendChild(progressBar);

      window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
      });
    },

    handleReducedMotion() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
      }
    }
  };

  // ===== MOBILE OPTIMIZATIONS =====
  const mobile = {
    init() {
      this.addTouchFeedback();
      this.optimizeViewport();
      this.handleOrientationChange();
    },

    addTouchFeedback() {
      // Add haptic-like feedback for touch devices
      const interactiveElements = document.querySelectorAll('button, .btn, .skill-item, .tech-tag');
      
      interactiveElements.forEach(el => {
        el.addEventListener('touchstart', () => {
          el.style.transform = 'scale(0.98)';
        });

        el.addEventListener('touchend', () => {
          el.style.transform = '';
        });

        el.addEventListener('touchcancel', () => {
          el.style.transform = '';
        });
      });
    },

    optimizeViewport() {
      // Handle viewport changes on mobile
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    },

    handleOrientationChange() {
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          // Recalculate viewport after orientation change
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
      });
    }
  };

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    themeManager.init();
    animationObserver.init();
    smoothScroll.init();
    interactions.init();
    performance.init();
    accessibility.init();
    mobile.init();

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }

    // Add loaded class for any CSS transitions
    document.body.classList.add('loaded');

    // Add custom CSS for animations and interactions
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      .animate-in {
        animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        animation-delay: var(--animation-delay, 0s);
      }

      .keyboard-navigation *:focus {
        outline: 2px solid var(--brand-primary) !important;
        outline-offset: 2px !important;
      }

      .skip-link:focus {
        clip: auto !important;
        height: auto !important;
        width: auto !important;
        position: absolute !important;
        overflow: visible !important;
      }

      @media (max-width: 768px) {
        .hero-title {
          animation-delay: 0.2s;
        }
        
        .hero-subtitle {
          animation-delay: 0.4s;
        }
        
        .hero-tagline {
          animation-delay: 0.6s;
        }
      }
    `;
    document.head.appendChild(style);
  });

  // ===== ERROR HANDLING =====
  window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
    // Could send to analytics in production
  });

  // ===== EXPORT FOR TESTING =====
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      themeManager,
      animationObserver,
      interactions,
      performance,
      accessibility,
      mobile
    };
  }

})();