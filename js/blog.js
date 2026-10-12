// Blog search and category filter
const posts = document.querySelectorAll('.post'), q = document.getElementById('q');
let cat = 'all';
function show() {
  let n = 0;
  posts.forEach(p => {
    const ok = (cat === 'all' || p.dataset.cat === cat) && p.textContent.toLowerCase().includes(q.value.toLowerCase());
    p.hidden = !ok; if (ok) n++;
  });
  document.getElementById('empty').hidden = n > 0;
}
q.addEventListener('input', show);
document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
  c.classList.add('on'); cat = c.dataset.cat; show();
}));
