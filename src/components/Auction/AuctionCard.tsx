'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Clock, Users, TrendingUp, Zap } from 'lucide-react'
import { Auction } from '@/types/auction'
import { formatDistanceToNow } from 'date-fns'

interface AuctionCardProps {
  auction: Auction
  onSnipe?: () => void
  onWatch?: () => void
}

export default function AuctionCard({ auction, onSnipe, onWatch }: AuctionCardProps) {
  const timeLeft = formatDistanceToNow(new Date(auction.endTime), { addSuffix: true })
  const isEndingSoon = new Date(auction.endTime).getTime() - Date.now() < 3600000

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="auction-card"
    >
      <div className="flex gap-4">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={auction.imageUrl}
            alt={auction.title}
            fill
            className="object-cover"
          />
          {isEndingSoon && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              HOT 🔥
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{auction.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className={isEndingSoon ? 'text-red-400 font-bold' : ''}>
                {timeLeft}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{auction.bidCount} bids</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{auction.watchCount} watching</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold glow-text">
              ${auction.currentPrice.toFixed(2)}
            </span>
            {auction.shippingCost > 0 && (
              <span className="text-sm text-gray-500">
                +${auction.shippingCost.toFixed(2)} shipping
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {onSnipe && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSnipe}
                className="neon-button text-sm flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Snipe It
              </motion.button>
            )}
            {onWatch && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWatch}
                className="px-4 py-2 rounded-full border border-white/20 hover:border-white/40 text-sm"
              >
                Watch
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}