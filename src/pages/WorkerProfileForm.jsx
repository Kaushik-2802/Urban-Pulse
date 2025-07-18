import { useState, useEffect } from 'react';

export default function WorkerProfileForm({ userId, onBack }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    gender: '',
    location: '',
    profession: ''
  });

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // To track loading of initial data

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:5000/api/worker/profile/${userId}`);
        if (!res.ok) throw new Error('No existing profile');
        const data = await res.json();

        // Set existing profile values if found
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          gender: data.gender || '',
          location: data.location || '',
          profession: data.profession || ''
        });
      } catch (err) {
        console.log('Profile not found or error occurred (expected for new users).');
        // New profile; keep form empty
      } finally {
        setLoaded(true); // Show form once attempt is done
      }
    }

    if (userId) fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/worker/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...form })
      });
      const data = await res.json();
      alert(data.message || 'Profile updated');
    } catch (err) {
      console.error('Save failed', err);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={containerStyle}>
      <h2>Worker Profile</h2>
      {['name', 'phone', 'gender', 'location', 'profession'].map((field) => (
        <div key={field} style={inputGroup}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            style={inputStyle}
            placeholder={`Enter ${field}`}
          />
        </div>
      ))}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handleSave} style={buttonStyle} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onBack} style={{ ...buttonStyle, backgroundColor: '#ccc', color: '#000' }}>
          Back
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  marginTop: '24px'
};

const inputGroup = {
  marginBottom: '12px'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '10px 16px',
  backgroundColor: '#4f46e5',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};
