import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name}! 🎉`);
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-badge">🍽️ FoodRush</div>
          <h1>Join thousands of happy customers.</h1>
          <p>Create your account and start ordering your favourite meals in minutes.</p>
          <ul className="hero-perks">
            <li>✅ Free delivery on first order</li>
            <li>✅ Real-time order tracking</li>
            <li>✅ 500+ dishes to choose from</li>
            <li>✅ Secure payments</li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text" name="name" className="form-control"
                placeholder="John Doe"
                value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email" name="email" className="form-control"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password" name="password" className="form-control"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel" name="phone" className="form-control"
                  placeholder="+91 99999 99999"
                  value={form.phone} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <input
                type="text" name="address" className="form-control"
                placeholder="123 Street, City"
                value={form.address} onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
