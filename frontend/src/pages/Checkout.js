import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          foodItemId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        specialInstructions,
      };

      await orderAPI.placeOrder(orderPayload);
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Review your order and confirm</p>
        </div>

        <div className="checkout-layout">
          {/* Left: Delivery Details */}
          <div className="checkout-form card">
            <h3>Delivery Details</h3>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Delivery Address *</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter your full delivery address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label>Special Instructions (optional)</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="e.g. No onions, extra sauce, ring the bell..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="customer-info">
              <h4>Customer Info</h4>
              <div className="info-row"><span>Name</span><strong>{user?.name}</strong></div>
              <div className="info-row"><span>Email</span><strong>{user?.email}</strong></div>
            </div>
          </div>

          {/* Right: Order Review */}
          <div className="checkout-summary card">
            <h3>Order Review</h3>

            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item-row">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=60'}
                    alt={item.name}
                    className="order-item-thumb"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=60'; }}
                  />
                  <div className="order-item-details">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-meta">× {item.quantity}</span>
                  </div>
                  <span className="order-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="total-divider" />
              <div className="total-row total-grand">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '24px' }}
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order…' : `Place Order · ₹${cartTotal.toFixed(2)}`}
            </button>

            <p className="checkout-note">
              🔒 Your order is secured. We'll notify you once confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
