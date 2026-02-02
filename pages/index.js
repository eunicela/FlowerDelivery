import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout title="Valentine's Flower Delivery - Send Love">
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/home-background.png')" }}
      >
        {/* Hero Section */}
        <div className="text-center max-w-2xl">
          {/* Main heading */}
          <h1 className="font-cursive text-6xl md:text-7xl text-cream-white mb-4 drop-shadow-lg">
            Valentine&apos;s Day
          </h1>
          <h2 className="font-cursive text-4xl md:text-5xl text-soft-pink mb-8 drop-shadow-md">
            Flower Delivery
          </h2>

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
      </div>
    </Layout>
  );
}
