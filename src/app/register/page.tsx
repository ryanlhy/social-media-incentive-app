import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600">
                        <span className="text-lg font-bold text-white">ER</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link
                        href="/login"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Coming Soon!
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            User registration is currently under development. We're building
                            an amazing experience for you.
                        </p>
                        <div className="space-y-4">
                            <Link
                                href="/"
                                className="btn-primary w-full inline-flex justify-center items-center"
                            >
                                Back to Home
                            </Link>
                            <Link
                                href="/campaigns"
                                className="btn-outline w-full inline-flex justify-center items-center"
                            >
                                Browse Campaigns
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
