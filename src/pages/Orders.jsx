import { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getOrders();
      
      if (response.data.success) {
        const ordersData = response.data.data;
        const ordersList = ordersData.orders || ordersData || [];
        setOrders(Array.isArray(ordersList) ? ordersList : []);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to load orders'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'hsl(38 92% 50%)',
      processing: 'hsl(221 83% 53%)',
      shipped: 'hsl(221 83% 53%)',
      delivered: 'hsl(142 76% 36%)',
      cancelled: 'hsl(var(--destructive))',
    };
    return statusColors[status?.toLowerCase()] || 'hsl(var(--muted-foreground))';
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Order History</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')} className="browse-button">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id?.split('-')[0] || order.id}</h3>
                  <p className="order-date">{formatDate(order.createdAt || order.date)}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                  >
                    {order.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-info">
                        <h4>{item.product?.name || item.name || `Item ${index + 1}`}</h4>
                        <p>Quantity: {item.quantity || 1}</p>
                        {item.product?.price && (
                          <p className="item-price">
                            ${(item.product.price * (item.quantity || 1)).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No items found</p>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ${order.total?.toFixed(2) || order.amount?.toFixed(2) || '0.00'}</strong>
                </div>
                {order.paymentMethod && (
                  <p className="payment-method">Payment: {order.paymentMethod}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

