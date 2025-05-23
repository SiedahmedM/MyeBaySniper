import { Suspense } from 'react'
import SimpleNav from '@/components/Layout/SimpleNav'
import SettingsContent from './SettingsContent'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple via-purple-900 to-black text-white">
      <SimpleNav />
      <div className="px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <SettingsContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}