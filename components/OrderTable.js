import { useState, Fragment } from 'react';
import Image from 'next/image';

const statusOptions = ['pending', 'preparing', 'ready', 'delivered'];

export default function OrderTable({ orders, onStatusChange, sortOrder, onSortChange }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    await onStatusChange(orderId, newStatus);
    setUpdatingStatus(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left font-serif text-lg">Order #</th>
            <th
              className="p-3 text-left font-serif text-lg cursor-pointer hover:bg-gray-200 select-none"
              onClick={onSortChange}
            >
              Order Time {sortOrder === 'asc' ? '↑' : '↓'}
            </th>
            <th className="p-3 text-left font-serif text-lg">Customer</th>
            <th className="p-3 text-left font-serif text-lg">Email</th>
            <th className="p-3 text-left font-serif text-lg">Phone</th>
            <th className="p-3 text-left font-serif text-lg">Delivery</th>
            <th className="p-3 text-left font-serif text-lg">Color</th>
            <th className="p-3 text-left font-serif text-lg">Total</th>
            <th className="p-3 text-left font-serif text-lg">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <tr
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-3 font-serif">{order.order_number}</td>
                <td className="p-3 font-serif text-sm">{formatDateTime(order.created_at)}</td>
                <td className="p-3 font-serif">{order.customer_name}</td>
                <td className="p-3 font-serif text-sm">{order.customer_email}</td>
                <td className="p-3 font-serif">{order.customer_phone}</td>
                <td className="p-3 font-serif">
                  <div className="flex items-center gap-1">
                    {formatDate(order.delivery_date)}
                    {order.delivery_method === 'pickup' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Pickup</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.delivery_method === 'pickup' ? 'In-store pickup' : order.delivery_address}
                  </div>
                </td>
                <td className="p-3">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{
                      backgroundColor:
                        order.flower_color === 'red'
                          ? '#722F37'
                          : order.flower_color === 'pink'
                          ? '#F4C2C2'
                          : '#FFFEF9',
                    }}
                  />
                </td>
                <td className="p-3 font-serif">{formatCurrency(order.total_cents)}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={updatingStatus === order.id}
                    className="font-serif p-1 border rounded bg-white disabled:opacity-50"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              {expandedOrder === order.id && order.cards && (
                <tr key={`${order.id}-expanded`}>
                  <td colSpan={9} className="bg-gray-50 p-4">
                    <div className="space-y-4">
                      <h4 className="font-serif text-xl font-bold">Order Details</h4>
                      {order.cards.map((card, index) => (
                        <div
                          key={card.id}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <h5 className="font-serif text-lg mb-2">
                            Photo Card {index + 1}
                          </h5>
                          {card.image_url ? (
                            <div className="relative h-48 w-64">
                              <Image
                                src={card.image_url}
                                alt="Card image"
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          ) : (
                            <p className="font-serif text-gray-500 italic">No photo uploaded</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-8 font-serif text-xl text-gray-500">
          No orders yet
        </div>
      )}
    </div>
  );
}
