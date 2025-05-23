import { create } from 'zustand'

export interface Snipe {
  id: string
  ebayUrl: string
  maxBid: number
  title: string
  currentBid: number
  endTime: string
  status: 'active' | 'won' | 'pending' | 'outbid'
  seller?: string
  finalPrice?: number
  createdAt: Date
}

interface SnipeStore {
  snipes: Snipe[]
  addSnipe: (snipe: Omit<Snipe, 'id' | 'createdAt'>) => void
  updateSnipe: (id: string, updates: Partial<Snipe>) => void
  removeSnipe: (id: string) => void
  getActiveSnipes: () => Snipe[]
  getHistoricalSnipes: () => Snipe[]
}

export const useSnipeStore = create<SnipeStore>((set, get) => ({
      snipes: [],
      
      addSnipe: (snipeData) => {
        const newSnipe: Snipe = {
          ...snipeData,
          id: Date.now().toString(),
          createdAt: new Date(),
          status: 'pending',
          seller: snipeData.seller || 'Unknown Seller'
        }
        set((state) => ({ snipes: [...state.snipes, newSnipe] }))
      },
      
      updateSnipe: (id, updates) => {
        set((state) => ({
          snipes: state.snipes.map((snipe) =>
            snipe.id === id ? { ...snipe, ...updates } : snipe
          )
        }))
      },
      
      removeSnipe: (id) => {
        set((state) => ({
          snipes: state.snipes.filter((snipe) => snipe.id !== id)
        }))
      },
      
      getActiveSnipes: () => {
        return get().snipes.filter(
          (s) => s.status === 'active' || s.status === 'pending'
        )
      },
      
      getHistoricalSnipes: () => {
        return get().snipes
      }
}))