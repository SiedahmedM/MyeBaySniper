import { create } from 'zustand'
import { Auction, Snipe, Account, BidGroup } from '@/types/auction'

interface AppState {
  accounts: Account[]
  activeAccountId: string | null
  snipes: Snipe[]
  watchlist: Auction[]
  bidGroups: BidGroup[]
  
  setActiveAccount: (accountId: string) => void
  addSnipe: (snipe: Snipe) => void
  updateSnipe: (snipeId: string, updates: Partial<Snipe>) => void
  removeSnipe: (snipeId: string) => void
  addToWatchlist: (auction: Auction) => void
  removeFromWatchlist: (auctionId: string) => void
  addBidGroup: (group: BidGroup) => void
  updateBidGroup: (groupId: string, updates: Partial<BidGroup>) => void
}

export const useStore = create<AppState>((set) => ({
  accounts: [],
  activeAccountId: null,
  snipes: [],
  watchlist: [],
  bidGroups: [],
  
  setActiveAccount: (accountId) => set({ activeAccountId: accountId }),
  
  addSnipe: (snipe) => set((state) => ({ 
    snipes: [...state.snipes, snipe] 
  })),
  
  updateSnipe: (snipeId, updates) => set((state) => ({
    snipes: state.snipes.map(snipe => 
      snipe.id === snipeId ? { ...snipe, ...updates } : snipe
    )
  })),
  
  removeSnipe: (snipeId) => set((state) => ({
    snipes: state.snipes.filter(snipe => snipe.id !== snipeId)
  })),
  
  addToWatchlist: (auction) => set((state) => ({
    watchlist: [...state.watchlist, auction]
  })),
  
  removeFromWatchlist: (auctionId) => set((state) => ({
    watchlist: state.watchlist.filter(auction => auction.id !== auctionId)
  })),
  
  addBidGroup: (group) => set((state) => ({
    bidGroups: [...state.bidGroups, group]
  })),
  
  updateBidGroup: (groupId, updates) => set((state) => ({
    bidGroups: state.bidGroups.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    )
  })),
}))