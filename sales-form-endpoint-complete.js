// Custom Directus Endpoint - Sales Rep Form
// Place in: extensions/endpoints/sales-form/index.js

export default function(router, { env, logger }) {

  router.get('/forms/form_sales_rep', async (req, res) => {
    try {
      const theme = req.query.theme || 'light';

      // Set headers for HTML response
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'public, max-age=300');

      // Your complete form HTML
      const htmlContent = \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Rep Registration - TAMAMAT</title>
    <meta name="theme-color" content="#3b82f6">
    <style>
/* Complete CSS from your form file - included here */
:root {
  --tamamat-bg-primary: #ffffff;
  --tamamat-bg-secondary: #f8fafc;
  --tamamat-text-primary: #1e293b;
  --tamamat-text-secondary: #475569;
  --tamamat-input-bg: #ffffff;
  --tamamat-input-border: #d1d5db;
  --tamamat-input-text: #1f2937;
  --tamamat-btn-primary-bg: #3b82f6;
  --tamamat-btn-primary-text: #ffffff;
  --tamamat-accent-primary: #3b82f6;
  --tamamat-accent-error: #ef4444;
  --tamamat-accent-success: #10b981;
  /* Add more variables as needed */
}

:root[data-theme="dark"] {
  --tamamat-bg-primary: #0f172a;
  --tamamat-bg-secondary: #1e293b;
  --tamamat-text-primary: #f8fafc;
  --tamamat-text-secondary: #e2e8f0;
  --tamamat-input-bg: #1e293b;
  --tamamat-input-border: #475569;
  --tamamat-input-text: #f8fafc;
  /* Dark theme variables */
}

.tamamat-form {
  background: var(--tamamat-bg-primary);
  color: var(--tamamat-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  padding: 2rem;
}

.tamamat-form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tamamat-form-content {
  max-width: 28rem;
  margin: 0 auto;
  background: var(--tamamat-bg-secondary);
  border-radius: 12px;
  padding: 2rem;
}

.tamamat-field-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tamamat-field-half {
  flex: 1;
}

.tamamat-field-label {
  display: block;
  color: var(--tamamat-text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.tamamat-input {
  width: 100%;
  background: var(--tamamat-input-bg);
  border: 1px solid var(--tamamat-input-border);
  border-radius: 8px;
  color: var(--tamamat-input-text);
  padding: 0.75rem 1rem;
  transition: all 0.2s;
}

.tamamat-submit-button {
  width: 100%;
  background: var(--tamamat-btn-primary-bg);
  color: var(--tamamat-btn-primary-text);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 640px) {
  .tamamat-field-row {
    flex-direction: column;
  }
}
    </style>
    <script>
      function initializeTheme() {
        const urlParams = new URLSearchParams(window.location.search);
        const theme = urlParams.get('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        window.currentTheme = theme;
      }
      initializeTheme();
    </script>
</head>
<body class="tamamat-form">
    <div class="tamamat-form-header">
        <h1>Join TAMAMAT as a Sales Representative</h1>
        <p>Fill in the information below to set up your account and start helping language schools discover our innovative teaching platform.</p>
    </div>

    <div class="tamamat-form-content">
        <form id="salesRepForm" novalidate>
            <div class="tamamat-field-row">
                <div class="tamamat-field-half">
                    <label class="tamamat-field-label">First Name *</label>
                    <input type="text" name="sales_rep_first_name" class="tamamat-input" placeholder="John" required>
                </div>
                <div class="tamamat-field-half">
                    <label class="tamamat-field-label">Last Name *</label>
                    <input type="text" name="sales_rep_last_name" class="tamamat-input" placeholder="Smith" required>
                </div>
            </div>

            <div class="tamamat-field-row">
                <div class="tamamat-field-half">
                    <label class="tamamat-field-label">Email *</label>
                    <input type="email" name="sales_rep_email" class="tamamat-input" placeholder="john@example.com" required>
                </div>
                <div class="tamamat-field-half">
                    <label class="tamamat-field-label">Phone # *</label>
                    <input type="tel" name="sales_rep_phone_number" class="tamamat-input" placeholder="+1 (555) 123-4567" required>
                </div>
            </div>

            <div style="text-align: center; margin: 2rem 0; color: var(--tamamat-text-secondary);">
                🔐 Fill in the information below to set up your password
            </div>

            <div class="tamamat-field-row">
                <div class="tamamat-field-half">
                    <label class="tamamat-field-label">Enter your password *</label>
                    <input type="password" name="sales_rep_password" class="tamamat-input" placeholder="••••••••" required>
                </div>
                <div class="tamamat-field-half">
                    <label class="tamamat-field-label">Confirm your password *</label>
                    <input type="password" name="sales_rep_password_confirm" class="tamamat-input" placeholder="••••••••" required>
                </div>
            </div>

            <button type="submit" class="tamamat-submit-button">
                Create Sales Rep Account
            </button>
        </form>
    </div>

    <script>
      document.getElementById('salesRepForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted! (Demo mode - not actually processing)');
      });
    </script>
</body>
</html>\`;

      res.send(htmlContent);

    } catch (error) {
      res.status(500).send('Form temporarily unavailable');
    }
  });
}