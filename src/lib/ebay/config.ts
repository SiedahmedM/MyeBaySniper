export const ebayConfig = {
  appId: process.env.NEXT_PUBLIC_EBAY_APP_ID!,
  devId: process.env.EBAY_DEV_ID!,
  certId: process.env.EBAY_CERT_ID!,
  clientId: process.env.EBAY_CLIENT_ID!,
  clientSecret: process.env.EBAY_CLIENT_SECRET!,
  redirectUri: process.env.EBAY_REDIRECT_URI!,
  // IMPORTANT: Replace with your production RuName from eBay
  // Get from: https://developer.ebay.com/my/auth/?env=production&index=0
  ruName: process.env.NEXT_PUBLIC_EBAY_ENVIRONMENT === 'production' 
    ? 'YOUR_PRODUCTION_RUNAME' // Replace this!
    : 'Mohamed_Siedahm-MohamedS-pro-SB-qezdx',
  environment: process.env.NEXT_PUBLIC_EBAY_ENVIRONMENT || 'sandbox',
  
  // API endpoints
  apiUrl: process.env.NEXT_PUBLIC_EBAY_API_URL!,
  authUrl: process.env.NEXT_PUBLIC_EBAY_AUTH_URL!,
  tokenUrl: process.env.EBAY_TOKEN_URL!,
  
  // OAuth scopes needed for sniping
  scopes: [
    'https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/buy.item.feed',
    'https://api.ebay.com/oauth/api_scope/buy.browse',
    'https://api.ebay.com/oauth/api_scope/buy.offer',
    'https://api.ebay.com/oauth/api_scope/buy.order',
    'https://api.ebay.com/oauth/api_scope/buy.guest.checkout'
  ]
}

export const getAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: ebayConfig.clientId,
    redirect_uri: ebayConfig.ruName,
    response_type: 'code',
    state,
    scope: ebayConfig.scopes.join(' '),
    prompt: 'login'
  })
  
  return `${ebayConfig.authUrl}?${params.toString()}`
}