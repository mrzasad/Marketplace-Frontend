import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProduct(id);
      
      console.log('Product Detail API Response:', response.data); // Debug log
      
      if (response.data.success) {
        // Handle different possible response structures
        const productData = response.data.data;
        const product = productData.product || productData;
        if (product && product.id) {
          setProduct(product);
        } else {
          setError('Product not found');
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Product fetch error:', err); // Debug log
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to load product'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Optionally show a success message or navigate to cart
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error">
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/products')} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate('/products')} className="back-button">
        ← Back to Products
      </button>
      
      <div className="product-detail">
        <div className="product-detail-image">
          {(() => {
            // Handle both 'image' (string) and 'images' (array) from API
            const productImage = (product.images && Array.isArray(product.images) && product.images.length > 0) 
              ? product.images[0] 
              : product.image;
            
            return productImage && !imageError ? (
              <img 
                src={productImage} 
                alt={product.name}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="product-detail-placeholder">
                {product.name || 'No Image'}
              </div>
            );
          })()}
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price?.toFixed(2) || '0.00'}</p>
          
          {product.description && (
            <div className="product-detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="product-detail-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input"
              />
            </div>
            
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

