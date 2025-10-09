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
    const [previewImage, setPreviewImage] = useState(null);

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

  if (isLoading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
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

      {/* Profile Picture */}
      <div className="profile-pic-section">
        <div className="profile-pic">
          {previewImage ? (
            <img src={previewImage} alt="Profile" />
          ) : (
            <div className="no-pic">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
          <div className="pic-overlay">
            <label className="pic-upload">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>
        </div>
        <h3 className="profile-name">{formData.name}</h3>
        <p className="profile-subtitle">Member since 2024</p>
      </div>

      {/* Personal Information */}
      <div className="section">
        <h4 className="section-title">Personal Information</h4>
        <div className="fields-grid">
          {renderField("name", "Full Name")}
          {renderField("phone", "Phone Number", "tel")}
          {renderField("gender", "Gender")}
        </div>
      </div>

      {/* Address Information */}
      <div className="section">
        <h4 className="section-title">Address Information</h4>
        <div className="fields-grid">
          {renderField("address.addressLine1", "Address Line 1")}
          {renderField("address.addressLine2", "Address Line 2")}
          {renderField("address.city", "City")}
          {renderField("address.country", "Country")}
        </div>
      </div>

      <style>
        {`
        .profile-container {
          max-width: 900px;
          margin: 20px auto;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          border-radius: 0;
        }

        .profile-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .profile-header h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .status-badge {
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .profile-pic-section {
          text-align: center;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .profile-pic {
          width: 140px;
          height: 140px;
          margin: 0 auto 20px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.3);
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .profile-pic:hover {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.5);
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
          color: rgba(255, 255, 255, 0.7);
        }

        .pic-overlay {
          position: absolute;
          bottom: -5px;
          right: -5px;
        }

        .pic-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
        }

        .pic-upload:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(238, 90, 36, 0.6);
        }

        .pic-upload svg {
          color: white;
        }

        .profile-name {
          color: white;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 5px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .profile-subtitle {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 14px;
        }

        .section {
          background: white;
          margin: 0;
          padding: 30px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .section:last-child {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .section-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 25px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }

        .fields-grid {
          display: grid;
          gap: 20px;
        }

        .field-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }

        .field-card:hover {
          border-color: #cbd5e0;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .field-card.editing {
          border-color: #4299e1;
          background: #ebf8ff;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .field-label {
          font-weight: 600;
          color: #2d3748;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-value {
          font-size: 16px;
          color: #4a5568;
          font-weight: 500;
        }

        .field-value i {
          color: #a0aec0;
          font-style: italic;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          color: #2d3748;
          background: white;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .btn {
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn.back {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn.back:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .btn.edit {
          background: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
          width: 40px;
          height: 40px;
          justify-content: center;
          padding: 0;
        }

        .btn.edit:hover {
          background: #edf2f7;
          color: #2d3748;
          border-color: #cbd5e0;
        }

        .btn.save {
          background: linear-gradient(45deg, #48bb78, #38a169);
          color: white;
          width: 36px;
          height: 36px;
          justify-content: center;
          padding: 0;
          box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
        }

        .btn.save:hover {
          box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4);
        }

        .btn.cancel {
          background: linear-gradient(45deg, #f56565, #e53e3e);
          color: white;
          width: 36px;
          height: 36px;
          justify-content: center;
          padding: 0;
          box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
        }

        .btn.cancel:hover {
          box-shadow: 0 6px 16px rgba(245, 101, 101, 0.4);
        }

        .loading {
          text-align: center;
          font-size: 18px;
          color: white;
          padding: 60px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .profile-container {
            margin: 0;
            border-radius: 0;
          }

          .profile-header {
            padding: 15px 20px;
          }

          .profile-header h2 {
            font-size: 24px;
          }

          .section {
            padding: 20px;
          }

          .profile-pic {
            width: 120px;
            height: 120px;
          }

          .fields-grid {
            gap: 15px;
          }

          .field-card {
            padding: 16px;
          }
        }
        `}
      </style>
    </div>
  );
}