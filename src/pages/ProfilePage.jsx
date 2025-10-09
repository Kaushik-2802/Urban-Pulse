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
  
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(data); 
          setProfileExists(true);
        } else if (res.status === 404) {
          setProfileExists(false);
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
      const updatedFormData = { ...formData, [editingField]: tempValue };
      
      if (profileExists) {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderField = (field, label, type = "text") => {
    const isEditing = editingField === field;
    let value;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      value = formData[parent] ? formData[parent][child] : '';
    } else {
      value = formData[field];
    }

    return (
      <div className={`field-card ${isEditing ? "editing" : ""}`}>
        <div className="field-header">
          <div className="field-label">{label}</div>
          {isEditing ? (
            <div className="edit-actions">
              <button onClick={saveField} className="btn save">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              </button>
              <button onClick={cancelEditing} className="btn cancel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => startEditing(field)}
              className="btn edit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="m18.5 2.5 3 3L14 14l-4 1 1-4 7.5-7.5z"></path>
              </svg>
            </button>
          )}
        </div>

        {isEditing ? (
          field === "gender" ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="input"
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
              className="input"
              autoFocus
            />
          )
        ) : (
          <div className="field-value">{value || <i>Not set</i>}</div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Animated Background */}
      <div className="background-decoration">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="profile-wrapper">
        {/* Header */}
        <div className="profile-header">
          <button onClick={() => window.history.back()} className="btn back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Dashboard
          </button>
          <h2>My Profile</h2>
          <div className="profile-status">
            <span className="status-badge">Active</span>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="profile-pic-section">
          <div className="profile-pic">
            {previewImage ? (
              <img src={previewImage} alt="Profile" />
            ) : (
              <div className="no-pic">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <div className="pic-overlay">
              <label className="pic-upload">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>
          </div>
          <h3 className="profile-name">{formData.name || 'User Name'}</h3>
          <p className="profile-subtitle">Member since 2024</p>
        </div>

        {/* Personal Information */}
        <div className="section">
          <div className="section-header">
            <h4 className="section-title">Personal Information</h4>
            <div className="section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <div className="fields-grid">
            {renderField("name", "Full Name")}
            {renderField("phone", "Phone Number", "tel")}
            {renderField("gender", "Gender")}
          </div>
        </div>

        {/* Address Information */}
        <div className="section">
          <div className="section-header">
            <h4 className="section-title">Address Information</h4>
            <div className="section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
          <div className="fields-grid">
            {renderField("address.addressLine1", "Address Line 1")}
            {renderField("address.addressLine2", "Address Line 2")}
            {renderField("address.city", "City")}
            {renderField("address.country", "Country")}
          </div>
        </div>
      </div>

      <style>
        {`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }

        .profile-container {
          min-height: 100vh;
          background: #0a0a0a;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .background-decoration {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
        }

        .bg-circle-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .bg-circle-2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
          bottom: 20%;
          left: 5%;
          animation-delay: 2s;
        }

        .bg-circle-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        .profile-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .profile-header {
          background: rgba(15, 23, 42, 0.8);
          backdropFilter: blur(20px);
          WebkitBackdropFilter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .profile-header h2 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%);
          WebkitBackgroundClip: text;
          WebkitTextFillColor: transparent;
          backgroundClip: text;
          letterSpacing: -1px;
        }

        .status-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 8px 20px;
          borderRadius: 20px;
          fontSize: 13px;
          fontWeight: 700;
          textTransform: uppercase;
          letterSpacing: 0.5px;
          boxShadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .profile-pic-section {
          text-align: center;
          padding: 60px 32px;
          background: rgba(15, 23, 42, 0.6);
          backdropFilter: blur(20px);
          borderBottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-pic {
          width: 160px;
          height: 160px;
          margin: 0 auto 24px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(59, 130, 246, 0.3);
          position: relative;
          background: rgba(30, 41, 59, 0.8);
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
        }

        .profile-pic:hover {
          transform: scale(1.05);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 15px 50px rgba(59, 130, 246, 0.5);
        }

        .profile-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-pic {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: rgba(255, 255, 255, 0.5);
        }

        .pic-overlay {
          position: absolute;
          bottom: 5px;
          right: 5px;
        }

        .pic-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }

        .pic-upload:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.7);
        }

        .pic-upload svg {
          color: white;
        }

        .profile-name {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .profile-subtitle {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          font-size: 15px;
          font-weight: 500;
        }

        .section {
          background: rgba(15, 23, 42, 0.6);
          backdropFilter: blur(20px);
          margin: 0;
          padding: 40px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%);
          WebkitBackgroundClip: text;
          WebkitTextFillColor: transparent;
          backgroundClip: text;
          margin: 0;
        }

        .section-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          borderRadius: 14px;
          display: flex;
          alignItems: center;
          justifyContent: center;
          color: white;
          boxShadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .fields-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .field-card {
          background: rgba(30, 41, 59, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          border-radius: 16px;
          transition: all 0.3s ease;
          position: relative;
        }

        .field-card:hover {
          border-color: rgba(59, 130, 246, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.2);
        }

        .field-card.editing {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .field-label {
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .field-value {
          font-size: 17px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .field-value i {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          color: white;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
          background: rgba(15, 23, 42, 0.8);
        }

        .input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        select.input {
          cursor: pointer;
        }

        select.input option {
          background: #1e293b;
          color: white;
        }

        .btn {
          padding: 10px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn.back {
          background: rgba(100, 116, 139, 0.3);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
        }

        .btn.back:hover {
          background: rgba(100, 116, 139, 0.5);
          box-shadow: 0 4px 15px rgba(100, 116, 139, 0.4);
        }

        .btn.edit {
          background: rgba(100, 116, 139, 0.3);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 42px;
          height: 42px;
          justify-content: center;
          padding: 0;
        }

        .btn.edit:hover {
          background: rgba(100, 116, 139, 0.5);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .btn.save {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          width: 40px;
          height: 40px;
          justify-content: center;
          padding: 0;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .btn.save:hover {
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
        }

        .btn.cancel {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          width: 40px;
          height: 40px;
          justify-content: center;
          padding: 0;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .btn.cancel:hover {
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #0a0a0a;
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
          gap: 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(59, 130, 246, 0.2);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #1e293b;
        }

        *::-webkit-scrollbar {
          width: 10px;
        }

        *::-webkit-scrollbar-track {
          background: #1e293b;
        }

        *::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 10px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
        }

        @media (max-width: 768px) {
          .profile-header {
            padding: 16px 20px;
            flex-wrap: wrap;
            gap: 12px;
          }

          .profile-header h2 {
            font-size: 24px;
            order: 2;
            width: 100%;
          }

          .btn.back {
            order: 1;
          }

          .profile-status {
            order: 3;
          }

          .section {
            padding: 30px 20px;
          }

          .profile-pic {
            width: 130px;
            height: 130px;
          }

          .fields-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .field-card {
            padding: 20px;
          }

          .bg-circle {
            filter: blur(60px);
          }
        }
        `}
      </style>
    </div>
  );
}