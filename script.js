document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('preload');

  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleText = document.querySelector('.theme-toggle-text');
  const profileImg = document.getElementById('profileImg');
  const sections = document.querySelectorAll('section[id]');
  const countElements = document.querySelectorAll('[data-count]');
  const meterBars = document.querySelectorAll('.meter span');
  const form = document.getElementById('contactForm');
  const revealElements = document.querySelectorAll('.reveal');

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (profileImg) {
      profileImg.src = theme === 'light' ? 'P3.jpeg' : 'P4.jpeg';
    }

    if (themeToggleText) {
      themeToggleText.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
    }
  }

  applyTheme(localStorage.getItem('portfolio-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('show');

      navAnchors.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener(
    'scroll',
    () => {
      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;

        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight
        ) {
          current = section.getAttribute('id');
        }
      });

      navAnchors.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    },
    { passive: true }
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.count) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 24));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = `${target}+`;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 45);

        observer.unobserve(el);
      });
    }, { threshold: 0.45 });

    countElements.forEach((el) => countObserver.observe(el));

    const meterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width || '0%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    meterBars.forEach((bar) => meterObserver.observe(bar));
  } else {
    revealElements.forEach((el) => el.classList.add('show'));
    countElements.forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      el.textContent = `${target}+`;
    });
    meterBars.forEach((bar) => {
      bar.style.width = bar.dataset.width || '0%';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = form.querySelector('button');
      if (!button) return;

      const originalText = button.textContent;
      button.textContent = 'Message Sent ✓';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        form.reset();
      }, 1800);
    });
  }

  requestAnimationFrame(() => {
    document.body.classList.remove('preload');
    document.body.classList.add('loaded');
  });
});