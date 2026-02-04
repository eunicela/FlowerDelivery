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
          <ul className="flex gap-8 font-serif text-sm text-card-text">
            <li>
              <a href="https://sfflowermarket.org/vendor/piazza-wholesale-llc/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                About
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="min-h-screen flex relative z-10">
          {/* Text Content */}
          <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-16 lg:px-20">
            <div className="max-w-lg text-center">
              {/* Subtitle */}
              <p className="font-serif text-sm text-card-text mb-2">
                Piazza x EunifiedWorld
              </p>

              {/* Main Title */}
              <h1 className="font-cursive text-[3.5rem] text-card-text mb-4 leading-tight">
                Valentines Bouquet
              </h1>

              {/* Order Button */}
              <Link
                href="/customize"
                className="inline-block bg-red-700 text-white font-serif text-sm px-12 py-4 rounded-full hover:bg-red-900 transition-colors"
              >
                Order now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
