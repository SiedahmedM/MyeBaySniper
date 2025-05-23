'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Filter, Calendar, DollarSign } from 'lucide-react'
import Navbar from '@/components/Layout/Navbar'
import SnipeCard from '@/components/Snipe/SnipeCard'
import { useStore } from '@/store/useStore'

type FilterStatus = 'all' | 'scheduled' | 'active' | 'completed' | 'failed'

export default function SnipesPage() {
  const { snipes } = useStore()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<'time' | 'price'>('time')

  const filteredSnipes = snipes.filter(snipe => 
    filterStatus === 'all' || snipe.status === filterStatus
  )

  const sortedSnipes = [...filteredSnipes].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(a.bidTime).getTime() - new Date(b.bidTime).getTime()
    }
    return b.maxBid - a.maxBid
  })

  const statusCounts = {
    all: snipes.length,
    scheduled: snipes.filter(s => s.status === 'scheduled').length,
    active: snipes.filter(s => s.status === 'active').length,
    completed: snipes.filter(s => s.status === 'completed').length,
    failed: snipes.filter(s => s.status === 'failed').length,
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="glow-text">Your Snipes 🎯</span>
            </h1>
            <p className="text-gray-400">Manage and track all your auction snipes</p>
          </motion.div>

          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">Filter by Status</label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'scheduled', 'active', 'completed', 'failed'] as FilterStatus[]).map((status) => (
                    <motion.button
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterStatus(status)}
                      className={`
                        px-4 py-2 rounded-full capitalize transition-all
                        ${filterStatus === status 
                          ? 'bg-gradient-to-r from-neon-pink to-neon-blue text-white' 
                          : 'bg-white/10 hover:bg-white/20'
                        }
                      `}
                    >
                      {status} ({statusCounts[status]})
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="lg:w-48">
                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'time' | 'price')}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-neon-pink/50"
                >
                  <option value="time">Snipe Time</option>
                  <option value="price">Max Bid</option>
                </select>
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {sortedSnipes.length > 0 ? (
              <div className="grid gap-4">
                {sortedSnipes.map((snipe) => (
                  <motion.div
                    key={snipe.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <SnipeCard
                      snipe={snipe}
                      onEdit={() => console.log('Edit snipe:', snipe.id)}
                      onCancel={() => console.log('Cancel snipe:', snipe.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-xl text-gray-400 mb-4">
                  No {filterStatus !== 'all' ? filterStatus : ''} snipes found
                </p>
                <p className="text-sm text-gray-500">
                  {filterStatus === 'all' 
                    ? "Start by adding items from your watchlist or searching eBay"
                    : "Try changing your filter to see more snipes"
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}