import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [imageErrors, setImageErrors] = useState({});

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              {(() => {
                // Handle both 'image' (string) and 'images' (array) from API
                const itemImage = (item.images && Array.isArray(item.images) && item.images.length > 0) 
                  ? item.images[0] 
                  : item.image;
                
                return itemImage && !imageErrors[item.id] ? (
                  <img 
                    src={itemImage} 
                    alt={item.name}
                    onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                  />
                ) : (
                  <div className="cart-item-placeholder">
                    {item.name || 'No Image'}
                  </div>
                );
              })()}
            </div>
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-button"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-button"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <strong>Total: ${getCartTotal().toFixed(2)}</strong>
        </div>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;

