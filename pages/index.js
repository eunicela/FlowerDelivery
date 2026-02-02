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

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <Image
          src="/home-background.png"
          alt="Valentine's bouquet background"
          fill
          className="object-cover"
          priority
        />

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
        <div className="min-h-screen flex relative z-10">
          {/* Left Side - Text Content */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20">
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
        </div>
      </div>
    </>
  );
}
