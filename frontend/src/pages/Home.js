import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <div className="hero-tag">🔥 Hot & Fresh Every Day</div>
            <h1>Food you love,<br /><span>delivered fast.</span></h1>
            <p>
              Explore our diverse menu and get your favourite meals delivered
              straight to your doorstep in under 30 minutes.
            </p>
            <div className="hero-cta">
              <Link to="/menu" className="btn btn-primary btn-lg">
                🍽️ Explore Menu
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-outline btn-lg">
                  Create Account
                </Link>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-stack">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
                alt="Pizza"
                className="hero-img hero-img-main"
              />
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"
                alt="Burger"
                className="hero-img hero-img-side"
              />
              <div className="floating-badge badge1">🍕 Pizza from ₹12.99</div>
              <div className="floating-badge badge2">⚡ 30 min delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose FoodRush?</h2>
          <div className="features-grid">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Average delivery in under 30 minutes. Hot food, every time.' },
              { icon: '🌟', title: 'Top Quality', desc: 'Only the freshest ingredients. Every dish made with care.' },
              { icon: '💳', title: 'Easy Payment', desc: 'Multiple payment options. Safe and secure checkout.' },
              { icon: '📍', title: 'Live Tracking', desc: 'Track your order in real-time from kitchen to door.' },
            ].map((f) => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {[
              { name: 'Pizza', emoji: '🍕', color: '#fff1ed' },
              { name: 'Burgers', emoji: '🍔', color: '#fef3c7' },
              { name: 'Indian', emoji: '🍛', color: '#ecfdf5' },
              { name: 'Pasta', emoji: '🍝', color: '#eff6ff' },
              { name: 'Desserts', emoji: '🍰', color: '#fdf4ff' },
              { name: 'Beverages', emoji: '🥤', color: '#f0fdf4' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/menu`}
                className="category-chip"
                style={{ background: cat.color }}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-banner">
              <div>
                <h2>Ready to order?</h2>
                <p>Create a free account and get started in seconds.</p>
              </div>
              <div className="cta-btns">
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/login" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
