'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, XCircle, AlertCircle, Filter, Calendar } from 'lucide-react'
import SimpleNav from '@/components/Layout/SimpleNav'
import { useSnipeStore } from '@/store/useSnipeStore'

// Mock data for demonstration - remove this when you have real data
const mockHistoricalSnipes = [
  {
    id: '1',
    title: 'MacBook Pro 16" M3 Max - 64GB RAM',
    finalPrice: 2899,
    yourBid: 3000,
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'won',
    seller: 'techdeals2024',
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    finalPrice: 289,
    yourBid: 250,
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'outbid',
    seller: 'audiostore',
  },
  {
    id: '3',
    title: 'Nintendo Switch OLED - White',
    finalPrice: 0,
    yourBid: 320,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    seller: 'gamingworld',
  },
  {
    id: '4',
    title: 'Air Jordan 1 Retro High OG',
    finalPrice: 185,
    yourBid: 180,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'outbid',
    seller: 'sneakerhead92',
  },
  {
    id: '5',
    title: 'iPad Pro 12.9" M2 - 256GB',
    finalPrice: 899,
    yourBid: 950,
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'won',
    seller: 'applereseller',
  },
]

type FilterType = 'all' | 'won' | 'pending' | 'outbid'

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date')
  
  const { snipes: storeSnipes } = useSnipeStore()
  
  // Combine store snipes with mock data for now
  const allSnipes = [
    ...storeSnipes.map(snipe => ({
      ...snipe,
      yourBid: snipe.maxBid,
      finalPrice: snipe.finalPrice || 0,
      seller: snipe.seller || 'Unknown'
    })),
    ...mockHistoricalSnipes
  ]

  const filteredSnipes = allSnipes.filter(snipe => 
    filter === 'all' || snipe.status === filter
  )

  const sortedSnipes = [...filteredSnipes].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
    }
    return b.finalPrice - a.finalPrice
  })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'won':
        return { 
          icon: Trophy, 
          color: 'text-green-400', 
          bg: 'bg-green-400/20',
          label: 'Won' 
        }
      case 'pending':
        return { 
          icon: Clock, 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-400/20',
          label: 'Pending' 
        }
      case 'outbid':
        return { 
          icon: XCircle, 
          color: 'text-red-400', 
          bg: 'bg-red-400/20',
          label: 'Sniped by Others' 
        }
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-gray-400', 
          bg: 'bg-gray-400/20',
          label: 'Unknown' 
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const stats = {
    won: allSnipes.filter(s => s.status === 'won').length,
    pending: allSnipes.filter(s => s.status === 'pending').length,
    outbid: allSnipes.filter(s => s.status === 'outbid').length,
    totalValue: allSnipes.filter(s => s.status === 'won').reduce((sum, s) => sum + s.finalPrice, 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple via-purple-900 to-black text-white">
      <SimpleNav />
      <div className="px-8 pb-8">
        <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="glow-text">Snipe History 📚</span>
          </h1>
          <p className="text-gray-400">Track your wins and learn from your losses</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Wins</p>
                <p className="text-3xl font-bold text-green-400">{stats.won}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sniped by Others</p>
                <p className="text-3xl font-bold text-red-400">{stats.outbid}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Won Value</p>
                <p className="text-3xl font-bold glow-text">${stats.totalValue}</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'won', 'pending', 'outbid'] as FilterType[]).map((filterType) => {
                  const label = filterType === 'outbid' ? 'Sniped by Others' : filterType.charAt(0).toUpperCase() + filterType.slice(1)
                  return (
                    <motion.button
                      key={filterType}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter(filterType)}
                      className={`
                        px-4 py-2 rounded-full capitalize transition-all
                        ${filter === filterType 
                          ? 'bg-gradient-to-r from-neon-pink to-neon-blue text-white' 
                          : 'bg-white/10 hover:bg-white/20'
                        }
                      `}
                    >
                      {label}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="lg:w-48">
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-neon-pink/50"
              >
                <option value="date">Date</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Snipe History List */}
        <AnimatePresence mode="popLayout">
          {sortedSnipes.length > 0 ? (
            <div className="grid gap-4">
              {sortedSnipes.map((snipe, index) => {
                const statusConfig = getStatusConfig(snipe.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <motion.div
                    key={snipe.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{snipe.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>Seller: {snipe.seller}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(snipe.endTime)}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-6">
                          <div>
                            <p className="text-xs text-gray-400">Your Bid</p>
                            <p className="text-lg font-semibold">${snipe.yourBid}</p>
                          </div>
                          {snipe.status !== 'pending' && (
                            <div>
                              <p className="text-xs text-gray-400">Final Price</p>
                              <p className={`text-lg font-semibold ${
                                snipe.status === 'won' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                ${snipe.finalPrice}
                              </p>
                            </div>
                          )}
                          {snipe.status === 'won' && (
                            <div>
                              <p className="text-xs text-gray-400">You Saved</p>
                              <p className="text-lg font-semibold text-neon-pink">
                                ${snipe.yourBid - snipe.finalPrice}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-semibold">{statusConfig.label}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Filter className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-xl text-gray-400 mb-4">No snipes found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  )
}