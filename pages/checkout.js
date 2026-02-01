import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { useStore } from '../lib/store';
import { getStripe } from '../lib/stripe';

export default function Checkout() {
  const router = useRouter();
  const {
    flowerColor,
    cards,
    customerInfo,
    setCustomerInfo,
    deliveryInfo,
    setDeliveryInfo,
    getTotal,
    getTotalFormatted,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const bouquetImages = {
    red: '/bouquet-red.png',
    pink: '/bouquet-pink.png',
    white: '/bouquet-white.png',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Upload images first
      const uploadedCards = await Promise.all(
        cards.map(async (card) => {
          let imageUrl = null;
          if (card.imageFile) {
            const formData = new FormData();
            formData.append('file', card.imageFile);

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (uploadRes.ok) {
              const data = await uploadRes.json();
              imageUrl = data.url;
            }
          }
          return {
            recipientName: card.recipientName,
            message: card.message,
            senderName: card.senderName,
            imageUrl,
          };
        })
      );

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flowerColor,
          cards: uploadedCards,
          customerInfo,
          deliveryInfo,
          totalCents: getTotal(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate minimum delivery date (2 days from now)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <Layout title="Checkout - Valentine's Flower Delivery">
      <div className="min-h-screen py-4 px-8 md:px-16 lg:px-24 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <Link
            href="/customize"
            className="font-sans text-sm text-cream-white hover:text-soft-pink mb-4 inline-block"
          >
            &larr; Back to customization
          </Link>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Order Summary */}
            <div className="card p-4">
              <h2 className="font-sans font-semibold text-xl text-card-text mb-4">
                Order Summary
              </h2>

              {/* Bouquet */}
              <div className="flex items-center gap-3 pb-3 border-b">
                <Image
                  src={bouquetImages[flowerColor]}
                  alt={`${flowerColor} bouquet`}
                  width={60}
                  height={75}
                />
                <div>
                  <p className="font-sans text-sm text-card-text">
                    {flowerColor.charAt(0).toUpperCase() + flowerColor.slice(1)} Rose
                    Bouquet
                  </p>
                  <p className="font-sans text-sm text-gray-500">$80.00</p>
                </div>
              </div>

              {/* Cards */}
              {cards.map((card, index) => (
                <div key={card.id} className="flex items-center gap-3 py-3 border-b">
                  <div className="w-14 h-11 bg-gray-100 rounded flex items-center justify-center">
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt="Card image"
                        width={56}
                        height={44}
                        className="object-cover rounded"
                      />
                    ) : (
                      <span className="font-sans text-xs text-gray-400">Card</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-sm text-card-text">
                      Letter Card {index + 1}
                    </p>
                    <p className="font-sans text-xs text-gray-500 truncate">
                      To: {card.recipientName || 'Not specified'}
                    </p>
                  </div>
                  <p className="font-sans text-sm text-card-text">$5.00</p>
                </div>
              ))}

              {/* Total */}
              <div className="pt-3">
                <div className="flex justify-between font-sans font-semibold text-lg text-card-text">
                  <span>Total</span>
                  <span>{getTotalFormatted()}</span>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Form */}
            <form onSubmit={handleSubmit} className="card p-4">
              <h2 className="font-sans font-semibold text-xl text-card-text mb-4">
                Delivery Details
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 font-sans text-sm">
                  {error}
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-2 mb-4">
                <h3 className="font-sans font-medium text-sm text-card-text">Your Information</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ name: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ email: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 mb-4">
                <h3 className="font-sans font-medium text-sm text-card-text">Delivery Address</h3>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={deliveryInfo.street}
                  onChange={(e) => setDeliveryInfo({ street: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({ city: e.target.value })}
                    required
                    className="p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={deliveryInfo.state}
                    onChange={(e) => setDeliveryInfo({ state: e.target.value })}
                    required
                    className="p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={deliveryInfo.zip}
                  onChange={(e) => setDeliveryInfo({ zip: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                />
              </div>

              {/* Delivery Date */}
              <div className="space-y-2 mb-4">
                <h3 className="font-sans font-medium text-sm text-card-text">Delivery Date</h3>
                <input
                  type="date"
                  value={deliveryInfo.date}
                  onChange={(e) => setDeliveryInfo({ date: e.target.value })}
                  min={minDateStr}
                  required
                  className="w-full p-2 border rounded-lg font-sans text-sm focus:border-deep-red outline-none"
                />
                {deliveryInfo.date && (
                  <p className="font-sans text-xs text-gray-500">
                    {formatDate(deliveryInfo.date)}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-pill text-base py-3 bg-deep-red text-white hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Pay with Stripe'}
              </button>

              <p className="font-sans text-center text-gray-500 mt-2 text-xs">
                Secure payment powered by Stripe
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
