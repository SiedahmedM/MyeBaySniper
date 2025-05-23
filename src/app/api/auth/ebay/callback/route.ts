import { NextRequest, NextResponse } from 'next/server'
import { EbayAuth } from '@/lib/ebay/auth'
import { ebayConfig } from '@/lib/ebay/config'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  
  // Check for errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?error=${error}`, request.url)
    )
  }
  
  if (!code) {
    return NextResponse.redirect(
      new URL('/settings?error=no_code', request.url)
    )
  }
  
  try {
    const auth = EbayAuth.getInstance()
    await auth.exchangeCodeForToken(code)
    
    return NextResponse.redirect(
      new URL('/settings?success=true', request.url)
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/settings?error=token_exchange_failed', request.url)
    )
  }
}