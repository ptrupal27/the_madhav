import './bootstrap';
fetch('/api/hello')
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById('api-status');
    if (el) el.textContent = JSON.stringify(d);
    console.log('API hello', d);
  })
  .catch(err => console.error('API error', err));
