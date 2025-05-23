import { NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/ebay/config'

export async function GET() {
  // Generate a random state parameter for security
  const state = Math.random().toString(36).substring(7)
  
  // Store state in cookie for validation later (in production, use a database)
  const response = NextResponse.redirect(getAuthUrl(state))
  response.cookies.set('ebay_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  })
  
  return response
}