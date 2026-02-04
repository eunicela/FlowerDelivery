import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import OrderTable from '../components/OrderTable';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Invalid password');
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        const data = await response.json();
        setOrders(data);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Failed to authenticate');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh orders
      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <Layout title="Admin Login - Valentine's Flower Delivery">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="card p-8 w-full max-w-md">
            <h1 className="font-serif text-4xl text-card-text text-center mb-6">
              Florist Dashboard
            </h1>

            <form onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-serif">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block font-serif text-xl text-card-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg font-serif text-lg focus:border-deep-red outline-none"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-pill text-xl py-3 bg-deep-red text-white hover:bg-red-800"
              >
                Login
              </button>
            </form>

          </div>
        </div>
      </Layout>
    );
  }

  // Admin Dashboard
  return (
    <Layout title="Admin Dashboard - Valentine's Flower Delivery">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-4xl text-cream-white drop-shadow-lg">
              Florist Dashboard
            </h1>
            <div className="flex gap-4">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="btn-pill text-lg disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="btn-pill text-lg"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-serif">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All', count: orders.length },
              { id: 'delivery', label: 'Delivery', count: orders.filter((o) => o.delivery_method === 'delivery').length },
              { id: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
              { id: 'delivered', label: 'Delivered', count: orders.filter((o) => o.status === 'delivered').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-serif transition-all ${
                  activeTab === tab.id
                    ? 'bg-deep-red text-white'
                    : 'bg-white text-card-text hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="card p-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="font-serif text-xl text-gray-500">
                  Loading orders...
                </p>
              </div>
            ) : (
              <OrderTable
                orders={orders.filter((order) => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'delivery') return order.delivery_method === 'delivery';
                  if (activeTab === 'pending') return order.status === 'pending';
                  if (activeTab === 'delivered') return order.status === 'delivered';
                  return true;
                })}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
