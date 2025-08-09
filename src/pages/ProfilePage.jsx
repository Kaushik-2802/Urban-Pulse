import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: ''
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  
  // New state for individual field editing
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(data); // Changed from data.profile to just data
          setProfileExists(true);
        } else if (res.status === 404) {
          setProfileExists(false); // No profile, allow creation
        } else {
          throw new Error('Unexpected error');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, userId };
      const method = profileExists ? 'PUT' : 'POST';
      const endpoint = profileExists
        ? `http://localhost:5000/api/profile/${userId}`
        : `http://localhost:5000/api/profile`;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      alert(result.message || 'Saved successfully');
      setProfileExists(true);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Error saving profile');
    }
  };

  const handleBackToDashboard = () => {
    window.history.back();
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const startEditing = (field) => {
    setEditingField(field);
    setTempValue(formData[field]);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const saveField = async () => {
    try {
      // Update the form data
      const updatedFormData = { ...formData, [editingField]: tempValue };
      
      if (profileExists) {
        // If profile exists, update it via API
        const payload = { ...updatedFormData, userId };
        const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (res.ok) {
          setFormData(updatedFormData);
          alert(result.message || 'Field updated successfully');
        } else {
          throw new Error(result.message || 'Failed to update');
        }
      } else {
        setFormData(updatedFormData);
      }
      
      setEditingField(null);
      setTempValue('');
    } catch (err) {
      console.error('Failed to save field:', err);
      alert('Error updating field');
    }
  };


  const renderField = (field, label, type = 'text') => {
    const isEditing = editingField === field;
    const value = formData[field];

    const fieldContainerStyle = {
      background: '#ffffff',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    };

    const editingStyle = {
      ...fieldContainerStyle,
      borderColor: '#3b82f6',
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15)',
      transform: 'translateY(-2px)'
    };

    return (
      <div style={isEditing ? editingStyle : fieldContainerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {label}
            </label>
            
            {isEditing ? (
              <div style={{ marginBottom: '12px' }}>
                {field === 'gender' ? (
                  <select
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type={type}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    autoFocus
                  />
                )}
              </div>
            ) : (
              <div style={{
                fontSize: '18px',
                color: '#111827',
                fontWeight: '500',
                minHeight: '24px',
                marginBottom: '8px'
              }}>
                {value || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not set</span>}
              </div>
            )}
          </div>
          
          <div style={{ marginLeft: '16px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={saveField}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEditing(field)}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e5e7eb';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f3f4f6';
                }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <div style={{ 
    textAlign: 'center', 
    padding: '40px',
    fontSize: '18px',
    color: '#6b7280'
  }}>Loading profile...</div>;



  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#f9fafb',
    minHeight: '100vh'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '32px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    position: 'relative'
  };

  const backButtonStyle = {
    position: 'absolute',
    top: '24px',
    left: '24px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const formStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    marginBottom: '24px'
  };

  const originalFormStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    border: '2px dashed #d1d5db'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
    marginBottom: '16px'
  };

  const selectStyle = {
    ...inputStyle,
    background: 'white'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button
          style={backButtonStyle}
          onClick={handleBackToDashboard}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Dashboard
        </button>
        
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {profileExists ? 'Edit Profile' : 'Create Your Profile'}
          </h2>
          <p style={{
            fontSize: '16px',
            opacity: '0.9',
            margin: '0',
            fontWeight: '400'
          }}>
            {profileExists ? 'Update individual fields or use the form below' : 'Fill out your profile information'}
          </p>
        </div>
      </div>
      {/* Original Form - Always Available */}
      <div style={originalFormStyle}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          {profileExists ? 'Update All Fields' : 'Create Profile'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            required
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="addressLine1"
            value={formData.address?.addressLine1 || ""}
            placeholder="Address Line 1"
            onChange={handleAddressChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <input
            type="text"
            name="addressLine2"
            value={formData.address?.addressLine2 || ""}
            placeholder="Address Line 2"
            onChange={handleAddressChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <input
            type="text"
            name="city"
            value={formData.address?.city || ""}
            placeholder="City"
            onChange={handleAddressChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <input
            type="text"
            name="country"
            value={formData.address?.country || ""}
            placeholder="Country"
            onChange={handleAddressChange}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <button 
            type="submit" 
            style={buttonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}