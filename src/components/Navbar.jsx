import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/products');
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Marketplace
        </Link>
        
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link 
                to="/products" 
                className={`navbar-link ${isActive('/products') ? 'active' : ''}`}
              >
                Products
              </Link>
              <Link 
                to="/cart" 
                className={`navbar-link cart-link ${isActive('/cart') ? 'active' : ''}`}
              >
                Cart ({getCartItemCount()})
              </Link>
              <Link 
                to="/orders" 
                className={`navbar-link ${isActive('/orders') ? 'active' : ''}`}
              >
                Orders
              </Link>
              <Link 
                to="/profile" 
                className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
              >
                Profile
              </Link>
              <span className="navbar-user">
                Hello, {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.name || user?.firstName || user?.lastName || user?.email || 'User'}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

