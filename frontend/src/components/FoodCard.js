import React from 'react';
import { useCart } from '../context/CartContext';
import './FoodCard.css';

const FoodCard = ({ item }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const cartItem = cartItems.find((c) => c.id === item.id);
  const qty = cartItem?.quantity || 0;

  return (
    <div className="food-card card fade-in-up">
      <div className="food-card-image-wrap">
        <img
          src={item.imageUrl || `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400`}
          alt={item.name}
          className="food-card-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400';
          }}
        />
        <span className="food-card-category">{item.category}</span>
      </div>

      <div className="food-card-body">
        <h3 className="food-card-name">{item.name}</h3>
        <p className="food-card-desc">{item.description}</p>

        <div className="food-card-footer">
          <span className="food-card-price">₹{Number(item.price).toFixed(2)}</span>

          {qty === 0 ? (
            <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>
              + Add
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn qty-btn-add" onClick={() => addToCart(item)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
