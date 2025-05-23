import { NextRequest, NextResponse } from 'next/server'
import { EbayAPI } from '@/lib/ebay/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const api = new EbayAPI()
    const item = await api.getItem(params.itemId)
    
    // Transform eBay API response to our format
    const transformedItem = {
      itemId: item.itemId,
      title: item.title,
      currentBid: parseFloat(item.currentBidPrice?.value || item.price.value),
      buyItNowPrice: item.buyItNowPrice ? parseFloat(item.buyItNowPrice.value) : undefined,
      shippingCost: item.shippingOptions?.[0]?.shippingCost 
        ? parseFloat(item.shippingOptions[0].shippingCost.value) 
        : 0,
      bidCount: item.bidCount || 0,
      endTime: item.itemEndDate,
      seller: {
        username: item.seller.username,
        feedbackScore: item.seller.feedbackScore,
        feedbackPercentage: parseFloat(item.seller.feedbackPercentage)
      },
      imageUrl: item.image?.imageUrl,
      condition: item.condition,
      location: `${item.itemLocation.city}, ${item.itemLocation.stateOrProvince}`
    }
    
    return NextResponse.json(transformedItem)
  } catch (error) {
    console.error('Error fetching eBay item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item details' },
      { status: 500 }
    )
  }
}