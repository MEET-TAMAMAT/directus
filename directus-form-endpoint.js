// Directus Custom Endpoint for Sales Rep Form
// Place in: extensions/endpoints/sales-form/index.js

export default function(router) {
  router.get('/sales-rep-form', async (req, res) => {
    const theme = req.query.theme || 'light';

    // Set proper headers to allow inline styles/scripts
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:;");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // Your complete HTML with embedded CSS/JS
    const html = \`<!DOCTYPE html>
<html lang="en" data-theme="\${theme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Rep Registration - TAMAMAT</title>
    <style>
        /* Your CSS here - will work with proper CSP headers */
        body { background: \${theme === 'dark' ? '#0f172a' : '#ffffff'}; }
        /* Add rest of your CSS... */
    </style>
</head>
<body>
    <h1>Sales Rep Form - Theme: \${theme}</h1>
    <p>This is served via custom endpoint with proper CSP headers.</p>
</body>
</html>\`;

    res.send(html);
  });
}