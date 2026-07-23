const resp = await fetch('http://localhost:3000/api/audit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});
const data = await resp.json();
console.log('Overall score:', data.overallScore, 'Duration:', data.duration + 's\n');
for (const l of data.levels) {
  const issueCount = (l.issues || []).length;
  const dataKeys = l.data ? Object.keys(l.data) : [];
  console.log(`Level ${l.level}: ${l.name} | score=${l.score} | issues=${issueCount} | data_fields=${dataKeys.length}`);
  if (issueCount === 0 && dataKeys.length === 0) {
    console.log('  >>> EMPTY LEVEL - no analysis data');
  }
  if (issueCount === 0 && dataKeys.length < 3) {
    console.log('  >>> LOW OUTPUT (issues=0, fields=' + dataKeys.length + ')');
  }
  console.log(`  data keys: ${dataKeys.join(', ')}`);
  if (issueCount > 0) {
    for (const issue of l.issues.slice(0, 3)) {
      console.log(`  issue: ${issue.severity} - ${issue.message.substring(0, 100)}...`);
    }
    if (l.issues.length > 3) console.log(`  ... and ${l.issues.length - 3} more issues`);
  }
  console.log('');
}
process.exit(0);
