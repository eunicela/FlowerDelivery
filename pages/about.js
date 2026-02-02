import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About - Piazza x EunifiedWorld</title>
        <meta name="description" content="Learn about our Valentine's flower delivery service" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen w-full bg-beige overflow-y-auto">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 p-8 z-20 bg-beige/80 backdrop-blur-sm">
          <ul className="flex gap-8 font-serif text-lg text-card-text">
            <li>
              <Link href="/" className="hover:opacity-70 transition-opacity">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:opacity-70 transition-opacity font-semibold">
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Vertical Scroll Container */}
        <div className="flex flex-col snap-y snap-mandatory scroll-smooth">
          {/* Section 1 - Welcome */}
          <section className="w-full min-h-screen snap-start flex items-center justify-center px-8 md:px-16">
            <div className="max-w-4xl text-center">
              <p className="font-serif text-xl md:text-2xl text-card-text mb-4">
                Welcome to
              </p>
              <h1 className="font-cursive text-5xl md:text-7xl lg:text-8xl text-card-text mb-6">
                Piazza x EunifiedWorld
              </h1>
              <p className="font-serif text-lg md:text-xl text-card-text/80 max-w-2xl mx-auto">
                A collaboration bringing you handcrafted bouquets paired with personalized letters for your special someone.
              </p>
            </div>
          </section>

          {/* Section 2 - Our Story */}
          <section className="w-full min-h-screen snap-start flex items-center justify-center px-8 md:px-16">
            <div className="max-w-5xl flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="font-cursive text-4xl md:text-6xl text-card-text mb-6">
                  Our Story
                </h2>
                <p className="font-serif text-lg text-card-text/80 mb-4">
                  We believe that flowers speak a language of their own. Combined with heartfelt words, they become an unforgettable gift.
                </p>
                <p className="font-serif text-lg text-card-text/80">
                  Each bouquet is carefully arranged with fresh roses and paired with a custom letter card that carries your personal message.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg" style={{ transform: 'rotate(3deg)' }}>
                  <Image
                    src="/bouquet-hero.png"
                    alt="Beautiful bouquet"
                    width={350}
                    height={400}
                    className="rounded-xl object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 - How It Works */}
          <section className="w-full min-h-screen snap-start flex items-center justify-center px-8 md:px-16">
            <div className="max-w-5xl">
              <h2 className="font-cursive text-4xl md:text-6xl text-card-text mb-12 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/80 rounded-2xl p-8 text-center shadow-md">
                  <div className="w-16 h-16 bg-deep-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-cursive text-3xl text-white">1</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-card-text mb-3">Customize</h3>
                  <p className="font-serif text-card-text/70">
                    Write your personal letter and choose your bouquet color.
                  </p>
                </div>
                <div className="bg-white/80 rounded-2xl p-8 text-center shadow-md">
                  <div className="w-16 h-16 bg-deep-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-cursive text-3xl text-white">2</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-card-text mb-3">Order</h3>
                  <p className="font-serif text-card-text/70">
                    Complete your order with delivery details and payment.
                  </p>
                </div>
                <div className="bg-white/80 rounded-2xl p-8 text-center shadow-md">
                  <div className="w-16 h-16 bg-deep-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-cursive text-3xl text-white">3</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-card-text mb-3">Deliver</h3>
                  <p className="font-serif text-card-text/70">
                    We hand-deliver your bouquet and letter on Valentine&apos;s Day.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 - The Letter */}
          <section className="w-full min-h-screen snap-start flex items-center justify-center px-8 md:px-16">
            <div className="max-w-5xl flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h2 className="font-cursive text-4xl md:text-6xl text-card-text mb-6">
                  The Letter
                </h2>
                <p className="font-serif text-lg text-card-text/80 mb-4">
                  Your words matter. Each letter is printed on premium card stock with elegant cursive typography.
                </p>
                <p className="font-serif text-lg text-card-text/80">
                  Add a personal photo to the back for an extra special touch that makes your gift truly one-of-a-kind.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white p-3 rounded-lg shadow-lg" style={{ transform: 'rotate(-3deg)' }}>
                  <Image
                    src="/letter-preview.png"
                    alt="Letter preview"
                    width={320}
                    height={200}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 - Order CTA */}
          <section className="w-full min-h-screen snap-start flex items-center justify-center px-8 md:px-16">
            <div className="max-w-3xl text-center">
              <h2 className="font-cursive text-4xl md:text-6xl lg:text-7xl text-card-text mb-6">
                Ready to Order?
              </h2>
              <p className="font-serif text-lg md:text-xl text-card-text/80 mb-8 max-w-xl mx-auto">
                Create a memorable Valentine&apos;s Day gift for your special someone.
              </p>
              <Link
                href="/customize"
                className="inline-block bg-deep-red text-white font-serif text-lg px-12 py-4 rounded-full hover:bg-red-800 transition-colors"
              >
                Start Customizing
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
