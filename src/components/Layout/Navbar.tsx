'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, Eye, Users, BarChart3, Settings, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/snipes', label: 'Snipes', icon: Target },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="glass-card m-4 p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Zap className="w-8 h-8 text-neon-pink" />
          </motion.div>
          <span className="text-2xl font-bold glow-text">MyeBaySniper</span>
        </Link>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-full flex items-center space-x-2
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-neon-pink to-neon-blue text-white' 
                      : 'hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden lg:block font-medium">
                    {item.label}
                  </span>
                </motion.div>
                
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 16, 240, 0.5)'
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue p-[2px]">
              <div className="w-full h-full rounded-full bg-dark-purple flex items-center justify-center">
                <span className="text-sm font-bold">MS</span>
              </div>
            </div>
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-purple" />
          </motion.button>
        </div>
      </div>
    </nav>
  )
}