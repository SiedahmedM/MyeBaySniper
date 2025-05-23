# MyeBaySniper 🎯

A modern eBay auction sniper, featuring automated last-second bidding, real-time tracking, and a stunning neon-themed UI.

## Features

- **Automated Sniping**: Place bids 5-10 seconds before auction ends
- **Multi-Account Support**: Manage multiple eBay accounts
- **Smart Bidding**: Set conditions like max shipping costs
- **Bid Groups**: Win one item from a group and cancel the rest
- **Real-time Tracking**: Monitor auction status and competitor activity
- **Analytics Dashboard**: Track success rates and spending

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS with custom neon theme
- Framer Motion for animations
- Zustand for state management
- React Query for data fetching

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/          # Next.js app router pages
├── components/   # Reusable UI components
├── types/        # TypeScript type definitions
├── store/        # Zustand store
├── services/     # API services (to be implemented)
├── hooks/        # Custom React hooks
└── utils/        # Utility functions
```

## Design System

The UI features a Gen Z-focused design with:
- Neon pink (#FF10F0) and blue (#00FFF0) accents
- Dark purple backgrounds
- Glassmorphism effects
- Smooth animations and micro-interactions
- Mobile-first responsive design
