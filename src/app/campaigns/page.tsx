import Link from 'next/link';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CampaignsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="container-custom">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                                <span className="text-sm font-bold text-white">ER</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                EngageReward
                            </span>
                        </Link>
                        <nav className="hidden space-x-8 md:flex">
                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                Home
                            </Link>
                            <Link
                                href="/campaigns"
                                className="text-sm font-medium text-primary-600"
                            >
                                Campaigns
                            </Link>
                            <Link
                                href="/login"
                                className="btn-primary text-sm"
                            >
                                Sign In
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-12">
                <div className="container-custom">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="heading-2 mb-4">Active Campaigns</h1>
                        <p className="body-large text-gray-600">
                            Discover engagement campaigns and start earning USDC rewards.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                className="input pl-10"
                            />
                        </div>
                        <Link
                            href="/dashboard/campaigns/create"
                            className="btn-primary inline-flex items-center"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Create Campaign
                        </Link>
                    </div>

                    {/* Empty State */}
                    <div className="text-center py-12">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                            </div>
                        </div>
                        <h3 className="heading-4 mb-2">No campaigns available</h3>
                        <p className="body-base text-gray-600 mb-6 max-w-md mx-auto">
                            There are currently no active campaigns. Check back soon or create
                            your own campaign to start rewarding engagement.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href="/"
                                className="btn-outline"
                            >
                                Back to Home
                            </Link>
                            <Link
                                href="/register"
                                className="btn-primary"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
