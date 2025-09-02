'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
                        <ExclamationTriangleIcon className="h-8 w-8 text-error-600" />
                    </div>
                </div>
                <h1 className="heading-3 mb-4 text-gray-900">Something went wrong!</h1>
                <p className="body-base mb-8 text-gray-600">
                    We encountered an unexpected error. Please try again or contact support
                    if the problem persists.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={reset}
                        className="btn-primary w-full"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn-outline w-full"
                    >
                        Go Home
                    </button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-8 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Error Details (Development Only)
                        </summary>
                        <pre className="mt-2 overflow-auto rounded-lg bg-gray-100 p-4 text-xs text-gray-800">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}
