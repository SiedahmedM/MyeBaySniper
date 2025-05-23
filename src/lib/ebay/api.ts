import { ebayConfig } from './config'
import { EbayAuth } from './auth'

export interface EbayItem {
  itemId: string
  title: string
  price: {
    value: string
    currency: string
  }
  currentBidPrice?: {
    value: string
    currency: string
  }
  buyItNowPrice?: {
    value: string
    currency: string
  }
  bidCount: number
  itemEndDate: string
  seller: {
    username: string
    feedbackPercentage: string
    feedbackScore: number
  }
  shippingOptions: Array<{
    shippingCost: {
      value: string
      currency: string
    }
  }>
  image: {
    imageUrl: string
  }
  condition: string
  itemLocation: {
    city: string
    stateOrProvince: string
    country: string
  }
}

export class EbayAPI {
  private auth: EbayAuth

  constructor() {
    this.auth = EbayAuth.getInstance()
  }

  // Get item details using Browse API
  async getItem(itemId: string): Promise<EbayItem> {
    // Check for manual token first
    const manualToken = typeof window !== 'undefined' 
      ? localStorage.getItem('ebay_oauth_token') 
      : null
    
    const token = manualToken || await this.auth.getClientToken()
    
    const response = await fetch(
      `${ebayConfig.apiUrl}/buy/browse/v1/item/v1|${itemId}|0`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch item: ${response.statusText}`)
    }

    return response.json()
  }

  // Search for items
  async searchItems(query: string, limit = 10): Promise<any> {
    const token = await this.auth.getClientToken()
    
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    })

    const response = await fetch(
      `${ebayConfig.apiUrl}/buy/browse/v1/item_summary/search?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to search items: ${response.statusText}`)
    }

    return response.json()
  }

  // Place a bid (requires user authentication)
  async placeBid(itemId: string, bidAmount: number): Promise<any> {
    // Check for manual token first
    const manualToken = typeof window !== 'undefined' 
      ? localStorage.getItem('ebay_oauth_token') 
      : null
    
    const token = manualToken || await this.auth.getAccessToken()
    
    const response = await fetch(
      `${ebayConfig.apiUrl}/buy/offer/v1_beta/bidding/place_proxy_bid`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        },
        body: JSON.stringify({
          itemId,
          maxAmount: {
            value: bidAmount.toString(),
            currency: 'USD'
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to place bid: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  // Get user's bidding activity
  async getBiddingActivity(): Promise<any> {
    const token = await this.auth.getAccessToken()
    
    const response = await fetch(
      `${ebayConfig.apiUrl}/buy/browse/v1/bidding/activity`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch bidding activity: ${response.statusText}`)
    }

    return response.json()
  }

  // Get won items
  async getWonItems(): Promise<any> {
    const token = await this.auth.getAccessToken()
    
    const response = await fetch(
      `${ebayConfig.apiUrl}/buy/order/v2/guest_checkout_session`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch won items: ${response.statusText}`)
    }

    return response.json()
  }
}

// Helper function to extract item ID from eBay URL
export function extractItemIdFromUrl(url: string): string | null {
  // eBay URLs can have different formats:
  // https://www.ebay.com/itm/1234567890
  // https://www.ebay.com/itm/item-name/1234567890
  const match = url.match(/\/itm\/(?:.*\/)?(\d+)/)
  return match ? match[1] : null
}