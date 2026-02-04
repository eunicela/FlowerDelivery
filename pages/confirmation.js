import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import StatusTracker from '../components/StatusTracker';
import { useStore } from '../lib/store';

export default function Confirmation() {
  const router = useRouter();
  const { session_id } = router.query;
  const { reset } = useStore();

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!session_id) return;

    try {
      const response = await fetch(`/api/orders/by-session?session_id=${encodeURIComponent(session_id)}`);

      if (response.status === 404) {
        setError('Order not found');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrderDetails(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
      setLoading(false);
    }
  }, [session_id]);

  useEffect(() => {
    if (session_id) {
      // Reset the store after successful checkout
      reset();
      // Fetch order details
      fetchOrder();
    }
  }, [session_id, reset, fetchOrder]);

  // Poll for status updates every 30 seconds
  useEffect(() => {
    if (!session_id || error) return;

    const interval = setInterval(() => {
      fetchOrder();
    }, 30000);

    return () => clearInterval(interval);
  }, [session_id, error, fetchOrder]);

  if (loading && session_id) {
    return (
      <>
        <Head>
          <title>Order Confirmation</title>
        </Head>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: 'url(/wood-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-[#f5f0e8] rounded-2xl p-8 text-center shadow-lg">
            <p className="font-cursive text-2xl text-[#4a4a4a]">
              Loading your order details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!session_id || error) {
    return (
      <>
        <Head>
          <title>Order Confirmation</title>
        </Head>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: 'url(/wood-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-[#f5f0e8] rounded-2xl p-8 text-center shadow-lg">
            <p className="font-cursive text-2xl text-[#4a4a4a] mb-4">
              {error || 'No order found'}
            </p>
            <Link
              href="/"
              className="inline-block bg-deep-red text-white px-6 py-2 rounded-full font-cursive text-xl hover:opacity-90 transition-opacity"
            >
              Go Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Order Confirmed - Valentine&apos;s Flower Delivery</title>
      </Head>
      <div
        className="min-h-screen flex items-center justify-center py-16 px-4"
        style={{
          backgroundImage: 'url(/wood-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Centered Card with slight rotation */}
        <div
          className="relative bg-[#f5f0e8] rounded-2xl p-8 pt-16 text-center shadow-xl max-w-md w-full"
        >
          {/* Stamp Logo overlapping top */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white"
          >
            <Image
              src="/piazza-logo.png"
              alt="Piazza Logo"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thank You Text */}
          <h1 className="font-cursive text-5xl text-deep-red mb-3">
            Thank you!
          </h1>

          {/* Confirmation Message */}
          <p className="font-serif text-lg text-[#3a3a3a] mb-2">
            Your order has been placed successfully
          </p>

          {/* Order Number */}
          <p className="text-gray-400 text-sm mb-4">
            Order # {orderDetails?.order_number || 'Processing...'}
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white/50 rounded-lg p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Flower Color:</span>
                <span className="text-[#3a3a3a] capitalize">{orderDetails.flower_color}</span>

                <span className="text-gray-500">
                  {orderDetails.delivery_method === 'pickup' ? 'Pickup Date:' : 'Delivery Date:'}
                </span>
                <span className="text-[#3a3a3a]">
                  {new Date(orderDetails.delivery_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>

                <span className="text-gray-500">Method:</span>
                <span className="text-[#3a3a3a] capitalize">
                  {orderDetails.delivery_method === 'pickup' ? 'In-store Pickup' : 'Delivery'}
                </span>

                {orderDetails.total_cents && (
                  <>
                    <span className="text-gray-500">Total:</span>
                    <span className="text-[#3a3a3a] font-semibold">
                      ${(orderDetails.total_cents / 100).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Status Tracker */}
          <div className="mb-8">
            <StatusTracker currentStatus={orderDetails?.status || 'pending'} />
          </div>

          {/* Contact Section */}
          <div className="border-t border-gray-300 pt-6">
            <p className="text-gray-500 text-sm">
              Questions about your order?
            </p>
            <p className="text-sm">
              Contact us at{' '}
              <a
                href="mailto:Eflowerwholesale@gmail.com"
                className="text-deep-red underline"
              >
                Eflowerwholesale@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
