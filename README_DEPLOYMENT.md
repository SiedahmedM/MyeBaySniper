# Deployment Instructions

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository (you'll need to push this code to GitHub first)
3. Configure environment variables in Vercel dashboard:
   - NEXT_PUBLIC_EBAY_APP_ID = (your app id from eBay)
   - EBAY_DEV_ID = (your dev id)
   - EBAY_CERT_ID = (your cert id)
   - EBAY_CLIENT_ID = (your client id)
   - EBAY_CLIENT_SECRET = (your client secret)
   - EBAY_REDIRECT_URI = https://your-app-name.vercel.app/api/auth/ebay/callback
   - NEXT_PUBLIC_EBAY_API_URL = https://api.sandbox.ebay.com
   - NEXT_PUBLIC_EBAY_AUTH_URL = https://auth.sandbox.ebay.com/oauth2/authorize
   - EBAY_TOKEN_URL = https://api.sandbox.ebay.com/identity/v1/oauth2/token
   - NEXT_PUBLIC_EBAY_ENVIRONMENT = sandbox

4. Deploy!

## Option 2: Use Vercel CLI

1. First, add all environment variables:
```bash
vercel env add NEXT_PUBLIC_EBAY_APP_ID production
# (repeat for all variables)
```

2. Deploy:
```bash
vercel --prod
```

## Your Redirect URIs

After deployment, you'll get a URL like:
- https://myebaysniper.vercel.app

Add these to eBay:
- https://myebaysniper.vercel.app/api/auth/ebay/callback
- http://localhost:3000/api/auth/ebay/callback (for local development)

## Important Notes

1. The deployment is failing because Vercel's build environment doesn't have the .env.local file
2. You need to add environment variables in Vercel's dashboard
3. Once deployed, update the EBAY_REDIRECT_URI in Vercel to match your final URL