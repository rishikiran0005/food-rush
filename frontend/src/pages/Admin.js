import React, { useState, useEffect } from 'react';
import { orderAPI, foodAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Admin.css';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '', description: '', price: '', category: '', imageUrl: '', available: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, foodsRes] = await Promise.all([
        orderAPI.getAllOrders(),
        foodAPI.getAll(),
      ]);
      setOrders(ordersRes.data);
      setFoods(foodsRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated.data : o)));
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleToggleAvailability = async (foodId) => {
    try {
      const res = await foodAPI.toggleAvailability(foodId);
      setFoods((prev) => prev.map((f) => (f.id === foodId ? res.data : f)));
      toast.success('Availability updated');
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await foodAPI.delete(foodId);
      setFoods((prev) => prev.filter((f) => f.id !== foodId));
      toast.success('Food item deleted');
    } catch {
      toast.error('Failed to delete food item');
    }
  };

  const openFoodForm = (food = null) => {
    if (food) {
      setEditingFood(food);
      setFoodForm({ name: food.name, description: food.description || '', price: food.price,
        category: food.category || '', imageUrl: food.imageUrl || '', available: food.available });
    } else {
      setEditingFood(null);
      setFoodForm({ name: '', description: '', price: '', category: '', imageUrl: '', available: true });
    }
    setShowFoodForm(true);
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        const res = await foodAPI.update(editingFood.id, foodForm);
        setFoods((prev) => prev.map((f) => (f.id === editingFood.id ? res.data : f)));
        toast.success('Food item updated');
      } else {
        const res = await foodAPI.create(foodForm);
        setFoods((prev) => [...prev, res.data]);
        toast.success('Food item created');
      }
      setShowFoodForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  // Stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
    totalRevenue: orders.filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0),
    totalFoods: foods.length,
  };

  if (loading) return (
    <div className="loading-wrapper"><div className="spinner" /><p>Loading dashboard…</p></div>
  );

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage orders and menu items</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon">📦</div>
            <div><div className="stat-value">{stats.totalOrders}</div><div className="stat-label">Total Orders</div></div>
          </div>
          <div className="stat-card accent"><div className="stat-icon">⏳</div>
            <div><div className="stat-value">{stats.pendingOrders}</div><div className="stat-label">Pending</div></div>
          </div>
          <div className="stat-card success"><div className="stat-icon">💰</div>
            <div><div className="stat-value">₹{stats.totalRevenue.toFixed(0)}</div><div className="stat-label">Revenue</div></div>
          </div>
          <div className="stat-card info"><div className="stat-icon">🍽️</div>
            <div><div className="stat-value">{stats.totalFoods}</div><div className="stat-label">Menu Items</div></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}>📦 Orders ({orders.length})</button>
          <button className={`admin-tab ${activeTab === 'foods' ? 'active' : ''}`}
            onClick={() => setActiveTab('foods')}>🍽️ Menu Items ({foods.length})</button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>
                      <div className="customer-cell">
                        <strong>{order.userName}</strong>
                        <span>{order.userEmail}</span>
                      </div>
                    </td>
                    <td>{order.orderItems?.length} item(s)</td>
                    <td><strong className="price-cell">₹{Number(order.totalAmount).toFixed(2)}</strong></td>
                    <td className="date-cell">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <select
                        className={`status-select badge badge-${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div>
            <div className="admin-foods-header">
              <span>{foods.length} items</span>
              <button className="btn btn-primary btn-sm" onClick={() => openFoodForm()}>
                + Add Item
              </button>
            </div>
            <div className="admin-table-wrap card">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food.id}>
                      <td>
                        <div className="food-cell">
                          <img src={food.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=40'}
                            alt={food.name} className="food-thumb"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=40'; }} />
                          <strong>{food.name}</strong>
                        </div>
                      </td>
                      <td><span className="badge badge-confirmed">{food.category}</span></td>
                      <td><strong>₹{Number(food.price).toFixed(2)}</strong></td>
                      <td>
                        <button
                          className={`availability-btn ${food.available ? 'available' : 'unavailable'}`}
                          onClick={() => handleToggleAvailability(food.id)}
                        >
                          {food.available ? '✅ Available' : '❌ Unavailable'}
                        </button>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-outline btn-sm" onClick={() => openFoodForm(food)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFood(food.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Food Form Modal */}
        {showFoodForm && (
          <div className="modal-overlay" onClick={() => setShowFoodForm(false)}>
            <div className="modal-box card" onClick={(e) => e.stopPropagation()}>
              <h3>{editingFood ? 'Edit Food Item' : 'Add Food Item'}</h3>
              <form onSubmit={handleFoodSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input className="form-control" value={foodForm.name} required
                      onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input className="form-control" value={foodForm.category}
                      onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input className="form-control" value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" step="0.01" className="form-control" value={foodForm.price} required
                      onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Available</label>
                    <select className="form-control" value={foodForm.available}
                      onChange={(e) => setFoodForm({ ...foodForm, available: e.target.value === 'true' })}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input className="form-control" value={foodForm.imageUrl}
                    placeholder="https://..."
                    onChange={(e) => setFoodForm({ ...foodForm, imageUrl: e.target.value })} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowFoodForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingFood ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
