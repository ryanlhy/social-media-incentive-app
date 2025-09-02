// Application constants

export const APP_CONFIG = {
  name: 'EngageReward Platform',
  version: '0.1.0',
  description: 'Solana-based social incentive platform for community engagement campaigns',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const SOLANA_CONFIG = {
  network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  commitment: 'confirmed',
} as const;

export const CAMPAIGN_CONFIG = {
  maxDurationHours: 24,
  minRewardAmount: 0.01, // USDC
  maxRewardAmount: 10.0, // USDC
  supportedEngagementTypes: ['like', 'comment', 'retweet'] as const,
} as const;

export const TWITTER_CONFIG = {
  baseUrl: 'https://api.twitter.com/2',
  maxRetries: 3,
  retryDelay: 1000, // ms
} as const;

export const UI_CONFIG = {
  toastDuration: 5000, // ms
  loadingDelay: 200, // ms
  animationDuration: 300, // ms
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  campaigns: '/campaigns',
  profile: '/profile',
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
  },
  campaigns: {
    list: '/api/campaigns',
    create: '/api/campaigns',
    detail: (id: string) => `/api/campaigns/${id}`,
    register: (id: string) => `/api/campaigns/${id}/register`,
    verify: (id: string) => `/api/campaigns/${id}/verify`,
  },
  users: {
    profile: '/api/users/profile',
    credits: '/api/users/credits',
    earnings: '/api/users/earnings',
  },
  payments: {
    deposit: '/api/payments/deposit',
    distribute: '/api/payments/distribute',
  },
} as const;
