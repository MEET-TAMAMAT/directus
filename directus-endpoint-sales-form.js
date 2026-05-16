// Directus Custom Endpoint - Sales Rep Form
// Place this file in: extensions/endpoints/sales-form/index.js

import fs from 'fs';
import path from 'path';

export default function(router, { env, logger }) {
  // Sales Rep Form Endpoint
  router.get('/forms/form_sales_rep', async (req, res) => {
    try {
      const theme = req.query.theme || 'light';

      // Log form access for analytics
      logger.info('Sales Rep form accessed', {
        theme,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer')
      });

      // Read the HTML template
      // In production, you'll put the HTML content here or read from a file
      const htmlContent = getSalesRepFormHTML(theme);

      // Set security headers
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Cache control for better performance
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes

      res.send(htmlContent);

    } catch (error) {
      logger.error('Error serving sales rep form', { error: error.message });
      res.status(500).send('Form temporarily unavailable');
    }
  });

  // Form submission endpoint (if you want to handle submissions here)
  router.post('/forms/form_sales_rep/submit', async (req, res) => {
    try {
      const formData = req.body;

      logger.info('Sales Rep form submitted', {
        email: formData.sales_rep_email,
        theme: formData.form_theme
      });

      // You can process the form submission here
      // Or redirect to your existing Directus collection endpoint

      res.json({
        success: true,
        message: 'Form submitted successfully',
        redirect: `/admin/collections/form_sales_rep`
      });

    } catch (error) {
      logger.error('Error processing form submission', { error: error.message });
      res.status(500).json({ success: false, error: 'Submission failed' });
    }
  });

  // Health check endpoint
  router.get('/forms/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
}

function getSalesRepFormHTML(theme) {
  // This is where you'll put your complete HTML content
  // For now, I'll include a template that you'll replace
  return \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Rep Registration - TAMAMAT</title>
    <!-- Include all your CSS and theme detection script here -->
</head>
<body>
    <!-- Your complete form HTML goes here -->
    <h1>Form is loading...</h1>
    <script>
        // Theme detection
        const urlParams = new URLSearchParams(window.location.search);
        const theme = urlParams.get('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);

        // Redirect to full form for now
        window.location.href = '/assets/your-file-id/sales-rep-form-complete.html?theme=' + theme;
    </script>
</body>
</html>\`;
}