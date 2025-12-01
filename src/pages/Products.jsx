import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '',
    featured: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query params, removing empty values
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
          params[key] = filters[key];
        }
      });
      
      const response = await getProducts(params);
      
      if (response.data.success) {
        const productsData = response.data.data;
        const productsList = productsData.products || productsData || [];
        setProducts(Array.isArray(productsList) ? productsList : []);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to load products. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, filters.search ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      sort: '',
      featured: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1>Products</h1>
      
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
          <button onClick={handleResetFilters} className="retry-button">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="products-count">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;

