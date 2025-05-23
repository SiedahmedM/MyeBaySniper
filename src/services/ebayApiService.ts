import { extractItemIdFromUrl } from '@/lib/ebay/api'

export interface AuctionData {
  itemId: string
  title: string
  currentBid: number
  buyItNowPrice?: number
  shippingCost: number
  endTime: Date
  seller: {
    username: string
    feedbackScore: number
    feedbackPercentage: number
  }
  bidCount: number
  imageUrl?: string
  condition: string
  location: string
}

export async function fetchRealAuctionData(url: string): Promise<AuctionData> {
  const itemId = extractItemIdFromUrl(url)
  if (!itemId) {
    throw new Error('Invalid eBay URL')
  }

  try {
    const response = await fetch(`/api/ebay/item/${itemId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch item')
    }
    
    const data = await response.json()
    
    return {
      ...data,
      endTime: new Date(data.endTime)
    }
  } catch (error) {
    console.error('Error fetching auction data:', error)
    throw error
  }
}

export async function placeBid(itemId: string, amount: number): Promise<any> {
  try {
    const response = await fetch('/api/ebay/bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId,
        amount
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to place bid')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error placing bid:', error)
    throw error
  }
}