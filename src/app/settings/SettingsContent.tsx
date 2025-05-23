'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link2, CheckCircle, AlertCircle, Clock, Bell } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SettingsContent() {
  const searchParams = useSearchParams()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false)

  useEffect(() => {
    // Check URL params for auth status
    const success = searchParams?.get('success')
    const error = searchParams?.get('error')
    
    if (success === 'true') {
      setIsConnected(true)
      toast.success('Successfully connected to eBay!')
    } else if (error) {
      toast.error(`Authentication failed: ${error}`)
    }
  }, [searchParams])

  const handleConnectEbay = () => {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_EBAY_APP_ID) {
      toast.error('eBay API not configured. Contact support.')
      return
    }
    
    setIsLoading(true)
    window.location.href = '/api/auth/ebay'
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    toast.success('Disconnected from eBay')
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="glow-text">Settings ⚙️</span>
        </h1>
        <p className="text-gray-400">Manage your sniper preferences</p>
      </motion.div>

      {/* eBay Connection - User Friendly */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Link2 className="w-6 h-6" />
              eBay Account
            </h2>
            <p className="text-gray-400 mb-4">
              Connect your eBay account to enable automatic bidding on real auctions.
            </p>
            
            {isConnected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Connected to eBay</span>
                </div>
                <div className="text-sm text-gray-400">
                  <p>✓ View real-time auction data</p>
                  <p>✓ Place automatic bids</p>
                  <p>✓ Track your bidding history</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>Using Demo Mode</span>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Connect to eBay to:</p>
                  <p>• See real auction prices</p>
                  <p>• Place actual bids</p>
                  <p>• Win real items</p>
                </div>
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isConnected ? handleDisconnect : handleConnectEbay}
            disabled={isLoading}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              isConnected 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'neon-button'
            }`}
          >
            {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect to eBay'}
          </motion.button>
        </div>
        
        {!process.env.NEXT_PUBLIC_EBAY_APP_ID && (
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <p className="text-sm text-yellow-400">
              ⚠️ eBay integration is not configured. Running in demo mode only.
            </p>
          </div>
        )}
      </motion.div>

      {/* Snipe Settings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Snipe Preferences
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              When to Place Bid
            </label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50">
              <option value="5">5 seconds before end (Recommended)</option>
              <option value="3">3 seconds before end (Risky)</option>
              <option value="10">10 seconds before end (Safe)</option>
              <option value="15">15 seconds before end (Very Safe)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Shorter times increase win chances but risk connection issues
            </p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Bidding Strategy
            </label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50">
              <option value="exact">Bid Exact Amount</option>
              <option value="increment">Add Minimum Increment</option>
              <option value="aggressive">Add 5% Extra</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Max Concurrent Snipes
            </label>
            <input
              type="number"
              defaultValue="5"
              min="1"
              max="20"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-neon-pink/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notifications
        </h2>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <span className="text-sm">Bid Placed</span>
              <p className="text-xs text-gray-500">Get notified when your snipe bid is placed</p>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <span className="text-sm">Auction Won</span>
              <p className="text-xs text-gray-500">Celebrate your victories!</p>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <span className="text-sm">Outbid</span>
              <p className="text-xs text-gray-500">Know when someone snipes you</p>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <div>
              <span className="text-sm">Price Alerts</span>
              <p className="text-xs text-gray-500">Get notified of significant price changes</p>
            </div>
          </label>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="neon-button w-full py-3"
        onClick={() => toast.success('Settings saved!')}
      >
        Save All Settings
      </motion.button>

      {/* Developer Mode Toggle - Hidden at bottom */}
      <div className="mt-12 text-center">
        <button
          onClick={() => setShowDeveloperInfo(!showDeveloperInfo)}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          {showDeveloperInfo ? 'Hide' : 'Show'} Developer Info
        </button>
      </div>

      {/* Developer Info - Only shown when toggled */}
      {showDeveloperInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-black/50 rounded-lg border border-gray-800"
        >
          <h3 className="text-sm font-semibold mb-2 text-gray-400">Developer Setup</h3>
          <p className="text-xs text-gray-500 mb-2">
            To enable eBay API integration, set these environment variables:
          </p>
          <pre className="text-xs bg-black/50 p-2 rounded overflow-x-auto">
{`NEXT_PUBLIC_EBAY_APP_ID=xxx
EBAY_CLIENT_ID=xxx
EBAY_CLIENT_SECRET=xxx
EBAY_REDIRECT_URI=http://localhost:3000/api/auth/ebay/callback`}
          </pre>
          <a 
            href="https://developer.ebay.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-neon-pink hover:underline mt-2 inline-block"
          >
            Get API credentials →
          </a>
        </motion.div>
      )}
    </>
  )
}