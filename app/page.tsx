import Link from 'next/link';
import { getProducts, getCollections } from '@/lib/shopify';
import { ProductCard } from '@/components';

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(8),
    getCollections(4),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl">
              Welcome to our Store
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Discover our curated collection of premium products. Quality
              craftsmanship meets modern design.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Shop All Products
              </Link>
              <Link
                href="/collections"
                className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
              >
                Browse Collections <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute -top-40 right-0 -z-10 transform-gpu blur-3xl sm:-top-80">
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-zinc-200 to-zinc-400 opacity-20 dark:from-zinc-700 dark:to-zinc-500"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Featured Products
            </h2>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Check out our latest arrivals
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <svg
              className="mx-auto h-12 w-12 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              No products yet
            </h3>
            <p className="mt-2 text-zinc-500">
              Connect your Shopify store to see products here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Shop by Collection
                </h2>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Browse our curated collections
                </p>
              </div>
              <Link
                href="/collections"
                className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
              >
                View all <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-zinc-200 p-6 dark:bg-zinc-800"
                >
                  {collection.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${collection.image.url})`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-white">
                      {collection.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-zinc-900 dark:bg-zinc-800">
          <div className="px-6 py-16 sm:px-12 sm:py-24 lg:flex lg:items-center lg:justify-between lg:px-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-4 max-w-xl text-lg text-zinc-300">
                Explore our full catalog and find the perfect products for you.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
              <Link
                href="/products"
                className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
