import { NextRequest, NextResponse } from 'next/server'
import * as crypto from 'crypto'

// This endpoint handles eBay marketplace account deletion notifications
// Required for production API access compliance

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const challengeCode = searchParams.get('challenge_code')
    
    if (!challengeCode) {
      return NextResponse.json({ error: 'Missing challenge_code' }, { status: 400 })
    }
    
    // Get the verification token - MUST match what you entered in eBay
    const verificationToken = process.env.EBAY_NOTIFICATION_TOKEN || 'myebaysniper-prod-2025-verification'
    const endpointURL = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://myebaysniper.vercel.app'}/api/ebay/notifications`
    
    // Log for debugging (remove in production)
    console.log('eBay Challenge Request:', {
      challengeCode,
      verificationToken: verificationToken.substring(0, 10) + '...',
      endpointURL
    })
    
    // Create the hash as required by eBay
    const hash = crypto
      .createHash('sha256')
      .update(challengeCode + verificationToken + endpointURL)
      .digest('hex')
    
    console.log('Generated hash:', hash)
    
    // Return the challenge response
    return NextResponse.json({
      challengeResponse: hash
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error handling eBay notification challenge:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if this is a challenge verification (form data)
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Handle form data for challenge
      const formData = await request.text()
      const params = new URLSearchParams(formData)
      const challengeCode = params.get('challenge_code')
      
      if (challengeCode) {
        // Handle challenge in POST request
        const verificationToken = process.env.EBAY_NOTIFICATION_TOKEN || 'myebaysniper-prod-2025-verification'
        const endpointURL = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mye-bay-sniper.vercel.app'}/api/ebay/notifications`
        
        console.log('eBay POST Challenge Request:', {
          challengeCode,
          verificationToken: verificationToken.substring(0, 10) + '...',
          endpointURL
        })
        
        const hash = crypto
          .createHash('sha256')
          .update(challengeCode + verificationToken + endpointURL)
          .digest('hex')
        
        return NextResponse.json({
          challengeResponse: hash
        }, { status: 200 })
      }
    }
    
    // Handle regular JSON notifications
    const body = await request.json()
    
    // Log the notification for debugging
    console.log('Received eBay notification:', JSON.stringify(body, null, 2))
    
    // Handle different notification types
    if (body.metadata?.topic === 'MARKETPLACE_ACCOUNT_DELETION') {
      // Handle account deletion
      console.log('User requested account deletion:', body.notification?.userId)
      // TODO: Implement actual deletion logic here
      // For now, we just acknowledge receipt
    } else if (body.metadata?.topic === 'MARKETPLACE_ACCOUNT_CLOSURE') {
      // Handle account closure
      console.log('Account closed:', body.notification?.userId)
      // TODO: Implement actual closure logic here
    }
    
    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    console.error('Error processing eBay notification:', error)
    // Still return 200 to prevent eBay from retrying
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  }
}