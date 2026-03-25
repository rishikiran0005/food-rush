import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ paddingTop: '100px' }}>
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items from our menu</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: '24px' }}>
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Item</span>
              <span>Qty</span>
              <span>Subtotal</span>
              <span></span>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80'}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80';
                    }}
                  />
                  <div>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">₹{Number(item.price).toFixed(2)} each</span>
                  </div>
                </div>

                <div className="qty-control">
                  <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn qty-btn-add" onClick={() => addToCart(item)}>+</button>
                </div>

                <span className="cart-item-subtotal">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  className="cart-item-remove"
                  onClick={() => deleteFromCart(item.id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))}

            <button className="btn btn-outline btn-sm clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="cart-summary card">
            <h3>Order Summary</h3>

            <div className="summary-lines">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-line">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-line summary-total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '20px' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <Link to="/menu" className="btn btn-outline btn-full" style={{ marginTop: '10px' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
