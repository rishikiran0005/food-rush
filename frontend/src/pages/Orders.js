import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Orders.css';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="order-card card">
      <div className="order-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="order-meta">
          <span className="order-id">Order #{order.id}</span>
          <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status.replace('_', ' ')}</span>
        </div>
        <div className="order-summary-right">
          <span className="order-total">₹{Number(order.totalAmount).toFixed(2)}</span>
          <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}</span>
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {order.status !== 'CANCELLED' && (
        <div className="order-progress">
          {STATUS_STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className={`progress-step ${i <= stepIndex ? 'done' : ''}`}>
                <div className="progress-dot" />
                <span>{step.replace('_', ' ')}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`progress-line ${i < stepIndex ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="order-details fade-in">
          <h4>Items Ordered</h4>
          <div className="order-items-list">
            {order.orderItems.map((item) => (
              <div key={item.id} className="order-detail-item">
                <img
                  src={item.foodItemImageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=50'}
                  alt={item.foodItemName}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=50'; }}
                />
                <span className="detail-name">{item.foodItemName}</span>
                <span className="detail-qty">× {item.quantity}</span>
                <span className="detail-price">₹{Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
          {order.deliveryAddress && (
            <p className="delivery-addr">
              <strong>📍 Delivery:</strong> {order.deliveryAddress}
            </p>
          )}
          {order.specialInstructions && (
            <p className="special-inst">
              <strong>📝 Note:</strong> {order.specialInstructions}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data);
      } catch (err) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p>Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
