import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg">
                <div className="container-custom">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                                <span className="text-sm font-bold text-white">ER</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                EngageReward
                            </span>
                        </div>
                        <nav className="hidden space-x-8 md:flex">
                            <Link
                                href="#features"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                Features
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                How It Works
                            </Link>
                            <Link
                                href="/login"
                                className="btn-primary text-sm"
                            >
                                Get Started
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="py-20 lg:py-32">
                    <div className="container-custom">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="heading-1 mb-6">
                                Earn{' '}
                                <span className="solana-gradient bg-clip-text text-transparent">
                                    USDC Rewards
                                </span>{' '}
                                for Social Engagement
                            </h1>
                            <p className="body-large mb-8 mx-auto max-w-2xl">
                                Join the first Solana-based platform where community leaders
                                reward authentic social media engagement with instant USDC
                                payments.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href="/register"
                                    className="btn-primary inline-flex items-center px-8 py-3 text-base"
                                >
                                    Start Earning Today
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="btn-outline inline-flex items-center px-8 py-3 text-base"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="container-custom">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="heading-2 mb-4">Why Choose EngageReward?</h2>
                            <p className="body-large">
                                The most efficient way to grow your community and earn rewards
                                for authentic engagement.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="card text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                                        <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                </div>
                                <h3 className="heading-4 mb-2">Instant USDC Payments</h3>
                                <p className="body-base">
                                    Get paid instantly in USDC on Solana for verified social media
                                    engagement. No waiting, no delays.
                                </p>
                            </div>
                            <div className="card text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success-100">
                                        <CheckCircleIcon className="h-6 w-6 text-success-600" />
                                    </div>
                                </div>
                                <h3 className="heading-4 mb-2">Verified Engagement</h3>
                                <p className="body-base">
                                    Our system automatically verifies real engagement through
                                    Twitter API integration.
                                </p>
                            </div>
                            <div className="card text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-100">
                                        <CheckCircleIcon className="h-6 w-6 text-warning-600" />
                                    </div>
                                </div>
                                <h3 className="heading-4 mb-2">Community Focused</h3>
                                <p className="body-base">
                                    Built specifically for low-cap projects and early-stage
                                    startups to grow authentic communities.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 bg-gray-50">
                    <div className="container-custom">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="heading-2 mb-4">How It Works</h2>
                            <p className="body-large">
                                Simple steps to start earning or creating campaigns.
                            </p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* For Community Members */}
                            <div className="card">
                                <h3 className="heading-3 mb-6 text-center">
                                    For Community Members
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                                            1
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Connect Your Accounts
                                            </h4>
                                            <p className="body-small">
                                                Link your Twitter account and Solana wallet to get
                                                started.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                                            2
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Join Campaigns
                                            </h4>
                                            <p className="body-small">
                                                Register for active campaigns and engage with content
                                                you love.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                                            3
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Earn Rewards
                                            </h4>
                                            <p className="body-small">
                                                Get USDC rewards automatically after engagement
                                                verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* For Community Leaders */}
                            <div className="card">
                                <h3 className="heading-3 mb-6 text-center">
                                    For Community Leaders
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-600 text-xs font-bold text-white">
                                            1
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Fund Your Campaign
                                            </h4>
                                            <p className="body-small">
                                                Deposit USDC to fund engagement rewards for your
                                                community.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-600 text-xs font-bold text-white">
                                            2
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Create Campaigns
                                            </h4>
                                            <p className="body-small">
                                                Set up 24-hour raid campaigns with custom reward
                                                structures.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-600 text-xs font-bold text-white">
                                            3
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Track Results
                                            </h4>
                                            <p className="body-small">
                                                Monitor engagement metrics and reward distribution in
                                                real-time.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary-600">
                    <div className="container-custom">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="heading-2 mb-4 text-white">
                                Ready to Get Started?
                            </h2>
                            <p className="body-large mb-8 text-primary-100">
                                Join the future of social media engagement rewards. Start
                                earning or create your first campaign today.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href="/register"
                                    className="btn bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 text-base"
                                >
                                    Create Account
                                </Link>
                                <Link
                                    href="/login"
                                    className="btn border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-base"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-12">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                                <span className="text-sm font-bold text-white">ER</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                EngageReward
                            </span>
                        </div>
                        <p className="body-small">
                            © 2024 EngageReward Platform. Built with ❤️ for the community.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
