import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Page Not Found
      </h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Go back home
      </Link>
    </div>
  );
}
