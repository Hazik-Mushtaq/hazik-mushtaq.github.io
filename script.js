
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

    function applyTheme(theme) {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);

      if (profileImg) {
        profileImg.src = theme === 'light'
          ? 'P3.jpeg'
          : 'P4.jpeg';
      }

      if (themeToggleText) {
        themeToggleText.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
      }
    }

    applyTheme(localStorage.getItem('portfolio-theme') || 'dark');

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
      });
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
      });
    }

    navAnchors.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        navAnchors.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      });
    });

    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navAnchors.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 20));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 50);

        countObserver.unobserve(el);
      });
    }, { threshold: 0.6 });

    countElements.forEach(el => countObserver.observe(el));

    const meterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          meterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    meterBars.forEach(bar => meterObserver.observe(bar));

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = form.querySelector('button');
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
