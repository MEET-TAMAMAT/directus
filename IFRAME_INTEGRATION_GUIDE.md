# 🎓 TAMAMAT Embeddable Forms - iframe Integration Guide

**Target Site**: dev.tamamat.com  
**Implementation**: URL Parameter + CSS Variables Theme System  
**Date**: 2026-05-09

## Overview

This guide shows you how to integrate the theme-aware TAMAMAT Sales Rep form into your website using iframes with automatic light/dark theme synchronization.

## 🚀 Quick Start

### 1. Basic Iframe Embedding

Add this code to any page on dev.tamamat.com where you want the form:

```html
<iframe 
  id="tamamat-sales-form"
  src="https://admin.tamamat.com/admin/forms/form_sales_rep?theme=light"
  width="100%" 
  height="800"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
  title="Sales Representative Registration - TAMAMAT">
</iframe>
```

### 2. Theme-Aware Integration

For automatic theme synchronization with your site's theme toggle:

```html
<!-- HTML: Form Container -->
<div class="sales-form-container">
  <iframe 
    id="tamamat-sales-form"
    width="100%" 
    height="800"
    style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
    title="Sales Representative Registration - TAMAMAT">
  </iframe>
</div>

<!-- JavaScript: Theme Management -->
<script>
// TAMAMAT Form Theme Manager
class TamamatFormThemes {
  constructor() {
    this.iframe = document.getElementById('tamamat-sales-form');
    this.baseUrl = 'https://admin.tamamat.com/admin/forms/form_sales_rep';
    
    this.initializeForm();
    this.observeThemeChanges();
  }

  initializeForm() {
    // Set initial theme and load form
    const currentTheme = this.getCurrentTheme();
    this.updateFormTheme(currentTheme);
  }

  getCurrentTheme() {
    // Method 1: Check for theme class on document
    if (document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    if (document.documentElement.classList.contains('light')) {
      return 'light';
    }

    // Method 2: Check for data attribute
    const themeAttr = document.documentElement.getAttribute('data-theme');
    if (themeAttr === 'dark' || themeAttr === 'light') {
      return themeAttr;
    }

    // Method 3: Check CSS custom property
    const computedStyle = getComputedStyle(document.documentElement);
    const themeVar = computedStyle.getPropertyValue('--theme').trim();
    if (themeVar === 'dark' || themeVar === 'light') {
      return themeVar;
    }

    // Method 4: System preference fallback
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  updateFormTheme(theme) {
    if (!this.iframe) return;

    const url = new URL(this.baseUrl);
    url.searchParams.set('theme', theme);
    
    this.iframe.src = url.toString();
    console.log('TAMAMAT Form theme updated to:', theme);
  }

  observeThemeChanges() {
    // Method 1: Listen for class changes on document
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
          const newTheme = this.getCurrentTheme();
          this.updateFormTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    // Method 2: Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if no explicit theme is set
        if (!document.documentElement.classList.contains('dark') && 
            !document.documentElement.classList.contains('light')) {
          this.updateFormTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Method 3: Listen for custom theme change events (if your site dispatches them)
    document.addEventListener('themeChanged', (e) => {
      this.updateFormTheme(e.detail.theme);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TamamatFormThemes();
});
</script>
```

## 🎨 Advanced Integration Options

### Option A: PostMessage Communication

For real-time theme updates without iframe reload:

```javascript
// Parent window (dev.tamamat.com)
function updateFormThemeViaPostMessage(newTheme) {
  const iframe = document.getElementById('tamamat-sales-form');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'TAMAMAT_THEME_CHANGE',
      theme: newTheme
    }, '*');
  }
}

// Add this to your existing theme toggle handler
document.getElementById('theme-toggle').addEventListener('click', () => {
  const newTheme = toggleTheme(); // Your existing toggle function
  updateFormThemeViaPostMessage(newTheme);
});
```

### Option B: Custom CSS Integration

Match your site's exact colors by customizing the CSS variables:

```css
/* Add to your site's CSS */
.sales-form-container iframe {
  /* Custom styling for form container */
  border-radius: var(--your-border-radius);
  box-shadow: var(--your-shadow);
}

/* If you need to override form colors, inject CSS into iframe */
.tamamat-form-custom {
  --tamamat-accent-primary: var(--your-primary-color);
  --tamamat-bg-primary: var(--your-bg-color);
  /* Override other variables as needed */
}
```

## 📱 Responsive Integration

### Mobile-Optimized Embedding

```html
<!-- Responsive container -->
<div class="form-container-responsive">
  <iframe 
    id="tamamat-sales-form"
    width="100%" 
    height="700"
    style="border: none; border-radius: 8px;"
    title="Sales Representative Registration">
  </iframe>
</div>

<style>
.form-container-responsive {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .form-container-responsive iframe {
    height: 900px; /* More height for mobile stacking */
  }
}

/* Tablet adjustments */
@media (min-width: 641px) and (max-width: 1024px) {
  .form-container-responsive {
    max-width: 600px;
  }
}
</style>
```

## 🔗 Integration Examples

### Example 1: Modal/Popup Integration

```html
<!-- Trigger Button -->
<button id="open-sales-form" class="btn-primary">
  Become a Sales Rep
</button>

<!-- Modal -->
<div id="sales-form-modal" class="modal hidden">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Join TAMAMAT Sales Team</h3>
      <button id="close-modal" class="close-btn">&times;</button>
    </div>
    <div class="modal-body">
      <iframe 
        id="tamamat-sales-form-modal"
        src="https://admin.tamamat.com/admin/forms/form_sales_rep?theme=light"
        width="100%" 
        height="700"
        style="border: none;">
      </iframe>
    </div>
  </div>
</div>

<script>
// Modal management
document.getElementById('open-sales-form').addEventListener('click', () => {
  const modal = document.getElementById('sales-form-modal');
  modal.classList.remove('hidden');
  
  // Update form theme when opening modal
  const currentTheme = getCurrentTheme(); // Your theme detection function
  const iframe = document.getElementById('tamamat-sales-form-modal');
  const url = new URL(iframe.src);
  url.searchParams.set('theme', currentTheme);
  iframe.src = url.toString();
});

document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('sales-form-modal').classList.add('hidden');
});
</script>
```

