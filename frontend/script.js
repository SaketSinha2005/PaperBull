document.addEventListener('DOMContentLoaded', ()=>{
  const pills=document.querySelectorAll('.pill-tabs .pill');
  pills.forEach(pill=>{
    pill.addEventListener('click', ()=>{
      pills.forEach(p=>p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  const navLinks=document.querySelectorAll('.nav-link');
  navLinks.forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      navLinks.forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
