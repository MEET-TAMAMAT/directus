# Embeddable Forms Extension - Current State Documentation

**Date**: 2026-05-09
**Branch**: backup/embeddable-forms-pre-customization
**Purpose**: Pre-customization snapshot and documentation

## Overview

This document captures the current state of the Embeddable Forms extension setup for the `form_sales_rep` collection before any template or styling customizations.

## Form Collection: form_sales_rep

### Collection Configuration
- **Collection Name**: `form_sales_rep`
- **Icon**: `point_of_sale`
- **Color**: `#FF24D7`
- **Group**: `FORMS`
- **Archive Field**: `status`
- **Archive Values**: archived/draft
- **Sort Field**: `sort`
- **Accountability**: `all`
- **Display Template**: Default

### Form Fields Structure

| Field Name | Type | Interface | Required | Sort | Width | Translations |
|------------|------|-----------|----------|------|-------|--------------|
| `id` | integer | input | - | 9 | full | - |
| `status` | string | select-dropdown | - | 10 | full | Hidden |
| `sort` | integer | input | - | 11 | full | Hidden |
| `created_by` | uuid | select-dropdown-m2o | - | 12 | half | Hidden |
| `created_on` | timestamp | datetime | - | 13 | half | Hidden |
| `updated_by` | uuid | select-dropdown-m2o | - | 14 | half | Hidden |
| `updated_on` | timestamp | datetime | - | 15 | half | Hidden |
| `divider-pwtq5j` | alias | presentation-divider | - | 1 | full | "Sales Rep Heading" |
| `sales_rep_first_name` | string | input | ✓ | 3 | half | "First Name" |
| `sales_rep_last_name` | string | input | ✓ | 4 | half | "Last Name" |
| `sales_rep_email` | string | input | ✓ | 5 | half | "Email" |
| `sales_rep_phone_number` | string | input | ✓ | 6 | half | "Phone #" |
| `sales_rep_password` | string | input | ✓ | 7 | half | "Password 1" |
| `sales_rep_password_confirm` | string | input | ✓ | 8 | half | "Password 2" |

### Field Configuration Details

#### Divider Field (`divider-pwtq5j`)
- **Type**: Presentation divider
- **Title**: "Fill in the information below to set up your password"
- **Color**: `#6644FF`
- **Icon**: `exclamation`

#### First Name (`sales_rep_first_name`)
- **Placeholder**: "First Name"
- **Icon Left**: `drive_file_rename_outline`
- **Soft Length**: 50 characters
- **Validation**: Required

#### Last Name (`sales_rep_last_name`)
- **Placeholder**: "Last Name"
- **Icon Left**: `drive_file_rename_outline`
- **Validation**: Required

#### Email (`sales_rep_email`)
- **Placeholder**: "Email address"
- **Icon Left**: `alternate_email`
- **Validation**: Required

#### Phone Number (`sales_rep_phone_number`)
- **Placeholder**: "Phone Number"
- **Icon Left**: `phone_enabled`
- **Validation**: Required

#### Password (`sales_rep_password`)
- **Placeholder**: "Set up your password. (min. 8 characters)"
- **Icon Left**: `passkey`
- **Validation**: Required

#### Password Confirmation (`sales_rep_password_confirm`)
- **Placeholder**: "Confirm your password."
- **Icon Left**: `passkey`
- **Validation**: Required

## Current Extension Setup

### Access URL
```
https://admin.tamamat.com/admin/forms/form_sales_rep
```

### Extension Source
- **Extension**: Embeddable Forms Template
- **Community Link**: https://community.directus.io/t/embeddable-forms-template-embed-a-submission-form-for-any-directus-collection-on-any-website/1670
- **Installation**: Marketplace/Manual installation (not in source code)

### Current Styling Characteristics
- **Background Color**: White (#ffffff)
- **Theme**: Appears to inherit from Directus dark theme CSS
- **Field Styling**: Standard Directus form field appearance
- **Layout**: Responsive form layout with half/full width fields

## Related Flows and Automations

### Active Flows Related to Forms
1. **Send Confirmation Email - New Lead** (`590704b6-f08a-4efd-ab8b-aade30beb6dc`)
   - Trigger: Event
   - Description: Automatically sends confirmation email on contact form submission

2. **CRM — Welcome new sales rep** (`9ed14665-5d7a-453f-ad1b-353fbb75ff96`)
   - Trigger: Event  
   - Description: Sends welcome email to new Sales Rep when account is created

3. **CRM — Create sales rep user** (`7c051556-9b07-407f-8af2-07c4521d9133`)
   - Trigger: Manual
   - Description: Admin creates new Sales Rep user with automatic password setup email

## CRM Integration

### Collections Involved
- **form_sales_rep**: Form submissions collection
- **leads**: Contact form submissions source
- **school_members**: Converted leads (teachers, directors, admins)
- **activities**: Interaction logging
- **deals**: Sales opportunities

### Data Flow
Form submission → form_sales_rep → Manual processing → CRM entities

## Technical Configuration

### Environment Setup
- **Instance URL**: https://admin.tamamat.com
- **Collection Group**: FORMS (#FF24D7)
- **User Email Context**: meet.tamamat@gmail.com
- **Form Collection Status**: Active

### Field Validation Rules
- All user-facing fields are required
- System fields (id, timestamps, user tracking) are handled automatically
- Status field uses draft/published/archived workflow

## Pre-Customization State Summary

### What Works Currently
✅ Form renders at public URL
✅ All fields display with proper labels and placeholders
✅ Form validation is in place
✅ Integration with CRM flows exists
✅ Responsive layout functions

### Current Styling Limitations
❌ Background color is fixed white
❌ Limited theme customization options
❌ Standard Directus form styling only
❌ No custom branding/styling

### Customization Goals
Based on user requirements:
1. Control background color (currently white)
2. Customize field colors beyond dark theme inheritance
3. Create custom template with branded styling
4. Maintain form functionality and CRM integration

## Next Steps for Customization

1. **CSS Override Approach**: Create custom CSS to override default styling
2. **Custom Template**: Build new template with full design control
3. **Extension Fork**: Create custom version of Embeddable Forms extension
4. **Testing**: Ensure form submissions continue to work with CRM flows

## Backup Information

### Git State
- **Original Branch**: main
- **Backup Branch**: backup/embeddable-forms-pre-customization
- **Commit Hash**: 4caef939b
- **Files Preserved**: All current configuration and dependencies

### Restoration Process
To restore this exact state:
```bash
git checkout backup/embeddable-forms-pre-customization
```

---

**Documentation Created**: 2026-05-09
**Author**: Claude Sonnet 4 (Claude Code Assistant)
**Purpose**: Pre-customization backup and reference