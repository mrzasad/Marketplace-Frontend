import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAPI(email, password);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        login(user, token);
        navigate('/products');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password123"
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-hint">
          <p>Test Credentials:</p>
          <p>Email: john.doe@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

