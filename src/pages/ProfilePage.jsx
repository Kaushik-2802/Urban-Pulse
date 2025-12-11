import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "",
    },
    profilePic: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch profile
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
          throw new Error("Unexpected error");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save whole profile (first-time profile creation)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData, userId };
      const method = profileExists ? "PUT" : "POST";
      const endpoint = profileExists
        ? `http://localhost:5000/api/profile/${userId}`
        : `http://localhost:5000/api/profile`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      alert(result.message || "Saved successfully");
      setProfileExists(true);
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  const startEditing = (field) => {
    setEditingField(field);

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setTempValue(formData[parent][child] || "");
    } else {
      setTempValue(formData[field] || "");
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveField = async () => {
    let updated = { ...formData };

    if (editingField.includes(".")) {
      const [parent, child] = editingField.split(".");
      updated = {
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: tempValue,
        },
      };
    } else {
      updated = { ...formData, [editingField]: tempValue };
    }

    try {
      const payload = { ...updated, userId };

      const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData(updated);
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.error(err);
    }

    setEditingField(null);
    setTempValue("");
  };

  // Profile Picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // FIXED renderField (was broken before)
  const renderField = (field, label, type = "text") => {
    const isEditing = editingField === field;

    let value = "";
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      value = formData[parent]?.[child] || "";
    } else {
      value = formData[field] || "";
    }

    return (
      <div className={`field-card ${isEditing ? "editing" : ""}`}>
        <div className="field-header">
          <div className="field-label">{label}</div>

          {isEditing ? (
            <div className="edit-actions">
              <button onClick={saveField} className="btn save">✔</button>
              <button onClick={cancelEditing} className="btn cancel">✖</button>
            </div>
          ) : (
            <button onClick={() => startEditing(field)} className="btn edit">
              ✎
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

  // CREATE PROFILE FORM (fixed accidental return)
  if (!profileExists && !isLoading) {
  return (
    <>
      <div className="create-profile-container">
        <h2>Create Your Profile</h2>

        <form onSubmit={handleSubmit} className="create-profile-form">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          /><br />

          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <label>Address Line 1</label>
          <input
            value={formData.address.addressLine1}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                address: { ...p.address, addressLine1: e.target.value },
              }))
            }
          />

          <label>Address Line 2</label>
          <input
            value={formData.address.addressLine2}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                address: { ...p.address, addressLine2: e.target.value },
              }))
            }
          />

          <label>City</label>
          <input
            value={formData.address.city}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                address: { ...p.address, city: e.target.value },
              }))
            }
          />

          <label>Country</label>
          <input
            value={formData.address.country}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                address: { ...p.address, country: e.target.value },
              }))
            }
          />

          <button type="submit">Create Profile</button>
        </form>
      </div>

      <style>{`
        html, body {
    margin: 0;
    padding: 0;
    background: #0a0a0a;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

        /* FIRST-TIME PROFILE CREATION PAGE */
        .create-profile-container {
          background: #0a0a0a;
          min-height: 100vh;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          font-family: "Inter", sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Background glowing circles (same vibe as full profile) */
        .create-profile-container::before,
        .create-profile-container::after {
          content: "";
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(140px);
          z-index: -1;
        }

        .create-profile-container::before {
          background: rgba(59, 130, 246, 0.2);
          top: -80px;
          left: -120px;
        }

        .create-profile-container::after {
          background: rgba(124, 58, 237, 0.18);
          bottom: -100px;
          right: -150px;
        }

        /* Heading */
        .create-profile-container h2 {
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 30px;
          text-align: center;
          background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -1px;
        }

        /* Form container */
        .create-profile-form {
          width: 100%;
          max-width: 430px;
          padding: 35px;
          background: rgba(15, 23, 42, 0.75);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.25);
          backdrop-filter: blur(18px);
        }

        /* Labels */
        .create-profile-form label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.92);
        }

        /* Inputs & Selects */
        .create-profile-form input,
        .create-profile-form select {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 18px;
          font-size: 15px;
          color: white;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(30, 41, 59, 0.55);
          outline: none;
          transition: all 0.25s ease;
        }

        /* Focus effect */
        .create-profile-form input:focus,
        .create-profile-form select:focus {
          border-color: #3b82f6;
          background: rgba(30, 41, 59, 0.85);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
        }

        /* Submit Button */
        .create-profile-form button {
          width: 100%;
          padding: 14px;
          margin-top: 10px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          transition: all 0.3s ease;
          box-shadow: 0 10px 32px rgba(59, 130, 246, 0.45);
        }

        .create-profile-form button:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(59, 130, 246, 0.55);
        }
      `}</style>
    </>
  );
}


  // MAIN PROFILE PAGE
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
      {/* HEADER */}
      <div className="profile-header">
        <button onClick={() => window.history.back()} className="btn back">
          ← Dashboard
        </button>
        <h2>My Profile</h2>
        <span className="status-badge">Active</span>
      </div>

      {/* PROFILE PICTURE */}
      <div className="profile-pic-section">
        <div className="profile-pic">
          {previewImage ? (
            <img src={previewImage} alt="Profile" />
          ) : formData.profilePic ? (
            <img src={formData.profilePic} alt="Profile" />
          ) : (
            <div className="no-pic">No Image</div>
          )}

          <div className="pic-overlay">
            <label className="pic-upload">
              Upload
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>
        </div>

        <h3 className="profile-name">{formData.name || "User Name"}</h3>
        <p className="profile-subtitle">Member since 2024</p>
      </div>

      {/* PERSONAL INFO */}
      <div className="section">
        <h4 className="section-title">Personal Information</h4>
        <div className="fields-grid">
          {renderField("name", "Full Name")}
          {renderField("phone", "Phone Number")}
          {renderField("gender", "Gender")}
        </div>
      </div>

      {/* ADDRESS INFO */}
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