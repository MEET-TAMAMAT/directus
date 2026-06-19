# Sales Rep View Configuration Instructions

## Prerequisites

1. Ensure your Directus instance is running:

   ```bash
   docker-compose up -d
   ```

2. Install Directus SDK in your project:
   ```bash
   npm install @directus/sdk
   ```

## Run the Configuration Script

```bash
node configure-sales-rep-preset.js
```

This script will:

- ✅ Create a "Sales Rep" role (if it doesn't exist)
- ✅ Configure default column layout for the Leads collection
- ✅ Set appropriate column widths and sorting

## Expected Result

After running the script, Sales Reps will see these columns by default:

| Column            | Field             | Width | Description           |
| ----------------- | ----------------- | ----- | --------------------- |
| Contact Name      | name              | 200px | Full name of the lead |
| Email             | email             | 250px | Email address         |
| Phone             | phone             | 150px | Phone number          |
| Company           | company           | 200px | Company/School name   |
| Lead Type         | lead_type         | 120px | Person/Company/Coach  |
| Processing Status | processing_status | 150px | CRM processing state  |
| Status            | status            | 100px | Zadarma sync status   |
| Responsible       | responsible_user  | 150px | Assigned sales rep    |
| Created           | date_created      | 150px | When lead was created |

## Additional Customization Options

You can modify the `configure-sales-rep-preset.js` file to:

### Add/Remove Columns

Edit the `fields` array on lines 70-80:

```javascript
fields: [
    'name',
    'email',
    'phone',
    'message',        // Add message field
    'country',        // Add country field
    'lead_type',
    'processing_status',
    'status',
    'responsible_user',
    'date_created'
],
```

### Change Column Widths

Modify the `widths` object on lines 56-66:

```javascript
widths: {
    name: 250,           // Make name column wider
    email: 200,          // Make email column smaller
    message: 300,        // Add width for message field
    // ... other columns
}
```

### Change Default Sorting

Update the `sort` array on line 81:

```javascript
sort: ['-date_created']; // Newest first (current)
sort: ['date_created']; // Oldest first
sort: ['name']; // Alphabetical by name
sort: ['-processing_status', '-date_created']; // By status, then date
```
