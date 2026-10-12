// SEO Lab. Data saved in localStorage only.
const $ = id => document.getElementById(id);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
function csv(rows, name) {
  const text = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); a.download = name; a.click();
}
// 1 Snippet preview
function preview() {
  const t = $('pt').value, d = $('pd').value;
  $('st').textContent = t; $('sd').textContent = d; $('su').textContent = $('pu').value;
  $('ptc').textContent = t.length + ' chars' + (t.length < 30 ? ' (short)' : t.length > 60 ? ' (may be cut off)' : ' (good length)');
  $('pdc').textContent = d.length + ' chars' + (d.length < 70 ? ' (short)' : d.length > 160 ? ' (may be cut off)' : ' (good length)');
}
['pt', 'pd', 'pu'].forEach(i => $(i).addEventListener('input', preview)); preview();
// 2 Keyword map
let kws = load('ns_kw', []), sortKey = 0;
function drawK() {
  const rows = [...kws].sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])));
  $('kt-table').tBodies[0].innerHTML = rows.map(r => '<tr>' + r.map(c => '<td>' + c.replace(/</g, '&lt;') + '</td>').join('') + '</tr>').join('') || '<tr><td colspan="5">No keywords yet. Add one above.</td></tr>';
}
$('kf').addEventListener('submit', e => {
  e.preventDefault();
  kws.push([$('kw').value, $('ki').value, $('kp').value, $('kt').value, $('kc').value]);
  save('ns_kw', kws); e.target.reset(); drawK();
});
document.querySelectorAll('.sort').forEach(b => b.addEventListener('click', () => { sortKey = +b.dataset.k; drawK(); }));
$('kexp').addEventListener('click', () => csv([['Keyword', 'Intent', 'Priority', 'Page', 'Cluster'], ...kws], 'keyword-map.csv')); drawK();
// 3 On-page checker
$('cb').addEventListener('click', () => {
  const t = $('ct').value, h = $('ch').value, k = $('ck').value.toLowerCase(), out = [];
  out.push(t.length >= 30 && t.length <= 60 ? 'Pass: title length is fine.' : 'Fix: aim for about 30-60 characters in the title.');
  out.push(k && t.toLowerCase().includes(k) ? 'Pass: keyword is in the title.' : 'Fix: put the primary keyword in the title.');
  out.push(k && h.toLowerCase().includes(k) ? 'Pass: keyword is in the H1.' : 'Fix: include the keyword in the H1.');
  out.push(+$('cw').value >= 300 ? 'Pass: enough content.' : 'Fix: pages under 300 words are often thin.');
  out.push(+$('ca').value > 0 ? 'Pass: images have alt text.' : 'Fix: add descriptive alt text.');
  out.push(+$('cl').value >= 3 ? 'Pass: internal links present.' : 'Fix: add more internal links.');
  $('cr').innerHTML = out.map(x => '<li>' + x + '</li>').join('');
});
// 4 Audit tracker
let audit = load('ns_audit', [['Duplicate title tags', 'On-page', 'High', 'Open', 'Write unique titles'], ['No XML sitemap', 'Technical', 'Medium', 'Open', 'Create and submit a sitemap'], ['Thin service pages', 'Content', 'High', 'Open', 'Expand with useful detail']]);
function drawA() {
  const f = $('af').value;
  $('at').tBodies[0].innerHTML = audit.map((r, i) => f === 'All' || r[3] === f ? '<tr>' + r.map((c, j) => j === 3 ? '<td><button class="chip" data-i="' + i + '">' + c + '</button></td>' : '<td>' + c + '</td>').join('') + '</tr>' : '').join('');
  document.querySelectorAll('#at .chip').forEach(b => b.addEventListener('click', () => { audit[b.dataset.i][3] = audit[b.dataset.i][3] === 'Open' ? 'Done' : 'Open'; save('ns_audit', audit); drawA(); }));
}
$('af').addEventListener('change', drawA); drawA();
$('aexp').addEventListener('click', () => csv([['Issue', 'Category', 'Priority', 'Status', 'Fix'], ...audit], 'seo-audit.csv'));
// 5 KPI calculator
function kpi() {
  const n = id => parseFloat($(id).value) || 0, div = (a, b, m, u) => b > 0 ? (a / b * m).toFixed(2) + u : 'Cannot divide by zero';
  $('kr').innerHTML = ['CTR = clicks / impressions x 100: ' + div(n('k2'), n('k1'), 100, '%'), 'Conversion rate = conversions / sessions x 100: ' + div(n('k4'), n('k3'), 100, '%'), 'CPC = spend / clicks: ' + div(n('k5'), n('k2'), 1, ''), 'CPL = spend / leads (conversions): ' + div(n('k5'), n('k4'), 1, ''), 'ROAS = revenue / spend: ' + div(n('k6'), n('k5'), 1, 'x')].map(x => '<li>' + x + '</li>').join('');
}
document.querySelectorAll('.kpi input').forEach(i => i.addEventListener('input', kpi)); kpi();
// 6 Glossary
const G = { SEO: 'Improving a site to earn more unpaid search traffic.', SERP: 'The search engine results page.', Crawling: 'Bots discovering pages by following links.', Indexing: 'Storing pages so they can appear in results.', 'Search intent': 'The goal behind a search.', 'Keyword difficulty': 'An estimate of how hard it is to rank.', 'Canonical URL': 'The preferred version of a page.', Sitemap: 'A file listing your URLs.', 'robots.txt': 'A file telling bots which areas to crawl.', Backlink: 'A link from another site to yours.', 'Anchor text': 'The clickable words of a link.', CTR: 'Clicks divided by impressions.', Impressions: 'Times a result was shown.', 'Organic traffic': 'Visits from unpaid results.', 'Conversion rate': 'Share of visits that complete a goal.', 'Core Web Vitals': 'Google metrics for loading, interactivity and stability.', 'Schema markup': 'Structured data describing page content.', 'E-E-A-T': 'Experience, expertise, authoritativeness and trust.' };
function drawG() { const q = $('gq').value.toLowerCase(); $('gl').innerHTML = Object.entries(G).filter(([k, v]) => (k + v).toLowerCase().includes(q)).map(([k, v]) => '<dt><b>' + k + '</b></dt><dd>' + v + '</dd>').join('') || '<dd>No terms found.</dd>'; }
$('gq').addEventListener('input', drawG); drawG();
// 7 Challenge and reset
$('pb').addEventListener('click', () => { $('pm').hidden = false; save('ns_progress', 'beginner-title-done'); });
$('reset').addEventListener('click', () => { if (confirm('Clear all saved Lab data?')) { ['ns_kw', 'ns_audit', 'ns_progress'].forEach(k => localStorage.removeItem(k)); location.reload(); } });
