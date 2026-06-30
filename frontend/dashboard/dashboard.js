document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('paperbull_user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const avatar = document.querySelector('.avatar');

      if (avatar && user.fullName) {
        avatar.textContent = user.fullName.trim().charAt(0).toUpperCase();
      }

      const moneyAmount = document.querySelector('.money-amount');

      if (moneyAmount && typeof user.balance === 'number') {
        moneyAmount.textContent = '₹' + user.balance.toLocaleString('en-IN');
      }
    } catch (err) {}
  }

  const pills = document.querySelectorAll('.pill-tabs .pill');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
