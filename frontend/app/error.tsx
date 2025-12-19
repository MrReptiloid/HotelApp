'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
          <div className="text-red-600 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

