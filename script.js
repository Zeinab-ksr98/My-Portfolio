
//Light/dark theme toggle
(function () {
  var STORAGE_KEY = 'portfolio-theme';
  var root = document.documentElement;
  var toggles = [document.getElementById('themeToggle'), document.getElementById('themeToggleDesktop')]
    .filter(function (el) { return !!el; });

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    var label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    var iconClass = theme === 'light' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
    toggles.forEach(function (el) {
      var icon = el.querySelector('i');
      if (icon) {
        var hasNavicon = icon.className.indexOf('navicon') !== -1;
        icon.setAttribute('class', hasNavicon ? iconClass + ' navicon' : iconClass);
      }
      el.setAttribute('aria-label', label);
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyTheme(saved === 'light' ? 'light' : 'dark');

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  });
})();

//Mobile nav toggle
(function () {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mobileNav');
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openNav() {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
})();

//Scroll-reveal for sections
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  els.forEach(function (el) { observer.observe(el); });
})();

//Scrollspy: highlight the sidebar nav link for the section in view,
//swap the scroll-tracker icon to match (code brackets while browsing
//code-related sections, a robot in Robotics, arrow elsewhere), and
//tint the fixed sidebar's background to match that section's tone.
(function () {
  var navLinks = document.querySelectorAll('#navmenu a[href^="#"]');
  if (!navLinks.length || !('IntersectionObserver' in window)) return;

  var sectionIcons = {
    home: 'bi-arrow-up',
    certificates: 'bi-code-slash',
    projects: 'bi-code-slash',
    robotics: 'bi-robot',
    contact: 'bi-arrow-up'
  };
  var sectionBg = {
    home: 'var(--bg)',
    certificates: 'var(--bg-alt)',
    projects: 'var(--bg)',
    robotics: 'var(--bg-alt)',
    contact: 'var(--bg)'
  };
  var scrollUpIcon = document.getElementById('scrollUpIcon');
  var header = document.getElementById('header');

  var sections = [];
  navLinks.forEach(function (link) {
    var section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) sections.push({ link: link, section: section });
  });
  if (!sections.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var match = sections.find(function (s) { return s.section === entry.target; });
      if (!match) return;
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      match.link.classList.add('active');

      var iconName = sectionIcons[match.section.id];
      if (scrollUpIcon && iconName) {
        scrollUpIcon.setAttribute('class', 'bi ' + iconName + ' scroll-up-icon');
      }

      var bg = sectionBg[match.section.id];
      if (header && bg) {
        header.style.backgroundColor = bg;
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(function (s) { observer.observe(s.section); });
})();

//Hero cursor-follow spotlight
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var hero = document.getElementById('home');
  var spotlight = document.getElementById('heroSpotlight');
  if (!hero || !spotlight) return;

  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    spotlight.style.setProperty('--spot-x', x + '%');
    spotlight.style.setProperty('--spot-y', y + '%');
  });
})();

var scrollProgressFill = document.getElementById('scrollProgressFill');
var RING_CIRCUMFERENCE = 125.6;

$(document).ready(function () {
    $(window).scroll(function () {
        //  sticky navbar on scroll script  //
        if (this.scrollY > 20) {
            $(".navbar").addClass("sticky");
        } else {
            $(".navbar").removeClass("sticky");
        }

        //  scroll-up button show/hide script  //
        if (this.scrollY > 500) {
            $(".scroll-up-btn").addClass("show");
        } else {
            $(".scroll-up-btn").removeClass("show");
        }

        //  scroll-tracker progress ring  //
        if (scrollProgressFill) {
            var scrollable = document.documentElement.scrollHeight - window.innerHeight;
            var pct = scrollable > 0 ? Math.min(Math.max(this.scrollY / scrollable, 0), 1) : 0;
            scrollProgressFill.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - pct);
        }
    });

    //  slide-up script  //

    $(".scroll-up-btn").click(function () {
        $("html").animate({ scrollTop: 0 });
        //  removing smooth scroll on slide-up button click  //
        $("html").css("scrollBehavior", "auto");
    });

    $(".navbar .menu li a").click(function () {
        //  Smooth scroll on Menu Items click  //

        $("html").css("scrollBehavior", "smooth");
    });

    //  Toggle Navbar  //

    $(".menu-btn").click(function () {
        $(".navbar .menu").toggleClass("active");
        $(".menu-btn i").toggleClass("active");
    });

    //  Typing Text Animation  //

    var typed = new Typed(".typing", {
        strings: [
            "Backend Developer",
            "Robotics Trainer",
            "CS Grad"
        ],
        typeSpeed: 100,
        backSpeed: 70,
        loop: true
    });
});