### Example 2: Sidebar Integration

```html
<!-- Sidebar Form -->
<div class="sidebar-form">
  <h3>Quick Sign-Up</h3>
  <iframe 
    id="tamamat-sales-form-sidebar"
    src="https://admin.tamamat.com/admin/forms/form_sales_rep?theme=light"
    width="100%" 
    height="600"
    style="border: none;">
  </iframe>
</div>

<style>
.sidebar-form {
  width: 400px;
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-color);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  z-index: 1000;
}
</style>
```

## 🔧 Deployment Steps

### Step 1: Deploy Form to Directus

1. **Create Custom Endpoint** (Recommended):
```javascript
// extensions/endpoints/sales-form/index.js
export default function(router, { env, database }) {
  router.get('/sales-form', async (req, res) => {
    const theme = req.query.theme || 'light';
    
    // Read your HTML template
    const htmlContent = await fs.readFile('./sales-rep-form-complete.html', 'utf8');
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Security
    res.send(htmlContent);
  });
}
```

2. **Or Use Static Hosting**:
   - Upload `sales-rep-form-complete.html` to your static assets
   - Update iframe src to point to the static URL

### Step 2: Update dev.tamamat.com

1. **Add the iframe integration code** to your pages
2. **Update your theme toggle** to include form theme updates
3. **Test on both desktop and mobile**

### Step 3: Configure Form Submission

Update the form's submission endpoint in the JavaScript:

```javascript
// In sales-rep-form-complete.html, update FORM_CONFIG
const FORM_CONFIG = {
  directusUrl: 'https://admin.tamamat.com',
  collection: 'form_sales_rep',
  submitEndpoint: '/items/form_sales_rep', // Your actual endpoint
  authToken: 'your-auth-token-if-needed'   // For authenticated endpoints
};
```

## 🧪 Testing Checklist

### Pre-Deployment Testing

- [ ] **Theme Switching**: Form theme updates when site theme changes
- [ ] **Form Functionality**: All fields validate and submit correctly
- [ ] **Responsive Design**: Form works on mobile, tablet, and desktop
- [ ] **Cross-Browser**: Test in Chrome, Firefox, Safari, Edge
- [ ] **Accessibility**: Screen readers and keyboard navigation work
- [ ] **Performance**: Form loads quickly and iframe doesn't block page

### Post-Deployment Testing

- [ ] **Production URL**: Form loads correctly from production endpoint
- [ ] **Data Submission**: Forms submit to Directus and trigger flows
- [ ] **CRM Integration**: Submissions appear in your CRM workflows
- [ ] **Email Notifications**: Welcome emails are sent to new sales reps
- [ ] **Error Handling**: Network errors are handled gracefully

## 🛠️ Troubleshooting

### Common Issues

**Issue**: Form doesn't change themes  
**Solution**: Check that your theme detection logic matches your site's implementation

**Issue**: Iframe height is wrong  
**Solution**: Adjust height based on your form's content and mobile requirements

**Issue**: Form submissions not working  
**Solution**: Verify CORS settings and authentication in Directus

**Issue**: Form looks different than expected  
**Solution**: Check CSS variable mappings and color scheme definitions

### Debug Tools

```javascript
// Debug theme detection
console.log('Current theme:', getCurrentTheme());
console.log('Document classes:', document.documentElement.className);
console.log('Theme attribute:', document.documentElement.getAttribute('data-theme'));

// Debug iframe communication
window.addEventListener('message', (event) => {
  console.log('Received message from iframe:', event.data);
});
```

## 🚨 Security Considerations

### iframe Security

```html
<!-- Recommended security attributes -->
<iframe 
  src="https://admin.tamamat.com/admin/forms/form_sales_rep"
  sandbox="allow-forms allow-scripts allow-same-origin"
  referrerpolicy="strict-origin-when-cross-origin"
  loading="lazy">
</iframe>
```

### CORS Configuration

Ensure your Directus instance allows iframe embedding:

```javascript
// directus.config.js
module.exports = {
  security: {
    cors: {
      enabled: true,
      origin: ['https://dev.tamamat.com', 'https://tamamat.com']
    }
  }
};
```

## 📋 Final Checklist

Before going live:

- [ ] Form is deployed and accessible
- [ ] Theme synchronization works correctly
- [ ] Form submission connects to Directus
- [ ] CRM flows are triggered by submissions
- [ ] Error handling is in place
- [ ] Mobile experience is optimized
- [ ] Security headers are configured
- [ ] Performance is acceptable
- [ ] Backup/restore process is documented

## 🎯 Next Steps

1. **Deploy the form** using your preferred method
2. **Integrate with dev.tamamat.com** using one of the examples above  
3. **Test thoroughly** using the testing checklist
4. **Monitor submissions** and user feedback
5. **Iterate and improve** based on usage data

---

**🚀 Ready to deploy!** Your theme-aware embeddable form is ready for production use with full light/dark theme support.

For support or questions, refer to the backup documentation in [`EMBEDDABLE_FORMS_DOCUMENTATION.md`](EMBEDDABLE_FORMS_DOCUMENTATION.md).