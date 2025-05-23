# eBay API Setup Guide for MyeBaySniper

## Overview
MyeBaySniper can work in two modes:
1. **Demo Mode** - Uses simulated data (default)
2. **Live Mode** - Uses real eBay API data (requires setup)

## Setting Up eBay API Access

### Step 1: Create eBay Developer Account

1. Go to [eBay Developer Program](https://developer.ebay.com/signin)
2. Sign in with your eBay account or create a new one
3. Complete the developer registration

### Step 2: Create an Application

1. Once logged in, go to "My Account" → "Application Keys"
2. Click "Create Application"
3. Fill in the application details:
   - **Application Title**: MyeBaySniper
   - **Application Environment**: 
     - Start with "Sandbox" for testing
     - Later switch to "Production" for real auctions
   - **Application Type**: Traditional Native App

### Step 3: Configure OAuth Settings

1. In your application settings, add the redirect URI:
   ```
   http://localhost:3000/api/auth/ebay/callback
   ```
   
2. For production deployment, add your production URL:
   ```
   https://your-domain.com/api/auth/ebay/callback
   ```

### Step 4: Get Your Credentials

From the application page, copy the following:
- App ID (Client ID)
- Dev ID
- Cert ID
- App Secret (Client Secret)

### Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials:
   ```env
   # For Sandbox Testing
   NEXT_PUBLIC_EBAY_APP_ID=your-sandbox-app-id
   EBAY_DEV_ID=your-sandbox-dev-id
   EBAY_CERT_ID=your-sandbox-cert-id
   EBAY_CLIENT_ID=your-sandbox-client-id
   EBAY_CLIENT_SECRET=your-sandbox-client-secret
   EBAY_REDIRECT_URI=http://localhost:3000/api/auth/ebay/callback
   NEXT_PUBLIC_EBAY_ENVIRONMENT=sandbox
   NEXT_PUBLIC_EBAY_API_URL=https://api.sandbox.ebay.com
   NEXT_PUBLIC_EBAY_AUTH_URL=https://auth.sandbox.ebay.com/oauth2/authorize
   EBAY_TOKEN_URL=https://api.sandbox.ebay.com/identity/v1/oauth2/token
   ```

   For production:
   ```env
   # For Production
   NEXT_PUBLIC_EBAY_ENVIRONMENT=production
   NEXT_PUBLIC_EBAY_API_URL=https://api.ebay.com
   NEXT_PUBLIC_EBAY_AUTH_URL=https://auth.ebay.com/oauth2/authorize
   EBAY_TOKEN_URL=https://api.ebay.com/identity/v1/oauth2/token
   ```

### Step 6: Connect Your eBay Account

1. Run the application:
   ```bash
   npm run dev
   ```

2. Go to Settings page (http://localhost:3000/settings)
3. Click "Connect to eBay"
4. Log in with your eBay account
5. Authorize the application

## API Limitations & Notes

### Available APIs
- **Browse API** ✅ - View auction details, search items (available immediately)
- **Buy API** ✅ - View bidding activity (available immediately)
- **Trading API** ⚠️ - Place bids (requires app review for production)

### Production App Review
To place real bids in production, you need to:
1. Submit your app for eBay review
2. Provide business justification
3. Demonstrate compliance with eBay policies
4. This process can take 2-4 weeks

### Testing in Sandbox
- Use sandbox test users (create in eBay Developer Dashboard)
- All auctions are simulated
- Bids don't cost real money
- Perfect for development and testing

### Rate Limits
- Browse API: 5,000 calls/day
- Trading API: Varies by call type
- Implement caching to reduce API calls

## Troubleshooting

### Common Issues

1. **"Invalid client" error**
   - Check that your Client ID and Secret are correct
   - Ensure you're using the right environment (sandbox vs production)

2. **"Redirect URI mismatch"**
   - Verify the redirect URI in your app settings matches exactly
   - Include the protocol (http/https)

3. **"Unauthorized" when fetching items**
   - Token may have expired
   - Try disconnecting and reconnecting in Settings

### Debug Mode
Enable debug logging:
```env
NEXT_PUBLIC_DEBUG=true
```

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment variables** in production (Vercel, Netlify, etc.)
3. **Rotate credentials** regularly
4. **Monitor API usage** in eBay Developer Dashboard
5. **Implement rate limiting** in production

## Next Steps

1. Start with Sandbox environment
2. Test all features thoroughly
3. Apply for production access
4. Submit app for review if you need bidding capability
5. Deploy to production with proper environment variables

## Support

- [eBay Developer Forums](https://community.ebay.com/t5/Developer-Groups/ct-p/developergroup)
- [eBay API Documentation](https://developer.ebay.com/docs)
- [MyeBaySniper Issues](https://github.com/yourusername/MyeBaySniper/issues)