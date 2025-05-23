import { NextRequest, NextResponse } from 'next/server'
import { ebayConfig } from '@/lib/ebay/config'

export async function GET(request: NextRequest) {
  // For eBay sandbox OAuth, we need to use their specific OAuth URL format
  const authUrl = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${ebayConfig.clientId}&response_type=code&redirect_uri=${ebayConfig.ruName}&scope=https://api.ebay.com/oauth/api_scope`
  
  return NextResponse.redirect(authUrl)
}