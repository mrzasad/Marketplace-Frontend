import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import './ProductFilters.css';

const ProductFilters = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getCategories();
      if (response.data.success) {
        const categoriesData = response.data.data;
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="product-filters">
      <div className="filters-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="filters-header-left">
          <h2>Filters</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="toggle-filters-btn"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
          </button>
        </div>
        <div className="filters-header-right" onClick={(e) => e.stopPropagation()}>
          <button onClick={onReset} className="reset-filters-btn">
            Reset
          </button>
        </div>
      </div>

      <div className={`filters-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="filters-content-inner">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {loadingCategories ? (
                <option>Loading...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By</label>
            <select
              id="sort"
              value={filters.sort || ''}
              onChange={(e) => handleChange('sort', e.target.value)}
              className="filter-select"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="featured">Featured Only</label>
            <input
              type="checkbox"
              id="featured"
              checked={filters.featured === 'true' || filters.featured === true}
              onChange={(e) => handleChange('featured', e.target.checked ? 'true' : '')}
              className="filter-checkbox"
            />
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="filter-input price-input"
                min="0"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="filter-input price-input"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

