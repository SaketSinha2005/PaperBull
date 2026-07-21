(function () {
  var modal = document.getElementById('authModal');
  if (!modal) return;

  // Backend API base URL — the paperbull-node Express server (default port 8000).
  // Change this if you run the backend on a different host/port.
  var API_BASE = 'http://localhost:8000';

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
    if (href.indexOf('app.paperbull.io/register') !== -1) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('signup');
      });
    } else if (href.indexOf('app.paperbull.io/login') !== -1) {
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

  function setSubmitting(form, isSubmitting) {
    var btn = form.querySelector('.auth-modal__submit');
    if (!btn) return;
    if (isSubmitting) {
      btn.dataset.originalLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Please wait…';
    } else {
      btn.disabled = false;
      if (btn.dataset.originalLabel) btn.textContent = btn.dataset.originalLabel;
    }
  }

  function saveSessionUser(user) {
    // Shape expected by frontend/dashboard/dashboard.js
    localStorage.setItem('paperbull_user', JSON.stringify({
      fullName: user.display_name || '',
      email: user.email || '',
      balance: typeof user.virtual_balance === 'number' ? user.virtual_balance : 100000
    }));
  }

  var signupForm = modal.querySelector('[data-signup-form]');
  var signupError = modal.querySelector('[data-signup-error]');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (signupError) signupError.textContent = '';

      var firstName = (document.getElementById('signupFullName') || {}).value || '';
      var lastName = (document.getElementById('signupUsername') || {}).value || '';
      var email = (document.getElementById('signupEmail') || {}).value || '';
      var password = (document.getElementById('signupPassword') || {}).value || '';
      var confirm = (document.getElementById('signupConfirm') || {}).value || '';
      var displayName = (firstName + ' ' + lastName).trim();

      if (password !== confirm) {
        if (signupError) signupError.textContent = 'Passwords do not match.';
        return;
      }

      setSubmitting(signupForm, true);

      fetch(API_BASE + '/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          email: email,
          password: password
        })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          setSubmitting(signupForm, false);
          if (!result.ok) {
            if (signupError) signupError.textContent = result.data.message || result.data.error || 'Signup failed.';
            return;
          }
          var newUser = (result.data && result.data.user) || {};
          saveSessionUser({
            display_name: newUser.fullName || displayName,
            email: newUser.email || email,
            virtual_balance: typeof newUser.balance === 'number' ? newUser.balance : 100000
          });
          window.location.href = '/dashboard/index.html';
        })
        .catch(function () {
          setSubmitting(signupForm, false);
          if (signupError) signupError.textContent = 'Could not reach the server. Is the backend running?';
        });
    });
  }

  var loginForm = modal.querySelector('[data-login-form]');
  var loginError = modal.querySelector('[data-login-error]');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (loginError) loginError.textContent = '';

      var email = (document.getElementById('loginEmail') || {}).value || '';
      var password = (document.getElementById('loginPassword') || {}).value || '';

      setSubmitting(loginForm, true);

      fetch(API_BASE + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          setSubmitting(loginForm, false);
          if (!result.ok) {
            if (loginError) loginError.textContent = result.data.message || result.data.error || 'Login failed.';
            return;
          }
          saveSessionUser(result.data.user);
          window.location.href = '/dashboard/index.html';
        })
        .catch(function () {
          setSubmitting(loginForm, false);
          if (loginError) loginError.textContent = 'Could not reach the server. Is the backend running?';
        });
    });
  }

  var googleBtn = modal.querySelector('[data-google-login]');
  if (googleBtn) {
    googleBtn.addEventListener('click', function () {
      window.location.href = API_BASE + '/api/auth/google';
    });
  }

  // If we just bounced back from a failed Google login, surface the error.
  (function handleGoogleAuthError() {
    var params = new URLSearchParams(window.location.search);
    var error = params.get('error');
    if (error === 'google_auth_failed') {
      openModal('login');
      if (loginError) loginError.textContent = 'Google sign-in failed. Please try again.';
      params.delete('error');
      var cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, document.title, cleanUrl);
    }
  })();
})();
