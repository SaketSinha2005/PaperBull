(function () {
  var modal = document.getElementById('authModal');
  if (!modal) return;

  var flip = modal.querySelector('[data-auth-flip]');

  function clearErrors() {
    modal.querySelectorAll('[data-signup-error], [data-login-error]').forEach(function (p) {
      p.textContent = '';
    });
  }

  function openModal(mode) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (mode === 'login') {
      flip.classList.add('is-flipped');
    } else {
      flip.classList.remove('is-flipped');
    }
    clearErrors();
    var headerMenu = document.querySelector('[data-header-menu]');
    if (headerMenu && !headerMenu.hidden) {
      var menuClose = document.querySelector('[data-header-menu-close]');
      if (menuClose) menuClose.click();
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modal.querySelectorAll('[data-auth-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  modal.querySelectorAll('[data-auth-flip-trigger]').forEach(function (el) {
    el.addEventListener('click', function () {
      flip.classList.toggle('is-flipped');
      clearErrors();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.indexOf('app.cryptowl.io/register') !== -1) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('signup');
      });
    } else if (href.indexOf('app.cryptowl.io/login') !== -1) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('login');
      });
    }
  });

  var heroCta = document.querySelector('.hero__content-cta');
  if (heroCta) {
    heroCta.addEventListener('click', function (e) {
      e.preventDefault();
      openModal('signup');
    });
  }

  modal.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.previousElementSibling;
      if (input && input.tagName === 'INPUT') {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  var signupForm = modal.querySelector('[data-signup-form]');
  var signupError = modal.querySelector('[data-signup-error]');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = '/dashboard/index.html';
    });
  }

  var loginForm = modal.querySelector('[data-login-form]');
  var loginError = modal.querySelector('[data-login-error]');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = '/dashboard/index.html';
    });
  }

  var googleBtn = modal.querySelector('[data-google-login]');
  if (googleBtn) {
    googleBtn.addEventListener('click', function () {
      window.location.href = '/dashboard/index.html';
    });
  }
})();
