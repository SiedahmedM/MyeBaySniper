'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SimpleNav() {
  return (
    <nav className="glass-card m-4 p-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </motion.div>
        </Link>
        
        <div className="text-2xl font-bold glow-text">MyeBaySniper</div>
      </div>
    </nav>
  )
}