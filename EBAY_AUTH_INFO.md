# eBay Authentication Info

## Current Issue
eBay's authentication for production apps is complex and requires approval for most OAuth scopes.

## Authentication Options:

### Option 1: Basic OAuth (Current Implementation)
- Limited to public data only
- Cannot place bids
- Getting "invalid_scope" error because bid/buy scopes need approval

### Option 2: Auth'n'Auth Token (Trading API)
- Allows bidding through Trading API
- Requires manual token generation
- Token needs to be manually renewed

### Option 3: Apply for Enhanced Scopes
1. Go to eBay Developer Dashboard
2. Find "API Access" or "Scope Access Request"
3. Request these scopes:
   - `buy.browse` - To search and view items
   - `buy.offer` - To place bids
4. Wait for approval (can take days/weeks)

## Temporary Workaround for Testing

Since OAuth isn't working yet, you can:

1. **Use the app in "Demo Mode"**
   - Click "Connect to eBay" 
   - It will simulate connection
   - You can test all UI features
   - Actual bidding won't work

2. **Get a User Token Manually**
   - Go to: https://developer.ebay.com/my/auth/?env=production&index=0
   - Click "Get a User Token"
   - Copy the token
   - We'd need to add a way to input this manually

## For Real Production Use
You'll need to either:
- Apply for OAuth scope approval from eBay
- Use Auth'n'Auth tokens (more complex but works immediately)
- Build a server-side solution that handles eBay's authentication properly