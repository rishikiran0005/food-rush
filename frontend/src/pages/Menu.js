import React, { useState, useEffect } from 'react';
import { foodAPI } from '../services/api';
import FoodCard from '../components/FoodCard';
import { toast } from 'react-toastify';
import './Menu.css';

const CATEGORIES = ['All', 'Pizza', 'Burgers', 'Indian', 'Pasta', 'Salads', 'Starters', 'Desserts', 'Beverages', 'Sides'];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await foodAPI.getAll();
        setFoods(res.data);
        setFiltered(res.data);
      } catch (err) {
        toast.error('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Filter by category + search
  useEffect(() => {
    let result = foods;
    if (activeCategory !== 'All') {
      result = result.filter((f) => f.category === activeCategory);
    }
    if (search.trim()) {
      result = result.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [activeCategory, search, foods]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p>Loading delicious menu…</p>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="container">
        {/* Header */}
        <div className="menu-header">
          <div>
            <h1>Our Menu</h1>
            <p>{filtered.length} dishes available</p>
          </div>
          <div className="menu-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No dishes found</h3>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <div className="food-grid">
            {filtered.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
