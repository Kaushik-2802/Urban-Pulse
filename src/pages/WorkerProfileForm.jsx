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
        <div style={itemHeaderStyle}>
          <div style={labelContainerStyle}>
            <span style={iconStyle}>{getFieldIcon(field)}</span>
            <label style={labelStyle}>{getFieldLabel(field)}</label>
          </div>
          {!isEditing && (
            <button onClick={onEdit} style={editButtonStyle} disabled={saving}>
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div style={editContainerStyle}>
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

            <div style={editButtonsStyle}>
              <button onClick={onSave} style={saveButtonStyle} disabled={saving}>
                {saving ? '...' : '✓'}
              </button>
              <button onClick={onCancel} style={cancelButtonStyle} disabled={saving}>
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div style={valueContainerStyle}>
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
    );
  }

  // For other fields, render simple text input
  return (
    <div style={profileItemStyle}>
      <div style={itemHeaderStyle}>
        <div style={labelContainerStyle}>
          <span style={iconStyle}>{getFieldIcon(field)}</span>
          <label style={labelStyle}>{getFieldLabel(field)}</label>
        </div>
        {!isEditing && (
          <button onClick={onEdit} style={editButtonStyle} disabled={saving}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div style={editContainerStyle}>
          <input
            type="text"
            value={editValue || ''}
            onChange={e => onChange(e.target.value)}
            style={editInputStyle}
            placeholder={`Enter ${getFieldLabel(field)}`}
            autoFocus
          />
          <div style={editButtonsStyle}>
            <button onClick={onSave} style={saveButtonStyle} disabled={saving}>
              {saving ? '...' : '✓'}
            </button>
            <button onClick={onCancel} style={cancelButtonStyle} disabled={saving}>
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div style={valueContainerStyle}>
          <span style={valueStyle}>{value || <span style={placeholderStyle}>Not provided</span>}</span>
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

  const handleServiceAreaChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setEditValue(selectedOptions);
  };

  const handleSave = async (field) => {
  setSaving(true);
  try {
    let updatedProfile = { ...profile };

    if (field.startsWith('address.')) {
      const addrField = field.split('.')[1]; // e.g., 'addressLine1'
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
      'address.addressLine2': '🏠',
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
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
  <div style={containerStyle}>
    <div style={headerStyle}>
      <h2 style={titleStyle}>Worker Profile</h2>
      <p style={subtitleStyle}>Manage your professional information</p>
    </div>

    <div style={profileCardStyle}>
      {/* Render flat fields */}
      {['name', 'phone', 'gender', 'profession', 'serviceAreas'].map(field => (
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

      {/* Render nested address fields separately */}
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

    <div style={footerStyle}>
      <button onClick={onBack} style={backButtonStyle}>
        ← Back
      </button>
    </div>
  </div>
);
}

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '24px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  color: '#6b7280'
};

const spinnerStyle = {
  width: '32px',
  height: '32px',
  border: '3px solid #e5e7eb',
  borderTop: '3px solid #4f46e5',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '16px'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '32px'
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 8px 0'
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#6b7280',
  margin: '0'
};

const profileCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e5e7eb',
  marginBottom: '24px'
};

const profileItemStyle = {
  paddingBottom: '20px',
  marginBottom: '20px',
  borderBottom: '1px solid #f3f4f6'
};

const itemHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};

const labelContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const iconStyle = {
  fontSize: '18px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const editButtonStyle = {
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: '500',
  color: '#4f46e5',
  backgroundColor: 'transparent',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db'
  }
};

const valueContainerStyle = {
  paddingLeft: '26px'
};

const valueStyle = {
  fontSize: '16px',
  color: '#1f2937',
  lineHeight: '1.5'
};

const placeholderStyle = {
  color: '#9ca3af',
  fontStyle: 'italic'
};

const editContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  paddingLeft: '26px'
};

const editInputStyle = {
  flex: '1',
  padding: '8px 12px',
  fontSize: '16px',
  border: '2px solid #4f46e5',
  borderRadius: '6px',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const editButtonsStyle = {
  display: 'flex',
  gap: '4px'
};

const saveButtonStyle = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background-color 0.2s'
};

const cancelButtonStyle = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  transition: 'background-color 0.2s'
};

const footerStyle = {
  textAlign: 'center'
};

const backButtonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: '500',
  color: '#6b7280',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const selectStyle = {
  flex: '1',
  padding: '8px 12px',
  fontSize: '16px',
  border: '2px solid #4f46e5',
  borderRadius: '6px',
  outline: 'none',
  transition: 'border-color 0.2s',
  minHeight: '80px',
  backgroundColor: 'white'
};

const serviceAreasDisplayStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px'
};

const serviceAreaTagStyle = {
  display: 'inline-block',
  padding: '4px 8px',
  backgroundColor: '#e0e7ff',
  color: '#3730a3',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '500'
};

const serviceAreasEditStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingLeft: '26px',
  width: '100%'
};

const checkboxContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '8px',
  padding: '12px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '2px solid #4f46e5',
  maxHeight: '200px',
  overflowY: 'auto'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
  fontSize: '14px',
  fontWeight: '500'
};

const checkboxStyle = {
  width: '16px',
  height: '16px',
  cursor: 'pointer'
};

const checkboxTextStyle = {
  color: '#374151',
  userSelect: 'none'
};