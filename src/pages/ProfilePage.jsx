import { useEffect, useState } from 'react';
import ProfileSetup from './ProfileSetup';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('No user ID found');
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUserProfile(data.profile);
          setError(null);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (error) {
        setError('Failed to fetch profile');
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setTempProfile({
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      gender: userProfile?.gender || '',
      location: userProfile?.location || ''
    });
    setIsEditing(true);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleSaveProfile = async (updatedProfile) => {
    const userId = localStorage.getItem('userId');
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updatedProfile })
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Profile updated successfully');
        setUserProfile(updatedProfile);
        setIsEditing(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile(null);
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
            <h1 style={styles.editingTitle}>Edit Profile</h1>
            <ProfileSetup
              initialProfile={tempProfile}
              onSave={handleSaveProfile}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div style={styles.profileView}>
            <div style={styles.header}>
              <h1 style={styles.pageTitle}>My Profile</h1>
              <button style={styles.backButton} onClick={handleBack}>
                ← Back to Dashboard
              </button>
            </div>
            
            <div style={styles.profileContent}>
              <div style={styles.avatarSection}>
                <div style={styles.avatar}>
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h2 style={styles.userName}>{userProfile?.name || 'Name not set'}</h2>
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
                      {userProfile?.gender || 'Not specified'}
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
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '800px',
    overflow: 'hidden',
    animation: 'slideUp 0.5s ease-out'
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
  
  editingTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '30px',
    textAlign: 'center'
  },
  
  profileView: {
    padding: '40px'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0
  },
  
  backButton: {
    background: 'transparent',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#718096',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  profileContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
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
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
  },
  
  userName: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0
  },
  
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  
  infoCard: {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e2e8f0'
  },
  
  infoIcon: {
    fontSize: '24px',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  
  infoContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  
  infoLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  infoValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748'
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

// Add CSS keyframes for animations
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
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
  }
  
  .info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
  
  @media (max-width: 768px) {
    .profile-card {
      margin: 10px;
      border-radius: 16px;
    }
    
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
  }
`;
document.head.appendChild(styleSheet);