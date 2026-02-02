import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Valentine&apos;s Bouquet - Piazza x EunifiedWorld</title>
        <meta name="description" content="Send beautiful Valentine's Day flowers with a personalized letter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-beige relative overflow-hidden">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 p-8 z-20">
          <ul className="flex gap-8 font-serif text-lg text-card-text">
            <li>
              <Link href="/" className="hover:opacity-70 transition-opacity">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:opacity-70 transition-opacity">
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="min-h-screen flex">
          {/* Left Side - Text Content */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 z-10">
            <div className="max-w-lg">
              {/* Subtitle */}
              <p className="font-serif text-xl md:text-2xl text-card-text mb-2">
                Piazza x EunifiedWorld
              </p>

              {/* Main Title */}
              <h1 className="font-cursive text-6xl md:text-7xl lg:text-8xl text-card-text mb-8 leading-tight">
                Valentines Bouquet
              </h1>

              {/* Order Button */}
              <Link
                href="/customize"
                className="inline-block bg-deep-red text-white font-serif text-lg px-12 py-4 rounded-full hover:bg-red-800 transition-colors mb-6"
              >
                Order now
              </Link>

              {/* How it works link */}
              <div>
                <Link
                  href="/customize"
                  className="font-serif text-card-text underline hover:opacity-70 transition-opacity"
                >
                  How does this work?
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Bouquet Image */}
          <div className="hidden md:block flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-end">
              {/* Replace with bouquet-hero.png when available */}
              <Image
                src="/bouquet-red.svg"
                alt="Beautiful rose bouquet"
                width={500}
                height={600}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Product Preview Image - Bottom Left (uncomment when product-preview.png is available) */}
        {/* <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 z-10">
          <div
            className="bg-white p-2 rounded-lg shadow-lg"
            style={{ transform: 'rotate(-5deg)' }}
          >
            <Image
              src="/product-preview.png"
              alt="Product preview"
              width={300}
              height={200}
              className="rounded-md"
            />
          </div>
        </div> */}
      </div>
    </>
  );
}
