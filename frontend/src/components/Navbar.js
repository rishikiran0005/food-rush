import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-name">FoodRush</span>
        </Link>

        {/* Desktop Nav */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}>
            Menu
          </Link>

          {user && (
            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}>
              My Orders
            </Link>
          )}

          {isAdmin() && (
            <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}>
              ⚙️ Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn">
                🛒
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-menu">
                <span className="user-greeting">Hi, {user.name?.split(' ')[0]}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
