import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import StatusTracker from '../components/StatusTracker';
import { useStore } from '../lib/store';

export default function Confirmation() {
  const router = useRouter();
  const { session_id } = router.query;
  const { reset } = useStore();

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset the store after successful checkout
    if (session_id) {
      reset();

      // In a real app, you'd fetch order details from the API
      // For now, we'll show a generic confirmation
      setOrderDetails({
        orderNumber: 'VAL-2025-XXXX',
        status: 'preparing',
      });
      setLoading(false);
    }
  }, [session_id, reset]);

  if (loading && session_id) {
    return (
      <Layout title="Order Confirmation">
        <div className="min-h-screen px-8 md:px-16 lg:px-24 flex items-center justify-center">
          <div className="card p-8 text-center">
            <p className="font-cursive text-2xl text-card-text">
              Loading your order details...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session_id) {
    return (
      <Layout title="Order Confirmation">
        <div className="min-h-screen px-8 md:px-16 lg:px-24 flex items-center justify-center">
          <div className="card p-8 text-center">
            <p className="font-cursive text-2xl text-card-text mb-4">
              No order found
            </p>
            <Link href="/" className="btn-pill text-xl">
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order Confirmed - Valentine's Flower Delivery">
      <div className="min-h-screen py-12 px-8 md:px-16 lg:px-24 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Success Card */}
          <div className="card p-8 text-center mb-8">
            {/* Checkmark */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="font-cursive text-5xl text-deep-red mb-4">
              Thank You!
            </h1>
            <p className="font-cursive text-2xl text-card-text mb-2">
              Your order has been placed successfully
            </p>
            <p className="font-cursive text-xl text-gray-500 mb-6">
              Order #{orderDetails?.orderNumber || 'Processing...'}
            </p>

            {/* Hearts decoration */}
            <div className="flex justify-center gap-2 mb-8">
              <span className="text-2xl text-deep-red">&#x2665;</span>
              <span className="text-2xl text-soft-pink">&#x2665;</span>
              <span className="text-2xl text-deep-red">&#x2665;</span>
            </div>

            {/* Status Tracker */}
            <div className="mb-8">
              <h3 className="font-cursive text-xl text-card-text mb-4">
                Order Status
              </h3>
              <StatusTracker currentStatus={orderDetails?.status || 'pending'} />
            </div>

            {/* Order Summary */}
            <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-cursive text-xl text-card-text mb-3">
                What happens next?
              </h3>
              <ul className="font-cursive text-lg text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-deep-red">1.</span>
                  We&apos;ll prepare your beautiful bouquet with love
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-deep-red">2.</span>
                  Your personalized letter will be carefully attached
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-deep-red">3.</span>
                  Your order will be delivered on your selected date
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <p className="font-cursive text-lg text-gray-500">
                Questions about your order?
              </p>
              <p className="font-cursive text-lg text-deep-red">
                Contact us at{' '}
                <a href="mailto:hello@valentineflowers.com" className="underline">
                  hello@valentineflowers.com
                </a>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="btn-pill text-xl inline-block hover:scale-105 transform transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
