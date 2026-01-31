import { useState } from 'react';
import Image from 'next/image';

const statusOptions = ['pending', 'preparing', 'ready', 'delivered'];

export default function OrderTable({ orders, onStatusChange }) {
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

  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left font-cursive text-lg">Order #</th>
            <th className="p-3 text-left font-cursive text-lg">Customer</th>
            <th className="p-3 text-left font-cursive text-lg">Email</th>
            <th className="p-3 text-left font-cursive text-lg">Phone</th>
            <th className="p-3 text-left font-cursive text-lg">Delivery</th>
            <th className="p-3 text-left font-cursive text-lg">Color</th>
            <th className="p-3 text-left font-cursive text-lg">Total</th>
            <th className="p-3 text-left font-cursive text-lg">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <>
              <tr
                key={order.id}
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-3 font-cursive">{order.order_number}</td>
                <td className="p-3 font-cursive">{order.customer_name}</td>
                <td className="p-3 font-cursive text-sm">{order.customer_email}</td>
                <td className="p-3 font-cursive">{order.customer_phone}</td>
                <td className="p-3 font-cursive">
                  <div>{formatDate(order.delivery_date)}</div>
                  <div className="text-xs text-gray-500">{order.delivery_address}</div>
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
                <td className="p-3 font-cursive">{formatCurrency(order.total_cents)}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={updatingStatus === order.id}
                    className="font-cursive p-1 border rounded bg-white disabled:opacity-50"
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
                  <td colSpan={8} className="bg-gray-50 p-4">
                    <div className="space-y-4">
                      <h4 className="font-cursive text-xl font-bold">Order Details</h4>
                      {order.cards.map((card, index) => (
                        <div
                          key={card.id}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <h5 className="font-cursive text-lg mb-2">
                            Card {index + 1}
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-cursive">
                                <strong>To:</strong> {card.recipient_name}
                              </p>
                              <p className="font-cursive">
                                <strong>From:</strong> {card.sender_name}
                              </p>
                              <p className="font-cursive mt-2">
                                <strong>Message:</strong>
                              </p>
                              <p className="font-cursive italic text-gray-600">
                                {card.message}
                              </p>
                            </div>
                            {card.image_url && (
                              <div className="relative h-32 w-48">
                                <Image
                                  src={card.image_url}
                                  alt="Card image"
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="text-center py-8 font-cursive text-xl text-gray-500">
          No orders yet
        </div>
      )}
    </div>
  );
}
