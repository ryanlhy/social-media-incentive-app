import Link from 'next/link';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                            <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
                        </div>
                    </div>
                </div>
                <h2 className="heading-3 mb-4 text-gray-900">Page Not Found</h2>
                <p className="body-base mb-8 text-gray-600">
                    Sorry, we couldn't find the page you're looking for. The page might
                    have been moved, deleted, or you might have typed the wrong URL.
                </p>
                <div className="space-y-4">
                    <Link href="/" className="btn-primary inline-flex w-full items-center justify-center">
                        <HomeIcon className="mr-2 h-5 w-5" />
                        Go Home
                    </Link>
                    <Link href="/campaigns" className="btn-outline inline-flex w-full items-center justify-center">
                        Browse Campaigns
                    </Link>
                </div>
                <div className="mt-8 text-sm text-gray-500">
                    <p>
                        If you believe this is an error, please{' '}
                        <Link href="/contact" className="text-primary-600 hover:text-primary-500">
                            contact support
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
