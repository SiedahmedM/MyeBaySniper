'use client'

import { motion } from 'framer-motion'
import { Snipe } from '@/types/auction'
import { formatDistanceToNow } from 'date-fns'
import { Clock, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface SnipeCardProps {
  snipe: Snipe
  onEdit?: () => void
  onCancel?: () => void
}

const statusConfig = {
  scheduled: { color: 'text-blue-400', bg: 'bg-blue-400/20', icon: Clock },
  active: { color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: AlertCircle },
  completed: { color: 'text-green-400', bg: 'bg-green-400/20', icon: CheckCircle },
  failed: { color: 'text-red-400', bg: 'bg-red-400/20', icon: XCircle },
  cancelled: { color: 'text-gray-400', bg: 'bg-gray-400/20', icon: XCircle },
}

export default function SnipeCard({ snipe, onEdit, onCancel }: SnipeCardProps) {
  const config = statusConfig[snipe.status]
  const StatusIcon = config.icon
  const timeUntilSnipe = formatDistanceToNow(new Date(snipe.bidTime), { addSuffix: true })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{snipe.auction.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Seller: {snipe.auction.sellerName}</span>
            <span>•</span>
            <span>{snipe.auction.bidCount} bids</span>
          </div>
        </div>
        <div className={`status-badge ${config.bg} ${config.color} flex items-center gap-2`}>
          <StatusIcon className="w-4 h-4" />
          {snipe.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">Current Price</p>
          <p className="text-xl font-bold">${snipe.auction.currentPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Your Max Bid</p>
          <p className="text-xl font-bold text-neon-pink">${snipe.maxBid.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Snipe Time</p>
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {timeUntilSnipe}
        </p>
      </div>

      {snipe.conditions && snipe.conditions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Conditions</p>
          <div className="flex flex-wrap gap-2">
            {snipe.conditions.map((condition, index) => (
              <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                {condition.type.replace('_', ' ')}: ${condition.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {snipe.status === 'scheduled' && (
        <div className="flex gap-2">
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex-1 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 text-sm"
            >
              Edit
            </motion.button>
          )}
          {onCancel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm"
            >
              Cancel
            </motion.button>
          )}
        </div>
      )}

      {snipe.result && (
        <div className={`mt-4 p-4 rounded-lg ${snipe.result.winning ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <p className="font-semibold mb-1">
            {snipe.result.winning ? '🎉 You Won!' : '😔 Outbid'}
          </p>
          <p className="text-sm">
            Final Price: ${snipe.result.finalPrice.toFixed(2)}
          </p>
          {snipe.result.error && (
            <p className="text-sm text-red-400 mt-1">{snipe.result.error}</p>
          )}
        </div>
      )}
    </motion.div>
  )
}