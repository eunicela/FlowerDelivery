import Link from 'next/link';
import Layout from '../components/Layout';
import Image from 'next/image';

export default function Home() {
  return (
    <Layout title="Valentine's Flower Delivery - Send Love">
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center max-w-2xl">
          {/* Decorative hearts */}
          <div className="flex justify-center gap-4 mb-6">
            <span className="text-4xl text-deep-red animate-pulse">&#x2665;</span>
            <span className="text-5xl text-soft-pink animate-pulse delay-100">&#x2665;</span>
            <span className="text-4xl text-deep-red animate-pulse delay-200">&#x2665;</span>
          </div>

          {/* Main heading */}
          <h1 className="font-cursive text-6xl md:text-7xl text-cream-white mb-4 drop-shadow-lg">
            Valentine&apos;s Day
          </h1>
          <h2 className="font-cursive text-4xl md:text-5xl text-soft-pink mb-8 drop-shadow-md">
            Flower Delivery
          </h2>

          {/* Bouquet preview */}
          <div className="my-8">
            <Image
              src="/bouquet-red.svg"
              alt="Beautiful red rose bouquet"
              width={300}
              height={375}
              className="mx-auto drop-shadow-2xl"
              priority
            />
          </div>

          {/* Subtext */}
          <p className="font-cursive text-2xl text-cream-white mb-8 drop-shadow-md">
            Send your love with a beautiful bouquet
            <br />
            and a personalized letter
          </p>

          {/* CTA Button */}
          <Link
            href="/customize"
            className="inline-block btn-pill text-2xl px-10 py-4 hover:scale-105 transform transition-all"
          >
            Create Your Bouquet
          </Link>

          {/* Price info */}
          <p className="font-cursive text-xl text-cream-white mt-6 opacity-80">
            Starting at $80
          </p>
        </div>

        {/* Footer decorations */}
        <div className="absolute bottom-8 flex gap-8 opacity-50">
          <span className="text-2xl text-cream-white">&#x2665;</span>
          <span className="text-2xl text-soft-pink">&#x2665;</span>
          <span className="text-2xl text-cream-white">&#x2665;</span>
        </div>
      </div>
    </Layout>
  );
}
