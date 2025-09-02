export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <h2 className="text-lg font-semibold text-gray-900">Loading...</h2>
                <p className="text-sm text-gray-600">Please wait while we load the page</p>
            </div>
        </div>
    );
}
