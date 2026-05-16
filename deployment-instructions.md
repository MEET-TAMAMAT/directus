# 🚀 TAMAMAT Sales Rep Form - Live Deployment Instructions

## Quick Deploy Steps

### 1. Upload Form to Directus

**Manual Upload:**
1. Go to: https://admin.tamamat.com/admin/files
2. Click "Upload File"
3. Select: `sales-rep-form-complete.html` (from your local directory)
4. Set folder: "Embeddable Forms" (folder ID: a2818b26-213b-49ec-96ae-84fd2e2f44ce)
5. Set title: "Sales Rep Registration Form - Theme Aware"
6. Add description: "Embeddable sales rep registration form with light/dark theme support"
7. Add tags: `forms`, `sales-rep`, `embeddable`, `theme-aware`

### 2. Get Your Live URLs

After uploading, your form will be accessible at:

**Format:** `https://admin.tamamat.com/assets/[FILE-ID]/sales-rep-form-complete.html`

**With Themes:**
- Light: `https://admin.tamamat.com/assets/[FILE-ID]/sales-rep-form-complete.html?theme=light`
- Dark: `https://admin.tamamat.com/assets/[FILE-ID]/sales-rep-form-complete.html?theme=dark`

### 3. Test Your Live Form

1. **Open both theme URLs** in different browser tabs
2. **Test form validation** - try submitting with empty fields
3. **Test password toggle** - click the eye icons
4. **Test responsive design** - resize browser window
5. **Test theme switching** - verify colors change between themes

### 4. Update Form Submission (Important!)

Once deployed, update the form's JavaScript to connect to your actual Directus collection:

```javascript
// In the deployed form, update this section:
const FORM_CONFIG = {
  directusUrl: 'https://admin.tamamat.com',
  collection: 'form_sales_rep',
  submitEndpoint: '/items/form_sales_rep'
};

// Replace the placeholder submitToDirectus function with:
async submitToDirectus(data) {
  const response = await fetch(`${FORM_CONFIG.directusUrl}${FORM_CONFIG.submitEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication if needed
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
```

## Alternative: Custom Endpoint Approach

If you want the exact URL `/admin/forms/form_sales_rep`, follow these steps:

### 1. Create Custom Extension Directory
Create: `extensions/endpoints/sales-form/`

### 2. Add Extension Files
- `index.js` - Main endpoint handler
- `package.json` - Extension metadata

### 3. Deploy and Restart Directus

## Testing Checklist

- [ ] Form loads with light theme parameter
- [ ] Form loads with dark theme parameter  
- [ ] All fields display example placeholders correctly
- [ ] Form validation works (try empty submission)
- [ ] Password toggles work
- [ ] Form is responsive on mobile
- [ ] Theme colors match your site's design
- [ ] Form submits to Directus (once connected)

## Production Integration

Once deployed and tested:

1. **Update dev.tamamat.com** with iframe integration
2. **Connect theme switching** to your site's theme toggle
3. **Test end-to-end flow** from your site to form submission
4. **Monitor form analytics** and user feedback

## Support

- **Backup**: All original files preserved in git branch
- **Documentation**: Complete integration guide available
- **Testing**: Local test environment still available

---

🎯 **Next Step**: Upload the form file to Directus and get your live URLs!