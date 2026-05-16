# Directus + Mailgun Integration Guide

**Status:** ✅ Working Configuration  
**Date:** 2026-05-16  
**Domain:** tamamat.com  
**Platform:** Railway  

## Overview
This document contains the working configuration for integrating Directus with Mailgun for transactional email sending (user invitations, password resets, etc.).

## Working Environment Variables

Add these to your Railway/Directus deployment:

```env
EMAIL_FROM=admin@tamamat.com
EMAIL_TRANSPORT=mailgun
EMAIL_MAILGUN_API_KEY=[your-domain-private-api-key]
EMAIL_MAILGUN_DOMAIN=tamamat.com
SECRET=[32+-character-secure-random-string]
```

### Important Notes:
- Use `EMAIL_MAILGUN_API_KEY` (not `EMAIL_MAILGUN_KEY`)
- Use your **verified domain** (not sandbox domain)
- Use the **Private API Key** from your domain settings in Mailgun
- SECRET must be 32+ characters for production security

## DNS Configuration (Porkbun)

### Required DNS Records for Domain Verification:

```dns
# SPF Record
Type: TXT
Host: @
Value: v=spf1 include:mailgun.org ~all

# DKIM Record  
Type: TXT
Host: mx._domainkey
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVuHmUK9OzZ1bx...

# DMARC Record
Type: TXT  
Host: _dmarc
Value: v=DMARC1; p=none; pct=100; fo=1; ri=3600; rua=mailto:dcb50fb0@dmarc.mailgun.org...

# MX Records
Type: MX
Host: @
Value: mxa.mailgun.org (Priority: 0)

Type: MX
Host: @  
Value: mxb.mailgun.org (Priority: 0)

# CNAME Record
Type: CNAME
Host: email
Value: mailgun.org
```

### Critical DNS Notes:
- **Only ONE SPF record** per domain (remove conflicting SPF records)
- Remove Porkbun default MX forwarding if using Mailgun exclusively
- DNS propagation can take up to 1 hour

## Setup Process

### 1. Domain Verification in Mailgun
1. Add your domain `tamamat.com` in Mailgun dashboard
2. Copy the DNS records Mailgun provides
3. Add them to Porkbun DNS (see configuration above)
4. Wait for verification (usually 15-60 minutes)

### 2. Get API Credentials
1. In Mailgun dashboard, go to your verified domain
2. Navigate to **Settings** → **API Keys**  
3. Copy the **Private API key** (starts with `key-`)
4. Note your domain name: `tamamat.com`

### 3. Configure Directus Environment
1. In Railway, go to your Directus service
2. Add the environment variables (see above)
3. **Important:** Delete old `EMAIL_MAILGUN_KEY` if it exists
4. Restart the service

### 4. Test the Integration
1. Go to Directus Admin → Users
2. Try to invite a new user
3. Check logs for any errors

## Common Issues & Solutions

### Issue: "Parameter 'key' is required"
**Cause:** Missing or incorrectly named API key variable  
**Fix:** Ensure `EMAIL_MAILGUN_API_KEY` (not `EMAIL_MAILGUN_KEY`) is set

### Issue: "401 Unauthorized" errors
**Cause:** Wrong API key or using sandbox key with verified domain  
**Fix:** Use the Private API key from your domain's settings page

### Issue: Multiple SPF record conflicts  
**Cause:** Having multiple `v=spf1` TXT records  
**Fix:** Keep only one SPF record: `v=spf1 include:mailgun.org ~all`

### Issue: "Could not send mail" errors
**Cause:** Domain not verified or DNS not propagated  
**Fix:** Wait for DNS propagation, verify domain status in Mailgun

## Security Considerations

- Use a **32+ character SECRET** environment variable for production
- Keep API keys secure and rotate them periodically  
- Use DMARC policy to prevent email spoofing
- Monitor Mailgun logs for suspicious activity

## Testing Commands

Test DNS propagation:
```bash
dig TXT tamamat.com
dig TXT mx._domainkey.tamamat.com  
dig MX tamamat.com
```

## Mailgun Dashboard URLs

- Domain Settings: `https://app.mailgun.com/app/domains/tamamat.com`
- API Keys: `https://app.mailgun.com/app/domains/tamamat.com/credentials`
- Logs: `https://app.mailgun.com/app/logs`

---

**Last Updated:** 2026-05-16  
**Working Status:** ✅ User invitations successfully sending