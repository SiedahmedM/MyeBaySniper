'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface TokenInputProps {
  onTokenSave: (token: string) => void
}

export default function TokenInput({ onTokenSave }: TokenInputProps) {
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = () => {
    if (!token.trim()) {
      toast.error('Please enter a token')
      return
    }
    
    // Save token to localStorage
    localStorage.setItem('ebay_oauth_token', token)
    localStorage.setItem('ebay_connected', 'true')
    onTokenSave(token)
    toast.success('Token saved successfully!')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    toast.success('Token copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Key className="w-5 h-5" />
        Manual Token Entry
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            OAuth Token from eBay API Explorer
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your OAuth token here..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50 pr-24"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={() => setShowToken(!showToken)}
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                {showToken ? '👁️' : '👁️‍🗨️'}
              </button>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                disabled={!token}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>To get a token:</p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Go to eBay API Explorer</li>
            <li>Select Trading API (for bidding) or Browse API (for searching)</li>
            <li>Click "Get OAuth User Token"</li>
            <li>Copy the generated token and paste it here</li>
          </ol>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!token.trim()}
          className="w-full py-3 rounded-lg font-semibold transition-all neon-button disabled:opacity-50"
        >
          Save Token
        </motion.button>
      </div>
    </motion.div>
  )
}