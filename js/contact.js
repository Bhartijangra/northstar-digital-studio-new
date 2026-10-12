// Contact form validation (demo only, nothing is sent)
const form = document.getElementById('cf');
form.addEventListener('submit', e => {
  e.preventDefault();
  const set = (id, msg) => { document.getElementById('e-' + id).textContent = msg; return !msg; };
  const email = document.getElementById('email').value;
  let ok = true;
  ok = set('name', document.getElementById('name').value.trim() ? '' : 'Please enter your name.') && ok;
  ok = set('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? '' : 'Enter a valid email address.') && ok;
  ok = set('msg', document.getElementById('msg').value.trim().length >= 10 ? '' : 'Message must be at least 10 characters.') && ok;
  ok = set('consent', document.getElementById('consent').checked ? '' : 'Please tick the consent box.') && ok;
  document.getElementById('ok').hidden = !ok;
  if (ok) form.reset();
});
