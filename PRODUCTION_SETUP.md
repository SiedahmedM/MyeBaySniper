# MyeBaySniper Production Setup Checklist

## ⚠️ IMPORTANT: Production Mode = Real Money!
You'll be working with your REAL eBay account and REAL money. Test with cheap items first!

## Step 1: Get Production Credentials
Go to: https://developer.ebay.com/my/keys
Switch to "Production" in the top menu

Copy these values:
- [ ] App ID (Client ID): ________________________
- [ ] Dev ID: ________________________
- [ ] Cert ID: ________________________

## Step 2: Get OAuth Production Credentials
Go to: https://developer.ebay.com/my/auth/?env=production&index=0

If you don't have a production keyset:
1. Click "Create a keyset"
2. Fill in application details
3. For OAuth Redirect URI, click "Get OAuth Redirect URI (RuName)"
4. Enter: https://myebaysniper.vercel.app/api/auth/ebay/callback
5. Click "Get OAuth Redirect URI (RuName)"

Copy these values:
- [ ] OAuth Client ID: ________________________
- [ ] OAuth Client Secret: ________________________
- [ ] RuName: ________________________

## Step 3: Update .env.local
Replace ALL sandbox values with production values:
```
NEXT_PUBLIC_EBAY_APP_ID=<Your Production App ID>
EBAY_DEV_ID=<Your Production Dev ID>
EBAY_CERT_ID=<Your Production Cert ID>
EBAY_CLIENT_ID=<Your Production OAuth Client ID>
EBAY_CLIENT_SECRET=<Your Production OAuth Client Secret>
```

## Step 4: Update Vercel Environment Variables
Go to: https://vercel.com/dashboard/myebaysniper/settings/environment-variables

Add/Update ALL the same variables from .env.local

## Step 5: Update Code Files
1. Update src/lib/ebay/config.ts with your production RuName
2. Update src/app/settings/SettingsContent.tsx with your production RuName

## Testing Checklist
- [ ] Start with items under $5
- [ ] Test view item functionality first
- [ ] Test OAuth connection
- [ ] Place a test bid on a cheap item
- [ ] Monitor the auction to ensure snipe works

## Common Issues
- "Unauthorized client" error: Make sure RuName matches exactly
- "Invalid scope" error: Your app may need approval for certain scopes
- Connection fails: Check all credentials are production (no "SBX" prefixes)