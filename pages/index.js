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
          <h1 className="font-cursive text-6xl md:text-7xl text-black mb-4">
            Valentine&apos;s Day
          </h1>
          <h2 className="font-cursive text-4xl md:text-5xl text-deep-red mb-8">
            Flower Delivery
          </h2>

          {/* Subtext */}
          <p className="font-cursive text-2xl text-black mb-8">
            Send your love with a beautiful bouquet
            <br />
            and a personalized letter
          </p>

          {/* CTA Button */}
          <Link
            href="/customize"
            className="inline-block bg-deep-red text-white font-cursive text-2xl px-10 py-4 rounded-full hover:bg-red-900 hover:scale-105 transform transition-all"
          >
            Create Your Bouquet
          </Link>

          {/* Price info */}
          <p className="font-cursive text-xl text-black mt-6">
            Starting at $80
          </p>
        </div>
      </div>
    </Layout>
  );
}
