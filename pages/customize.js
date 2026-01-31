import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import LetterCard from '../components/LetterCard';
import ImageUpload from '../components/ImageUpload';
import BouquetDisplay from '../components/BouquetDisplay';
import ColorSelector from '../components/ColorSelector';
import { useStore } from '../lib/store';

export default function Customize() {
  const { cards, addCard } = useStore();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <Layout title="Customize Your Bouquet">
      <div className="min-h-screen py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main layout - two columns on desktop */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* LEFT SIDE - Cards and uploads */}
            <div className="flex-1 space-y-6">
              {cards.map((card, index) => (
                <div key={card.id} className="space-y-4">
                  {/* Letter Card */}
                  <LetterCard card={card} showRemove={cards.length > 1} />

                  {/* Image Upload */}
                  <div className="relative">
                    <ImageUpload cardId={card.id} />
                    <div className="absolute -bottom-2 -right-2 font-cursive text-xl text-cream-white drop-shadow-lg">
                      $5
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Card Button */}
              <button
                onClick={addCard}
                className="btn-pill text-lg flex items-center gap-2"
              >
                <span className="text-xl">+</span> add card
              </button>
              <span className="font-cursive text-cream-white ml-2">$5 each</span>
            </div>

            {/* RIGHT SIDE - Bouquet display */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* Bouquet with price */}
              <div className="relative">
                <BouquetDisplay />
              </div>

              {/* Color Selector - positioned to the right of bouquet */}
              <div className="absolute right-0 top-1/3 transform -translate-y-1/2 lg:right-8">
                <ColorSelector />
              </div>

              {/* Help button */}
              <button
                onClick={() => setShowHelp(true)}
                className="absolute left-1/4 bottom-24 w-10 h-10 rounded-full bg-cream-white text-card-text font-cursive text-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                aria-label="Help"
              >
                ?
              </button>

              {/* Checkout button */}
              <div className="mt-8 lg:absolute lg:bottom-8 lg:right-8">
                <Link
                  href="/checkout"
                  className="btn-pill text-2xl px-8 py-3 hover:scale-105 transform transition-all inline-block"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHelp(false)}
          >
            <div
              className="card p-8 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-cursive text-3xl text-card-text mb-4">
                How It Works
              </h3>
              <ul className="font-cursive text-xl text-card-text space-y-3">
                <li>
                  <span className="text-deep-red">1.</span> Write your personalized letter
                </li>
                <li>
                  <span className="text-deep-red">2.</span> Upload a photo (optional)
                </li>
                <li>
                  <span className="text-deep-red">3.</span> Choose your bouquet color
                </li>
                <li>
                  <span className="text-deep-red">4.</span> Add more cards if desired
                </li>
                <li>
                  <span className="text-deep-red">5.</span> Checkout and send your love!
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t">
                <p className="font-cursive text-lg text-gray-600">
                  <strong>Pricing:</strong>
                  <br />
                  Bouquet: $80
                  <br />
                  Each card with photo: $5
                </p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="btn-pill mt-6 w-full text-xl"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
