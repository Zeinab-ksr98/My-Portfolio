
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

const btn = document.getElementById('button');

document.getElementById('contact-form')
    .addEventListener('submit', function(event) {
        event.preventDefault();

        btn.value = 'Sending...';

        const serviceID = 'service_1btmddm';
        const templateID = 'template_gxtvdfr';


        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Send Email';
                alert('Sent!');
            }, (err) => {
                btn.value = 'Send Email';
                alert(JSON.stringify(err));
            });
    });
//