//Contact form: validate the email, send via EmailJS, show a popup with the result
(function () {
    var form = document.getElementById('contact-form');
    var btn = document.getElementById('button');
    var emailInput = document.getElementById('email');
    if (!form || !btn || !emailInput) return;

    var BTN_LABEL = btn.textContent;
    var EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    var COMMON_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];

    var errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.setAttribute('role', 'alert');
    emailInput.parentNode.appendChild(errorEl);

    function distance(a, b) {
        var prev = [], i, j;
        for (j = 0; j <= b.length; j++) prev[j] = j;
        for (i = 1; i <= a.length; i++) {
            var cur = [i];
            for (j = 1; j <= b.length; j++) {
                cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
            }
            prev = cur;
        }
        return prev[b.length];
    }

    // Returns an error message, or '' when the address looks right.
    function checkEmail(value) {
        value = value.trim();
        if (!value) return 'Please enter your email address.';
        if (!EMAIL_RE.test(value) || value.indexOf('..') !== -1) {
            return 'That email doesn’t look right. It should look like name@example.com.';
        }
        var domain = value.split('@')[1].toLowerCase();
        if (COMMON_DOMAINS.indexOf(domain) === -1) {
            for (var i = 0; i < COMMON_DOMAINS.length; i++) {
                if (distance(domain, COMMON_DOMAINS[i]) <= 2) {
                    return 'Did you mean ' + value.split('@')[0] + '@' + COMMON_DOMAINS[i] + '?';
                }
            }
        }
        return '';
    }

    // Resolves false only when DNS says the domain can't receive mail; any
    // lookup failure (offline, blocked, timeout) resolves true so real visitors
    // are never blocked by a flaky check.
    function dnsAnswers(domain, type) {
        var ctrl = 'AbortController' in window ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 4000);
        return fetch('https://dns.google/resolve?name=' + encodeURIComponent(domain) + '&type=' + type,
                     ctrl ? { signal: ctrl.signal } : undefined)
            .then(function (r) { return r.json(); })
            .then(function (d) { clearTimeout(timer); return d; });
    }

    function domainCanReceiveMail(domain) {
        return dnsAnswers(domain, 'MX').then(function (d) {
            var mx = (d.Answer || []).filter(function (a) { return a.type === 15; });
            if (mx.length) {
                // A single "0 ." record is the standard way to say "this domain accepts no mail".
                var nullMx = mx.length === 1 && /^0\s+\.?$/.test(mx[0].data.trim());
                return !nullMx;
            }
            if (d.Status === 3) return false; // NXDOMAIN: domain doesn't exist
            // No MX: mail can still be delivered to the domain's A record.
            return dnsAnswers(domain, 'A').then(function (a) {
                return a.Status !== 3 && !!(a.Answer && a.Answer.length);
            });
        }).catch(function () { return true; });
    }

    function showError(msg) {
        errorEl.textContent = msg;
        var field = emailInput.parentNode;
        field.style.marginBottom = msg ? (errorEl.offsetHeight + 4 + 15) + 'px' : '';
        emailInput.classList.toggle('invalid', !!msg);
        emailInput.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }

    emailInput.addEventListener('input', function () {
        if (errorEl.textContent) showError('');
    });

    function popup(type, title, text) {
        var overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML =
            '<div class="popup popup--' + type + '" role="dialog" aria-modal="true" aria-labelledby="popupTitle">' +
            '<div class="popup-icon"><i class="bi ' + (type === 'success' ? 'bi-check-lg' : 'bi-x-lg') + '"></i></div>' +
            '<h3 id="popupTitle"></h3><p></p>' +
            '<button type="button" class="popup-close">OK</button></div>';
        overlay.querySelector('h3').textContent = title;
        overlay.querySelector('p').textContent = text;

        function close() {
            document.removeEventListener('keydown', onKey);
            overlay.remove();
        }
        function onKey(e) { if (e.key === 'Escape') close(); }

        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
        overlay.querySelector('.popup-close').addEventListener('click', close);
        document.addEventListener('keydown', onKey);
        document.body.appendChild(overlay);
        overlay.querySelector('.popup-close').focus();
    }

    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var problem = checkEmail(emailInput.value);
        if (problem) {
            showError(problem);
            emailInput.focus();
            return;
        }
        showError('');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Checking email...';

        domainCanReceiveMail(emailInput.value.trim().split('@')[1])
            .then(function (ok) {
                if (!ok) {
                    showError('We couldn’t find a mail server for that address. Please check the spelling after the @.');
                    emailInput.focus();
                    return null;
                }
                btn.textContent = 'Sending...';
                return emailjs.sendForm('service_1btmddm', 'template_gxtvdfr', form);
            })
            .then(function (result) {
                if (result === null) return;
                form.reset();
                popup('success', 'Message sent!', 'Thank you for reaching out. I’ll get back to you soon.');
            }, function () {
                popup('error', 'Couldn’t send your message', 'Something went wrong on our end. Please try again in a moment, or reach me on LinkedIn.');
            })
            .then(function () {
                btn.disabled = false;
                btn.textContent = BTN_LABEL;
            });
    });
})();
