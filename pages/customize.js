import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import LetterCard from '../components/LetterCard';
import ImageUpload from '../components/ImageUpload';
import BouquetDisplay from '../components/BouquetDisplay';
import ColorSelector from '../components/ColorSelector';
import { useStore } from '../lib/store';

export default function Customize() {
  const { cards, toggleCardIncluded } = useStore();
  const [showHelp, setShowHelp] = useState(false);

  // For the first card, use a simple toggle
  const firstCard = cards[0];
  const isFirstCardLocked = !firstCard?.isIncluded;

  return (
    <Layout title="Customize Your Bouquet">
      <div className="h-screen px-8 md:px-16 lg:px-24 flex items-center justify-center">
        <div className="max-w-7xl w-full">
          {/* Main layout - two columns on desktop */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* LEFT SIDE - Cards and uploads */}
            <div className="flex-1 flex flex-col items-center space-y-6">
              {/* Only show the first card for now */}
              {firstCard && (
                <div className="space-y-4 w-full max-w-md">
                  {/* Letter Card (Front) */}
                  <LetterCard
                    card={firstCard}
                    showRemove={false}
                    isLocked={isFirstCardLocked}
                  />

                  {/* Image Upload (Back) */}
                  <ImageUpload
                    cardId={firstCard.id}
                    isLocked={isFirstCardLocked}
                  />
                </div>
              )}

              {/* Add Letter Button with Price */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCardIncluded(firstCard?.id)}
                  className="btn-pill text-lg flex items-center gap-2"
                >
                  <span className="text-xl">{isFirstCardLocked ? '+' : '-'}</span>
                  {isFirstCardLocked ? 'add card' : 'remove card'}
                </button>
                <span className="font-cursive text-xl text-cream-white drop-shadow-lg">
                  +$5
                </span>
              </div>
            </div>

            {/* RIGHT SIDE - Bouquet display */}
            <div className="flex-1 flex flex-col items-center relative">
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
                className="absolute left-4 bottom-24 w-10 h-10 rounded-full bg-cream-white text-card-text font-cursive text-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
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
              className="card p-8 max-w-2xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-card-text text-xl flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                &times;
              </button>

              <h3 className="font-serif text-3xl text-card-text mb-6">
                How It Works
              </h3>
              <ul className="font-serif text-lg text-card-text space-y-4">
                <li>
                  <span className="text-deep-red">1.</span> Click &quot;add card&quot; to unlock the card
                </li>
                <li>
                  <span className="text-deep-red">2.</span> Write your personalized letter and upload a photo
                </li>
                <li>
                  <span className="text-deep-red">3.</span> Choose your bouquet color
                </li>
                <li>
                  <span className="text-deep-red">4.</span> Have your bouquet delivered by Valentine&apos;s day!
                </li>
              </ul>

              {/* Product Image */}
              <div className="mt-6 rounded-lg overflow-hidden">
                <Image
                  src="/product-preview.png"
                  alt="Valentine's bouquet with card"
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Caption */}
              <p className="font-serif text-base text-gray-600 mt-4 text-center">
                The bouquet is carefully boxed, and the stems are wrapped in moist cotton so the flowers stay fresh during shipping.
              </p>

              {/* Bouquet Color Options */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="rounded-lg overflow-hidden mb-2">
                    <Image
                      src="/real-red-bouquet.png"
                      alt="Red bouquet"
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="font-serif text-sm text-gray-600">Red</p>
                </div>
                <div className="text-center">
                  <div className="rounded-lg overflow-hidden mb-2">
                    <Image
                      src="/real-pink-bouquet.png"
                      alt="Pink bouquet"
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="font-serif text-sm text-gray-600">Pink</p>
                </div>
                <div className="text-center">
                  <div className="rounded-lg overflow-hidden mb-2">
                    <Image
                      src="/real-white-bouquet.png"
                      alt="White bouquet"
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="font-serif text-sm text-gray-600">White</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
