const resp = await fetch('http://localhost:3000/api/audit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://en.wikipedia.org/wiki/SEO' })
});
const data = await resp.json();
console.log('Score:', data.overallScore, 'Duration:', data.duration + 's\n');
for (const l of data.levels) {
  const ic = (l.issues || []).length;
  const dk = l.data ? Object.keys(l.data).length : 0;
  const status = ic === 0 && dk < 5 ? 'WEAK' : ic > 0 || dk >= 5 ? 'OK' : 'CHECK';
  console.log(`L${String(l.level).padStart(2)}: ${l.name.padEnd(40)} score=${l.score} issues=${ic} fields=${dk} ${status}`);
}
process.exit(0);
