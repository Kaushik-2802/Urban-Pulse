import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup() {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    gender: '',
    location: '',
    coordinates: { lat: 0, lng: 0 } // Placeholder for map
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: profile.name,
          phone: profile.phone,
          gender: profile.gender,
          location: profile.location,
          coordinates: profile.coordinates
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Profile saved successfully');
        // ✅ Mark profile completed in localStorage
        localStorage.setItem('profileCompleted', 'true');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={profile.phone}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={profile.location}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <button type="submit" className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
          Save Profile
        </button>
      </form>
    </div>
  );
}
