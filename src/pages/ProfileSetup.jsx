import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileSetup({ initialProfile, onSave, onCancel }) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSave(profile);
    setIsSubmitting(false);
  };

  return (
    <div style={profileSetupStyles.container}>
      <form onSubmit={handleSubmit} style={profileSetupStyles.form}>
        <div style={profileSetupStyles.formGroup}>
          <label style={profileSetupStyles.label}>
            <span style={profileSetupStyles.labelText}>Full Name</span>
            <div style={profileSetupStyles.inputWrapper}>
              <span style={profileSetupStyles.inputIcon}>👤</span>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={handleChange}
                required
                style={profileSetupStyles.input}
              />
            </div>
          </label>
        </div>

        <div style={profileSetupStyles.formGroup}>
          <label style={profileSetupStyles.label}>
            <span style={profileSetupStyles.labelText}>Phone Number</span>
            <div style={profileSetupStyles.inputWrapper}>
              <span style={profileSetupStyles.inputIcon}>📱</span>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={profile.phone}
                onChange={handleChange}
                required
                style={profileSetupStyles.input}
              />
            </div>
          </label>
        </div>

        <div style={profileSetupStyles.formGroup}>
          <label style={profileSetupStyles.label}>
            <span style={profileSetupStyles.labelText}>Gender</span>
            <div style={profileSetupStyles.inputWrapper}>
              <span style={profileSetupStyles.inputIcon}>⚧</span>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                required
                style={profileSetupStyles.select}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </label>
        </div>

        <div style={profileSetupStyles.formGroup}>
          <label style={profileSetupStyles.label}>
            <span style={profileSetupStyles.labelText}>Location</span>
            <div style={profileSetupStyles.inputWrapper}>
              <span style={profileSetupStyles.inputIcon}>📍</span>
              <input
                type="text"
                name="location"
                placeholder="Enter your location"
                value={profile.location}
                onChange={handleChange}
                required
                style={profileSetupStyles.input}
              />
            </div>
          </label>
        </div>

        <div style={profileSetupStyles.buttonGroup}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...profileSetupStyles.saveButton,
              ...(isSubmitting ? profileSetupStyles.disabledButton : {})
            }}
          >
            {isSubmitting ? (
              <>
                <span style={profileSetupStyles.spinner}></span>
                Saving...
              </>
            ) : (
              <>
                💾 Save Profile
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              ...profileSetupStyles.cancelButton,
              ...(isSubmitting ? profileSetupStyles.disabledButton : {})
            }}
          >
            ✕ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Main ProfilePage Component
export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  const navigate=useNavigate();


  
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/profile/${userId}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setUserProfile(result.profile);
        setError(null);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError('Failed to fetch profile');
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


  const handleEditProfile = () => {
    setTempProfile({
      userId: userId,
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      gender: userProfile?.gender || '',
      location: userProfile?.location || ''
    });
    setIsEditing(true);
  };

  const handleBack = () => {
    // alert('Navigate to dashboard');
    navigate("/dashboard")
  };

  const handleSaveProfile = async (updatedProfile) => {
  try {
    const response = await fetch(`http://localhost:5000/api/profiles/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProfile)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      setUserProfile(result.profile);
      setIsEditing(false);
      showNotification('Profile updated successfully!', 'success');
    } else {
      throw new Error(result.message || 'Failed to update profile');
    }
  } catch (err) {
    console.error(err);
    showNotification('Error saving profile', 'error');
  }
};


  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile(null);
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Oops! Something went wrong</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button style={styles.retryButton} onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        {isEditing ? (
          <div style={styles.editingContainer}>
            <div style={styles.editingHeader}>
              <h1 style={styles.editingTitle}>✏️ Edit Profile</h1>
              <p style={styles.editingSubtitle}>Update your personal information</p>
            </div>
            <ProfileSetup
              initialProfile={tempProfile}
              onSave={handleSaveProfile}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div style={styles.profileView}>
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <h1 style={styles.pageTitle}>My Profile</h1>
                <p style={styles.pageSubtitle}>Manage your personal information</p>
              </div>
              <button style={styles.backButton} onClick={handleBack}>
                ← Dashboard
              </button>
            </div>
            
            <div style={styles.profileContent}>
              <div style={styles.avatarSection}>
                <div style={styles.avatar}>
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 style={styles.userName}>{userProfile?.name || 'Name not set'}</h2>
                <div style={styles.statusBadge}>
                  <span style={styles.statusDot}></span>
                  Profile Complete
                </div>
              </div>
              
              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>📱</div>
                  <div style={styles.infoContent}>
                    <label style={styles.infoLabel}>Phone</label>
                    <span style={styles.infoValue}>
                      {userProfile?.phone || 'Not provided'}
                    </span>
                  </div>
                </div>
                
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>👤</div>
                  <div style={styles.infoContent}>
                    <label style={styles.infoLabel}>Gender</label>
                    <span style={styles.infoValue}>
                      {userProfile?.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : 'Not specified'}
                    </span>
                  </div>
                </div>
                
                <div style={styles.infoCard}>
                  <div style={styles.infoIcon}>📍</div>
                  <div style={styles.infoContent}>
                    <label style={styles.infoLabel}>Location</label>
                    <span style={styles.infoValue}>
                      {userProfile?.location || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={styles.actionSection}>
                <button style={styles.editButton} onClick={handleEditProfile}>
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Setup Styles
const profileSetupStyles = {
  container: {
    padding: '20px 0'
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  labelText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    letterSpacing: '0.5px'
  },
  
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  
  inputIcon: {
    position: 'absolute',
    left: '16px',
    fontSize: '18px',
    zIndex: 1
  },
  
  input: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box'
  },
  
  select: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  
  saveButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  
  cancelButton: {
    flex: 1,
    background: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  
  disabledButton: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

// Main Profile Page Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  
  profileCard: {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '900px',
    overflow: 'hidden',
    animation: 'slideUp 0.6s ease-out'
  },
  
  loadingSpinner: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'white'
  },
  
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  
  loadingText: {
    fontSize: '18px',
    margin: 0,
    fontWeight: '500'
  },
  
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'white'
  },
  
  errorIcon: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  
  errorTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
    margin: 0
  },
  
  errorMessage: {
    fontSize: '16px',
    marginBottom: '30px',
    opacity: 0.9
  },
  
  retryButton: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  },
  
  editingContainer: {
    padding: '40px'
  },
  
  editingHeader: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  
  editingTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  
  editingSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  
  profileView: {
    padding: '40px'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  },
  
  pageSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  
  backButton: {
    background: 'transparent',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  profileContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  },
  
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: '700',
    color: 'white',
    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
  },
  
  userName: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ecfdf5',
    color: '#059669',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981'
  },
  
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  
  infoCard: {
    background: '#f9fafb',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6'
  },
  
  infoIcon: {
    fontSize: '24px',
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  
  infoContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  
  infoLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.8px'
  },
  
  infoValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937'
  },
  
  actionSection: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  
  editButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
  }
  
  input:focus, select:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  .info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
  }
  
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      font-size: 40px;
    }
    
    .page-title {
      font-size: 24px;
    }
    
    .button-group {
      flex-direction: column;
    }
  }
`;

if (!document.head.querySelector('style[data-profile-styles]')) {
  styleSheet.setAttribute('data-profile-styles', 'true');
  document.head.appendChild(styleSheet);
}