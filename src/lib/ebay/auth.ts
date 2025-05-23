import { ebayConfig } from './config'

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
}

export class EbayAuth {
  private static instance: EbayAuth
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private tokenExpiry: Date | null = null

  static getInstance(): EbayAuth {
    if (!EbayAuth.instance) {
      EbayAuth.instance = new EbayAuth()
    }
    return EbayAuth.instance
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: ebayConfig.redirectUri
    })

    const response = await fetch(ebayConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${ebayConfig.clientId}:${ebayConfig.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.statusText}`)
    }

    const data: TokenResponse = await response.json()
    
    // Store tokens
    this.accessToken = data.access_token
    this.refreshToken = data.refresh_token
    this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000)
    
    return data
  }

  async getAccessToken(): Promise<string> {
    // Check if token exists and is still valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    // If we have a refresh token, use it
    if (this.refreshToken) {
      await this.refreshAccessToken()
      return this.accessToken!
    }

    throw new Error('No valid access token available. Please authenticate.')
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    })

    const response = await fetch(ebayConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${ebayConfig.clientId}:${ebayConfig.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`)
    }

    const data: TokenResponse = await response.json()
    
    this.accessToken = data.access_token
    this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000)
  }

  // Get a client credentials token (for public APIs)
  async getClientToken(): Promise<string> {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'https://api.ebay.com/oauth/api_scope'
    })

    const response = await fetch(ebayConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${ebayConfig.clientId}:${ebayConfig.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error(`Failed to get client token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.tokenExpiry && this.tokenExpiry > new Date()
  }

  clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null
    this.tokenExpiry = null
  }
}