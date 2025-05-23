'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSnipeStore } from '@/store/useSnipeStore'
import { fetchAuctionData } from '@/services/ebayService'
import { fetchRealAuctionData } from '@/services/ebayApiService'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [showSnipeModal, setShowSnipeModal] = useState(false)
  const [ebayUrl, setEbayUrl] = useState('')
  const [maxBid, setMaxBid] = useState('')
  const [itemTitle, setItemTitle] = useState('')
  const [currentBid, setCurrentBid] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())
  
  const { snipes, addSnipe, removeSnipe, getActiveSnipes } = useSnipeStore()
  const activeSnipes = getActiveSnipes()
  const wonSnipes = snipes.filter(s => s.status === 'won')

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const handleCreateSnipe = async () => {
    if (ebayUrl && maxBid) {
      try {
        const auctionData = await fetchAuctionData(ebayUrl)
        
        addSnipe({
          ebayUrl,
          maxBid: parseFloat(maxBid),
          title: itemTitle || auctionData.title || 'Untitled Item',
          currentBid: currentBid || auctionData.currentBid || 0,
          endTime: auctionData.endTime?.toISOString() || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          seller: auctionData.seller?.username || 'Unknown Seller'
        })
        
        toast.success('Snipe created successfully!')
        setShowSnipeModal(false)
        setEbayUrl('')
        setMaxBid('')
        setItemTitle('')
        setCurrentBid(null)
      } catch (error) {
        toast.error('Failed to create snipe')
      }
    }
  }

  const formatTimeLeft = (endTime: string) => {
    const endDate = new Date(endTime)
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    
    if (diff <= 0) {
      return "Ended"
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  // Fetch auction data when URL is entered
  const handleUrlChange = async (url: string) => {
    setEbayUrl(url)
    
    if (url.includes('ebay.com') && url.includes('/itm/')) {
      setIsLoading(true)
      try {
        let auctionData
        
        // Try to use real API first, fall back to mock data
        try {
          auctionData = await fetchRealAuctionData(url)
          toast.success('📡 Live data from eBay')
        } catch (apiError) {
          console.log('Real API failed, using mock data:', apiError)
          auctionData = await fetchAuctionData(url)
          toast('📊 Using demo data (Connect eBay account for real data)', { icon: 'ℹ️' })
        }
        
        // Auto-fill the form with fetched data
        if (auctionData.title && !itemTitle) {
          setItemTitle(auctionData.title)
        }
        if (auctionData.currentBid) {
          setCurrentBid(auctionData.currentBid)
        }
        
        // Show auction details in a toast
        if (auctionData.bidCount !== undefined) {
          toast.success(`Found: ${auctionData.bidCount} bids, Current: $${auctionData.currentBid}`)
        }
      } catch (error) {
        console.error('Error fetching auction data:', error)
        toast.error('Failed to fetch auction details')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple via-purple-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            <span className="glow-text">Welcome back, Sniper! 🎯</span>
          </h1>
          <Link href="/settings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                process.env.NEXT_PUBLIC_EBAY_ENVIRONMENT === 'production' 
                  ? 'bg-red-400' 
                  : 'bg-green-400'
              }`} />
              <span className="text-sm">
                {process.env.NEXT_PUBLIC_EBAY_ENVIRONMENT === 'production' 
                  ? 'Production Mode' 
                  : 'Sandbox Mode'}
              </span>
            </motion.div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-1">Active Snipes</h3>
            <p className="text-3xl font-bold">{activeSnipes.length}</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-1">Auctions Won</h3>
            <p className="text-3xl font-bold">{wonSnipes.length}</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-1">Success Rate</h3>
            <p className="text-3xl font-bold">
              {snipes.length > 0 ? Math.round((wonSnipes.length / snipes.length) * 100) : 0}%
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-1">Time Saved</h3>
            <p className="text-3xl font-bold">{snipes.length * 2}h</p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex gap-4 mb-8">
          <Link href="/history" className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-4 cursor-pointer hover:border-neon-pink/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Snipe History</h3>
                  <p className="text-sm text-gray-400 mt-1">View past wins & losses</p>
                </div>
                <Clock className="w-8 h-8 text-neon-pink" />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Active Snipes Display */}
        {activeSnipes.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Active Snipes 🔥</h2>
            <div className="grid gap-4">
              {activeSnipes.map((snipe) => (
                <div key={snipe.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{snipe.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Current: ${snipe.currentBid.toFixed(2)} • Max: ${snipe.maxBid.toFixed(2)}
                    </p>
                    <p className="text-sm text-neon-pink mt-1">
                      Ends in {formatTimeLeft(snipe.endTime)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                      Active
                    </button>
                    <button 
                      onClick={() => removeSnipe(snipe.id)}
                      className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 text-center mb-8">
            <p className="text-xl text-gray-400 mb-4">No active snipes yet</p>
            <button 
              onClick={() => setShowSnipeModal(true)}
              className="neon-button"
            >
              Create Your First Snipe
            </button>
          </div>
        )}

        {/* Quick Add Section */}
        <div className="glass-card p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Add Snipe</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">eBay Item URL</label>
              <input
                type="text"
                value={ebayUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.ebay.com/itm/..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Item Title {isLoading && '(Loading...)'}</label>
              <input
                type="text"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="Enter item title..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50 transition-colors"
              />
            </div>
            
            {currentBid !== null && (
              <div className="p-4 bg-white/5 rounded-lg border border-yellow-500/30">
                <p className="text-sm text-gray-400">Current Bid</p>
                <p className="text-2xl font-bold text-yellow-400">${currentBid.toFixed(2)}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Your Max Bid ($)</label>
              <input
                type="number"
                value={maxBid}
                onChange={(e) => setMaxBid(e.target.value)}
                placeholder="50.00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50 transition-colors"
              />
              {currentBid && maxBid && parseFloat(maxBid) <= currentBid && (
                <p className="text-sm text-red-400 mt-1">⚠️ Your max bid should be higher than current bid</p>
              )}
            </div>
            <button
              onClick={handleCreateSnipe}
              disabled={!ebayUrl || !maxBid}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                ebayUrl && maxBid 
                  ? 'neon-button' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add Snipe
            </button>
          </div>
        </div>

      </div>

      {/* Modal */}
      {showSnipeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Snipe</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">eBay Item URL</label>
                <input
                  type="text"
                  value={ebayUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.ebay.com/itm/..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Item Title {isLoading && '(Loading...)'}</label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="Enter item title..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50"
                />
              </div>
              
              {currentBid !== null && (
                <div className="p-4 bg-white/5 rounded-lg border border-yellow-500/30">
                  <p className="text-sm text-gray-400">Current Bid</p>
                  <p className="text-2xl font-bold text-yellow-400">${currentBid.toFixed(2)}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Max Bid ($)</label>
                <input
                  type="number"
                  value={maxBid}
                  onChange={(e) => setMaxBid(e.target.value)}
                  placeholder="50.00"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50"
                />
                {currentBid && maxBid && parseFloat(maxBid) <= currentBid && (
                  <p className="text-sm text-red-400 mt-1">⚠️ Your max bid should be higher than current bid</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateSnipe}
                  className="flex-1 neon-button"
                >
                  Create Snipe
                </button>
                <button
                  onClick={() => {
                    setShowSnipeModal(false)
                    setEbayUrl('')
                    setItemTitle('')
                    setMaxBid('')
                  }}
                  className="flex-1 px-4 py-3 rounded-full border border-white/20 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}