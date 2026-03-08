import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-white">
      <h1 className="mb-2 font-serif text-8xl font-bold text-amber-500">404</h1>
      <h2 className="mb-4 font-serif text-2xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-center text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist. It might have been moved or removed.
      </p>
      <Link
        href="/"
        className="rounded-full border-2 border-amber-500 px-8 py-3 font-medium text-amber-500 transition-colors hover:bg-amber-500 hover:text-black"
      >
        Back to Home
      </Link>
    </div>
  );
}
