import { useState, useEffect } from 'react';

export default function WorkerProfileForm({ userId, onBack }) {

  function ProfileField({
    field,
    value,
    editingField,
    editValue,
    onEdit,
    onChange,
    onCancel,
    onSave,
    saving,
    getFieldIcon,
    getFieldLabel,
  }) {
    const isEditing = editingField === field;

    if (field === 'serviceAreas') {
      return (
        <div style={profileItemStyle}>
          <div style={fieldWrapperStyle}>
            <div style={fieldLeftStyle}>
              <div style={iconBoxStyle}>{getFieldIcon(field)}</div>
              <div style={fieldInfoStyle}>
                <label style={labelStyle}>{getFieldLabel(field)}</label>
                {!isEditing && (
                  <div style={fieldValueStyle}>
                    {Array.isArray(value) && value.length > 0 ? (
                      <div style={serviceAreasDisplayStyle}>
                        {value.map((area, idx) => (
                          <span key={idx} style={serviceAreaTagStyle}>{area}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={placeholderStyle}>No service areas selected</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {!isEditing && (
              <button onClick={onEdit} style={editButtonStyle} disabled={saving}>
                <span style={editIconStyle}>✏️</span>
              </button>
            )}
          </div>

          {isEditing && (
            <div style={editSectionStyle}>
              <div style={checkboxContainerStyle}>
                {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'].map(city => (
                  <label key={city} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      value={city}
                      checked={editValue.includes(city)}
                      onChange={e => {
                        if (e.target.checked) {
                          onChange([...editValue, city]);
                        } else {
                          onChange(editValue.filter(area => area !== city));
                        }
                      }}
                      style={checkboxStyle}
                    />
                    <span style={checkboxTextStyle}>{city}</span>
                  </label>
                ))}
              </div>

              <div style={actionButtonsStyle}>
                <button onClick={onCancel} style={cancelButtonStyle} disabled={saving}>
                  <span style={{ marginRight: '6px' }}>✕</span>
                  Cancel
                </button>
                <button onClick={onSave} style={saveButtonStyle} disabled={saving}>
                  {saving ? <span>⏳ Saving...</span> : <><span style={{ marginRight: '6px' }}>✓</span>Save Changes</>}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // For other fields
    return (
      <div style={profileItemStyle}>
        <div style={fieldWrapperStyle}>
          <div style={fieldLeftStyle}>
            <div style={iconBoxStyle}>{getFieldIcon(field)}</div>
            <div style={fieldInfoStyle}>
              <label style={labelStyle}>{getFieldLabel(field)}</label>
              {!isEditing && (
                <div style={fieldValueStyle}>
                  {value ? (
                    <span style={valueTextStyle}>{value}</span>
                  ) : (
                    <span style={placeholderStyle}>Not provided</span>
                  )}
                </div>
              )}
            </div>
          </div>
          {!isEditing && (
            <button onClick={onEdit} style={editButtonStyle} disabled={saving}>
              <span style={editIconStyle}>✏️</span>
            </button>
          )}
        </div>

        {isEditing && (
          <div style={editSectionStyle}>
            <input
              type="text"
              value={editValue || ''}
              onChange={e => onChange(e.target.value)}
              style={editInputStyle}
              placeholder={`Enter ${getFieldLabel(field)}`}
              autoFocus
            />
            <div style={actionButtonsStyle}>
              <button onClick={onCancel} style={cancelButtonStyle} disabled={saving}>
                <span style={{ marginRight: '6px' }}>✕</span>
                Cancel
              </button>
              <button onClick={onSave} style={saveButtonStyle} disabled={saving}>
                {saving ? <span>⏳ Saving...</span> : <><span style={{ marginRight: '6px' }}>✓</span>Save Changes</>}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    gender: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      pincode: ''
    },
    profession: '',
    serviceAreas: []
  });

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/worker/profile/${userId}`);
        if (!res.ok) throw new Error('No existing profile');
        const data = await res.json();

        setProfile({
          name: data.name || '',
          phone: data.phone || '',
          gender: data.gender || '',
          address: {
            addressLine1: data.address?.addressLine1 || '',
            addressLine2: data.address?.addressLine2 || '',
            city: data.address?.city || '',
            country: data.address?.country || '',
            pincode: data.address?.pincode || ''
          },
          profession: data.profession || '',
          serviceAreas: data.serviceAreas || []
        });
      } catch (err) {
        console.log('Profile not found or error occurred (expected for new users).');
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    }

    if (userId) fetchProfile();
  }, [userId]);

  const handleEdit = (field) => {
    setEditingField(field);
    if (field === 'serviceAreas') {
      setEditValue([...profile[field]]);
    } else {
      setEditValue(profile[field]);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSave = async (field) => {
    setSaving(true);
    try {
      let updatedProfile = { ...profile };

      if (field.startsWith('address.')) {
        const addrField = field.split('.')[1];
        updatedProfile = {
          ...profile,
          address: {
            ...profile.address,
            [addrField]: editValue
          }
        };
      } else {
        updatedProfile = {
          ...profile,
          [field]: editValue
        };
      }

      const res = await fetch('http://localhost:5000/api/worker/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updatedProfile }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(updatedProfile);
        setEditingField(null);
        setEditValue('');
      } else {
        alert(data.message || 'Error updating profile');
      }
    } catch (err) {
      console.error('Save failed', err);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const getFieldIcon = (field) => {
    const icons = {
      name: '👤',
      phone: '📞',
      gender: '⚥',
      location: '📍',
      profession: '💼',
      serviceAreas: '🗺️',
      'address.addressLine1': '🏠',
      'address.addressLine2': '🏘️',
      'address.city': '🌆',
      'address.country': '🌍',
      'address.pincode': '📮'
    };
    return icons[field] || '📝';
  };

  const getFieldLabel = (field) => {
    const labels = {
      name: 'Full Name',
      phone: 'Phone Number',
      gender: 'Gender',
      location: 'Location',
      profession: 'Profession',
      serviceAreas: 'Service Areas',
      'address.addressLine1': 'Address Line 1',
      'address.addressLine2': 'Address Line 2',
      'address.city': 'City',
      'address.country': 'Country',
      'address.pincode': 'Pincode'
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  if (!loaded) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p style={loadingTextStyle}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={avatarLargeStyle}>
            {profile.name?.charAt(0) || 'W'}
          </div>
          <div style={headerTextStyle}>
            <h1 style={titleStyle}>
              {profile.name || 'Worker Profile'}
            </h1>
            <p style={subtitleStyle}>
              {profile.profession && <span style={professionBadgeStyle}>{profile.profession}</span>}
              <span style={subtitleTextStyle}>Manage your professional information</span>
            </p>
          </div>
        </div>
        <button onClick={onBack} style={backButtonHeaderStyle}>
          <span style={{ marginRight: '8px' }}>←</span>
          Back
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={contentGridStyle}>
        {/* Personal Information Card */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={{ marginRight: '12px' }}>👤</span>
              Personal Information
            </h2>
          </div>
          <div style={fieldsContainerStyle}>
            {['name', 'phone', 'gender', 'profession'].map(field => (
              <ProfileField
                key={field}
                field={field}
                value={profile[field]}
                editingField={editingField}
                editValue={editValue}
                onEdit={() => handleEdit(field)}
                onChange={(val) => setEditValue(val)}
                onCancel={handleCancel}
                onSave={() => handleSave(field)}
                saving={saving}
                getFieldIcon={getFieldIcon}
                getFieldLabel={getFieldLabel}
              />
            ))}
          </div>
        </div>

        {/* Address Information Card */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={{ marginRight: '12px' }}>📍</span>
              Address Details
            </h2>
          </div>
          <div style={fieldsContainerStyle}>
            {['addressLine1', 'addressLine2', 'city', 'country', 'pincode'].map(addrField => {
              const field = `address.${addrField}`;
              return (
                <ProfileField
                  key={field}
                  field={field}
                  value={profile.address ? profile.address[addrField] : ''}
                  editingField={editingField}
                  editValue={editValue}
                  onEdit={() => handleEdit(field)}
                  onChange={(val) => setEditValue(val)}
                  onCancel={handleCancel}
                  onSave={() => handleSave(field)}
                  saving={saving}
                  getFieldIcon={getFieldIcon}
                  getFieldLabel={getFieldLabel}
                />
              );
            })}
          </div>
        </div>

        {/* Service Areas Card - Full Width */}
        <div style={{...sectionCardStyle, gridColumn: '1 / -1'}}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={{ marginRight: '12px' }}>🗺️</span>
              Service Coverage
            </h2>
          </div>
          <div style={fieldsContainerStyle}>
            <ProfileField
              field="serviceAreas"
              value={profile.serviceAreas}
              editingField={editingField}
              editValue={editValue}
              onEdit={() => handleEdit('serviceAreas')}
              onChange={(val) => setEditValue(val)}
              onCancel={handleCancel}
              onSave={() => handleSave('serviceAreas')}
              saving={saving}
              getFieldIcon={getFieldIcon}
              getFieldLabel={getFieldLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '32px 24px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  minHeight: '100vh'
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 20px',
  color: '#9ca3af'
};

const loadingTextStyle = {
  fontSize: '18px',
  color: '#a0a0b0',
  marginTop: '20px',
  fontWeight: '500'
};

const spinnerStyle = {
  width: '56px',
  height: '56px',
  border: '5px solid rgba(102, 126, 234, 0.15)',
  borderTop: '5px solid #667eea',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
  borderRadius: '20px',
  padding: '32px 40px',
  marginBottom: '32px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  position: 'relative',
  overflow: 'hidden'
};

const headerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  flex: 1
};

const avatarLargeStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
  fontWeight: '700',
  color: 'white',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.5)',
  flexShrink: 0
};

const headerTextStyle = {
  flex: 1
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #ffffff 0%, #a8b3ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: '0 0 8px 0',
  lineHeight: '1.2'
};

const subtitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
  margin: 0
};

const professionBadgeStyle = {
  background: 'rgba(102, 126, 234, 0.25)',
  color: '#a8b3ff',
  padding: '6px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  border: '1px solid rgba(139, 156, 255, 0.4)'
};

const subtitleTextStyle = {
  fontSize: '15px',
  color: '#9ca3af'
};

const backButtonHeaderStyle = {
  padding: '12px 24px',
  fontSize: '15px',
  fontWeight: '600',
  color: '#e5e7eb',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  backdropFilter: 'blur(10px)'
};

const contentGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '24px'
};

const sectionCardStyle = {
  background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  overflow: 'hidden'
};

const sectionHeaderStyle = {
  padding: '24px 32px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'rgba(255, 255, 255, 0.02)'
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '700',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center'
};

const fieldsContainerStyle = {
  padding: '8px'
};

const profileItemStyle = {
  padding: '20px 24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'background-color 0.2s ease'
};

const fieldWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px'
};

const fieldLeftStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  flex: 1,
  minWidth: 0
};

const iconBoxStyle = {
  fontSize: '24px',
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(139, 156, 255, 0.2)',
  flexShrink: 0
};

const fieldInfoStyle = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '1.2px'
};

const fieldValueStyle = {
  marginTop: '4px'
};

const valueTextStyle = {
  fontSize: '16px',
  color: '#e5e7eb',
  fontWeight: '500',
  lineHeight: '1.5',
  wordBreak: 'break-word'
};

const placeholderStyle = {
  color: '#6b7280',
  fontStyle: 'italic',
  fontSize: '15px'
};

const editButtonStyle = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(102, 126, 234, 0.15)',
  border: '1px solid rgba(139, 156, 255, 0.3)',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  flexShrink: 0
};

const editIconStyle = {
  fontSize: '16px'
};

const editSectionStyle = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const editInputStyle = {
  width: '100%',
  padding: '14px 18px',
  fontSize: '16px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: '2px solid #667eea',
  borderRadius: '12px',
  outline: 'none',
  color: '#e5e7eb',
  transition: 'all 0.3s ease',
  fontWeight: '500'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end'
};

const saveButtonStyle = {
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: '600',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  display: 'flex',
  alignItems: 'center'
};

const cancelButtonStyle = {
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: '600',
  background: 'rgba(255, 255, 255, 0.05)',
  color: '#e5e7eb',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center'
};

const serviceAreasDisplayStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px'
};

const serviceAreaTagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 16px',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)',
  color: '#a8b3ff',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  border: '1px solid rgba(139, 156, 255, 0.35)',
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
};

const checkboxContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: '12px',
  padding: '20px',
  background: 'rgba(0, 0, 0, 0.25)',
  borderRadius: '12px',
  border: '2px solid rgba(102, 126, 234, 0.3)',
  maxHeight: '280px',
  overflowY: 'auto'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  padding: '10px 14px',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
  fontSize: '15px',
  fontWeight: '500',
  color: '#e5e7eb',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const checkboxStyle = {
  width: '20px',
  height: '20px',
  cursor: 'pointer',
  accentColor: '#667eea'
};

const checkboxTextStyle = {
  color: '#e5e7eb',
  userSelect: 'none'
};