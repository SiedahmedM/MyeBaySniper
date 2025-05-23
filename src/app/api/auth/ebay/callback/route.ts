import { NextRequest, NextResponse } from 'next/server'
import { EbayAuth } from '@/lib/ebay/auth'

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
  
  // Verify state parameter
  const storedState = request.cookies.get('ebay_auth_state')?.value
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL('/settings?error=invalid_state', request.url)
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
    
    // Clear the state cookie
    const response = NextResponse.redirect(
      new URL('/settings?success=true', request.url)
    )
    response.cookies.delete('ebay_auth_state')
    
    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/settings?error=token_exchange_failed', request.url)
    )
  }
}