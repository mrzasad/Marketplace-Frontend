import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  // Handle both 'image' (string) and 'images' (array) from API
  const getProductImage = () => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return product.image || null;
  };

  const productImage = getProductImage();

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {productImage && !imageError ? (
          <img 
            src={productImage} 
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            {product.name || 'No Image'}
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price?.toFixed(2) || '0.00'}</p>
        {product.description && (
          <p className="product-description">{product.description.substring(0, 100)}...</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

