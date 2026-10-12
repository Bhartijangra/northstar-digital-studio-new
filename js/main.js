
 // Menu toggle, single-open FAQ, back-to-top
const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');

btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }
});

document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
  if (d.open) d.parentElement.querySelectorAll('details').forEach(o => {
    if (o !== d) o.open = false;
  });
}));

const topBtn = document.getElementById('top');

window.addEventListener('scroll', () => {
  topBtn.hidden = window.scrollY < 400;
});

topBtn.addEventListener('click', () => window.scrollTo({ top: 0 }));
