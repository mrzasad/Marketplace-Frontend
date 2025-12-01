import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user: authUser, login: updateAuthUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatAddress = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.zipCode) parts.push(address.zipCode);
      if (address.country) parts.push(address.country);
      return parts.join(', ') || '';
    }
    return '';
  };

  const parseAddress = (addressString) => {
    if (!addressString || typeof addressString === 'object') return addressString;
    // If it's a string, try to parse it or return as is
    return addressString;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProfile();
      
      if (response.data.success) {
        const userData = response.data.data.user || response.data.data;
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: formatAddress(userData.address),
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to load profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      // Prepare data for submission - keep address as string if it was originally a string
      const submitData = {
        ...formData,
        // If the original address was an object, we might need to keep it as string
        // or convert back to object format based on API requirements
        address: formData.address || undefined,
      };
      
      const response = await updateProfile(submitData);
      
      if (response.data.success) {
        const updatedUser = response.data.data.user || response.data.data;
        setUser(updatedUser);
        updateAuthUser(updatedUser, localStorage.getItem('token'));
        setSuccess('Profile updated successfully!');
        setEditing(false);
        // Update formData with the new user data
        setFormData({
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          address: formatAddress(updatedUser.address),
        });
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update profile'
      );
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchProfile} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="edit-button">
            Edit Profile
          </button>
        )}
      </div>

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="profile-card">
        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: formatAddress(user?.address),
                  });
                  setError('');
                  setSuccess('');
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <label>Name</label>
              <p>{user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.name || 'Not set'}</p>
            </div>
            <div className="info-group">
              <label>Email</label>
              <p>{user?.email || 'Not set'}</p>
            </div>
            <div className="info-group">
              <label>Phone</label>
              <p>{user?.phone || 'Not set'}</p>
            </div>
            <div className="info-group">
              <label>Address</label>
              <p>{formatAddress(user?.address) || 'Not set'}</p>
            </div>
            <div className="info-group">
              <label>Role</label>
              <p className="role-badge">{user?.role || 'buyer'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

