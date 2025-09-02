# Tech Stack Specification - EngageReward Platform

## Document Overview
This document defines the complete technology stack for the EngageReward platform MVP, including frameworks, libraries, tools, and services.

## Core Technology Decisions ✅

### Frontend Framework
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Node.js Version**: 22 LTS
- **Package Manager**: npm
- **Deployment**: Vercel

### Database & Backend Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Firebase Auth (as per business requirements)
- **Blockchain**: Solana (via Helius RPC)
- **Real-time**: Supabase Realtime subscriptions

### Styling & UI Components
- **CSS Framework**: Tailwind CSS
- **Component Library**: Headless UI + Custom Components
- **Icons**: Heroicons (pairs well with Tailwind/Headless UI)
- **Design System**: Custom design tokens with Tailwind

## Recommended Libraries & Tools

### 1. Form Handling - React Hook Form + Zod 📋

**Why This Combination?**
- **React Hook Form**: Best performance, minimal re-renders, great TypeScript support
- **Zod**: Type-safe validation that works seamlessly with TypeScript
- **Integration**: Excellent resolver for React Hook Form + Zod

```typescript
// Example usage
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  tweetUrl: z.string().url('Must be a valid Twitter URL'),
  budget: z.number().min(1, 'Budget must be at least $1'),
  rewards: z.object({
    like: z.number().min(0),
    comment: z.number().min(0),
    retweet: z.number().min(0)
  })
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const CampaignForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema)
  });

  const onSubmit = (data: CampaignFormData) => {
    // Form data is fully type-safe and validated
  };
};
```

**Installation:**
```bash
npm install react-hook-form @hookform/resolvers zod
```

### 2. Testing Framework - Complete Next.js + TypeScript Setup 🧪

**Recommended Testing Stack:**

```json
{
  "unitTesting": "Jest + React Testing Library",
  "e2eTesting": "Playwright",
  "componentTesting": "Storybook (optional for design system)",
  "apiTesting": "Jest + MSW (Mock Service Worker)",
  "typeChecking": "TypeScript compiler",
  "linting": "ESLint + Prettier"
}
```

**Installation & Configuration:**
```bash
# Core testing dependencies
npm install --save-dev jest @types/jest jest-environment-jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev playwright @playwright/test
npm install --save-dev msw

# TypeScript and linting
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
npm install --save-dev @next/eslint-config-next
```

**Jest Configuration (jest.config.js):**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Playwright Configuration (playwright.config.ts):**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. State Management - Zustand 🗂️

**Why Zustand?**
- Lightweight (2.9kb gzipped)
- Excellent TypeScript support
- No providers needed
- Perfect for your MVP scope

```typescript
// Example store structure
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  twitterHandle?: string;
  creditBalance: number;
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  updateCreditBalance: (balance: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user }),
      updateCreditBalance: (balance) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, creditBalance: balance } : null 
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'app-storage',
    }
  )
);
```

**Installation:**
```bash
npm install zustand
```

### 4. Data Fetching - SWR 📡

**Why SWR over React Query?**
- Created by Vercel team (perfect integration with Next.js)
- Lighter weight for your MVP needs
- Great caching and revalidation
- Excellent TypeScript support

```typescript
// Example API hook
import useSWR from 'swr';
import { Campaign } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCampaigns() {
  const { data, error, isLoading, mutate } = useSWR<Campaign[]>(
    '/api/campaigns',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    campaigns: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
```

**Installation:**
```bash
npm install swr
```

### 5. Additional Recommended Libraries

```bash
# Date handling
npm install date-fns

# Utilities
npm install clsx # For conditional CSS classes
npm install @headlessui/react # UI components
npm install @heroicons/react # Icons

# Solana integration
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets

# Firebase
npm install firebase

# Development tools
npm install --save-dev husky lint-staged
```

## Complete Package.json Scripts 📜

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run type-check && npm run lint && npm run test && npm run test:e2e",
    "prepare": "husky install"
  }
}
```

## Environment Configuration 🔧

### Development (.env.local)
```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id

# Twitter API
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
PLATFORM_WALLET_PRIVATE_KEY=your_wallet_private_key

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Production (Vercel Environment Variables)
- Same variables as above but with production values
- Set through Vercel dashboard manually
- Use Vercel's environment variable encryption for sensitive data

## TypeScript Configuration 📝

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Tailwind CSS Configuration 🎨

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for EngageReward
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## Development Workflow 🔄

### Pre-commit Hooks (Husky + lint-staged)
```json
// .lintstagedrc.json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

### ESLint Configuration (.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

## Monitoring & Analytics 📊

### Vercel Analytics Integration
```typescript
// src/lib/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

// Track custom events
import { track } from '@vercel/analytics';

export const trackEvent = {
  campaignCreated: (campaignId: string) => 
    track('campaign_created', { campaignId }),
  userRegistered: (userId: string) => 
    track('user_registered', { userId }),
  rewardDistributed: (amount: number, userId: string) => 
    track('reward_distributed', { amount, userId }),
};
```

## File Structure Recommendation 📁

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── dashboard/         # Dashboard pages
│   ├── campaigns/         # Campaign pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── firebase.ts        # Firebase config
│   ├── solana.ts          # Solana utilities
│   └── validations.ts     # Zod schemas
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Next Steps 🚀

1. **Set up the development environment** with these exact specifications
2. **Install all recommended packages** using the provided commands
3. **Configure TypeScript, ESLint, and Prettier** with the provided configs
4. **Set up testing framework** with Jest and Playwright
5. **Create initial project structure** following the recommended file organization
6. **Set up environment variables** for development and production

This tech stack provides:
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Developer Experience**: Excellent tooling and hot reload
- ✅ **Performance**: Optimized for production with Next.js and Vercel
- ✅ **Scalability**: Can grow with your platform needs
- ✅ **Testing**: Comprehensive testing strategy
- ✅ **Maintainability**: Clean architecture and consistent patterns

---

*This tech stack specification provides everything needed to start development with confidence and consistency.*
