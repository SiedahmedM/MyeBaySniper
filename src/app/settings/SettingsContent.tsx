'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link2, CheckCircle, AlertCircle, Clock, Bell, ExternalLink } from 'lucide-react'
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
    // For production, you'll need the production RuName from eBay
    const sessionId = btoa(Date.now().toString()).replace(/=/g, '')
    
    // IMPORTANT: Replace with your production RuName from eBay Developer Dashboard
    // Get it from: https://developer.ebay.com/my/auth/?env=production&index=0
    const runame = 'YOUR_PRODUCTION_RUNAME' // Example format: YourName-AppName-PRD-1234abcd-5678efgh
    
    // Use the production eBay Sign-In flow
    const oauthUrl = `https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&runame=${runame}&SessID=${sessionId}`
    
    window.open(oauthUrl, '_blank', 'width=600,height=700')
    
    toast('Complete the login in the popup window', { icon: '🔐' })
    
    // Show warning for production
    setTimeout(() => {
      toast('⚠️ This will connect your REAL eBay account!', { icon: '💰', duration: 6000 })
    }, 2000)
    
    setTimeout(() => {
      toast('Real money will be used for bids!', { icon: '💵', duration: 6000 })
    }, 4000)
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
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              isConnected 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'neon-button'
            }`}
          >
            {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect to eBay'}
            {!isConnected && <ExternalLink className="w-4 h-4" />}
          </motion.button>
        </div>
        
        {process.env.NEXT_PUBLIC_EBAY_ENVIRONMENT === 'production' ? (
          <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
            <p className="text-sm text-red-400">
              ⚠️ PRODUCTION MODE: Real money will be used for bids! Start with cheap items to test.
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-400">
              🧪 SANDBOX MODE: Testing environment - no real money involved.
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
          <h3 className="text-sm font-semibold mb-2 text-gray-400">eBay OAuth Info</h3>
          <p className="text-xs text-gray-500 mb-2">
            Due to eBay's OAuth limitations, the connection process opens in a new window.
            After completing the eBay login, the auth token needs to be manually retrieved.
          </p>
          <p className="text-xs text-gray-500 mb-2">
            For production apps, you'd implement a server-side OAuth flow with proper redirect handling.
          </p>
          <div className="mt-2">
            <p className="text-xs text-gray-400">Environment: PRODUCTION</p>
            <p className="text-xs text-gray-400">RuName: Need to get production RuName from eBay</p>
            <p className="text-xs text-gray-400">⚠️ Real money mode - test with cheap items first!</p>
          </div>
        </motion.div>
      )}
    </>
  )
}