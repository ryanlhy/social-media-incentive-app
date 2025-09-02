# EngageReward Platform

A Solana-based social incentive platform for community engagement campaigns where community leaders reward authentic social media engagement with instant USDC payments.

## 🚀 Features

- **Instant USDC Rewards**: Automated payments on Solana blockchain
- **Twitter Integration**: Verified engagement through Twitter API
- **Campaign Management**: 24-hour raid campaigns with custom rewards
- **Community Focused**: Built for low-cap projects and early-stage startups
- **Real-time Tracking**: Live engagement metrics and reward distribution

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Firebase Auth
- **Blockchain**: Solana (via Helius RPC)
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library + Playwright
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 22+ 
- npm 10+
- Git

## 🏃‍♂️ Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd engagereward-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp env.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id

# Twitter API
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
PLATFORM_WALLET_PRIVATE_KEY=your_platform_wallet_private_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:all` - Run all tests and checks

## 🏗 Project Structure

```
engagereward-platform/
├── docs/                              # Documentation
│   ├── business/                      # Business requirements
│   └── technical/                     # Technical specifications
├── src/                               # Source code
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   ├── dashboard/                # Dashboard pages
│   │   ├── campaigns/                # Campaign pages
│   │   └── api/                      # API routes
│   ├── components/                   # React components
│   │   ├── ui/                       # Base UI components
│   │   ├── forms/                    # Form components
│   │   └── layout/                   # Layout components
│   ├── lib/                          # Utility libraries
│   ├── hooks/                        # Custom React hooks
│   ├── stores/                       # Zustand stores
│   ├── types/                        # TypeScript definitions
│   └── utils/                        # Utility functions
├── tests/                            # Test files
│   ├── unit/                         # Unit tests
│   ├── integration/                  # Integration tests
│   └── e2e/                          # End-to-end tests
└── public/                           # Static assets
```

## 🧪 Testing

The project uses a comprehensive testing strategy:

- **Unit Tests**: Jest + React Testing Library for component testing
- **Integration Tests**: API and database integration testing
- **E2E Tests**: Playwright for full user journey testing

Run specific test suites:
```bash
# Unit tests only
npm run test

# E2E tests only
npm run test:e2e

# All tests
npm run test:all
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `engagereward-dev` |
| `TWITTER_CLIENT_ID` | Twitter API client ID | `your_twitter_client_id` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics ID | - |
| `HELIUS_API_KEY` | Helius RPC API key | - |
| `BASE_URL` | Base URL for testing | `http://localhost:3000` |

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **Business Requirements**: User stories, functional requirements, risk assessment
- **Technical Specifications**: Architecture, API documentation, database schema
- **Testing Strategy**: Test plans and quality assurance processes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test:all`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**TypeScript Errors**
```bash
# Check types
npm run type-check
```

**Test Failures**
```bash
# Run tests in watch mode for debugging
npm run test:watch
```

### Getting Help

- Check the [documentation](./docs/)
- Open an issue on GitHub
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Solana](https://solana.com/)
- UI components from [Headless UI](https://headlessui.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

**EngageReward Platform** - Revolutionizing social media engagement with blockchain rewards.
