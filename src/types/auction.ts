export interface Auction {
  id: string
  itemId: string
  title: string
  imageUrl: string
  currentPrice: number
  buyItNowPrice?: number
  shippingCost: number
  endTime: Date
  timeLeft: string
  sellerName: string
  sellerRating: number
  bidCount: number
  watchCount: number
  condition: string
  location: string
  url: string
}

export interface Snipe {
  id: string
  auctionId: string
  auction: Auction
  maxBid: number
  bidTime: Date
  status: 'scheduled' | 'active' | 'completed' | 'failed' | 'cancelled'
  accountId: string
  groupId?: string
  conditions?: BidCondition[]
  result?: SnipeResult
  createdAt: Date
  updatedAt: Date
}

export interface BidCondition {
  type: 'max_shipping' | 'min_rating' | 'max_total' | 'bid_increment'
  value: number
}

export interface SnipeResult {
  winning: boolean
  finalPrice: number
  bidPlaced: boolean
  error?: string
  timestamp: Date
}

export interface BidGroup {
  id: string
  name: string
  strategy: 'win_one' | 'win_all'
  maxBudget: number
  snipes: string[]
  active: boolean
}

export interface Account {
  id: string
  username: string
  isActive: boolean
  lastSync: Date
  stats: {
    totalBids: number
    wonAuctions: number
    totalSpent: number
    successRate: number
  }
}