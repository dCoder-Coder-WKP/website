'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Unhandled error caught by error boundary', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    }, 'ErrorBoundary');
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-white">
      <h1 className="mb-4 font-serif text-4xl font-bold">Something went wrong</h1>
      <p className="mb-8 max-w-md text-center text-gray-400">
        We hit an unexpected error. This has been logged and we&apos;ll look into it.
      </p>
      <button
        onClick={reset}
        className="rounded-full border-2 border-amber-500 px-8 py-3 font-medium text-amber-500 transition-colors hover:bg-amber-500 hover:text-black"
      >
        Try Again
      </button>
    </div>
  );
}
