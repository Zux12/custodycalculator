const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve /public first
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff')
}));

// Also expose project root for /logo.pjg (as requested)
app.use(express.static(__dirname, {
  extensions: ['jpg','jpeg','png','pjg'] // allow logo.pjg path
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

// Root -> index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Asianloop calculator running on :${PORT}`));
