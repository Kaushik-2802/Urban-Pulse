import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintBox from './ComplaintBox';
import WorkerProfileForm from './WorkerProfileForm';

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [worker, setWorker] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
  if (!showProfile) {
    fetchWorkerDetails();
    fetchPayments();
  }
}, [userId, showProfile]);

useEffect(() => {
  if (worker && worker.userId) {
    fetchBookings(worker.userId);
  }
}, [worker]);
  const fetchWorkerDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/worker/profile/${userId}`);
      const data = await res.json();
      if (res.ok){ 
        setWorker(data);
        localStorage.setItem('workerId',data.userId)     
      }
    } catch (err) {
      console.error('Failed to fetch worker profile:', err);
    }
  };

  const fetchBookings = async (workerId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/bookings/worker/${workerId}`);
    const data = await response.json();

    if (response.ok) {
      console.log("Fetched bookings:", data);
      setBookings(data);
    } else {
      console.error('Error fetching bookings:', data.message || data);
    }
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
  }
};



  const fetchPayments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/worker/${userId}/payments`);
      const data = await res.json();
      if (res.ok) setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      navigate('/');
    }
  };

  if (showProfile) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px' }}>
        <WorkerProfileForm userId={userId} onBack={() => setShowProfile(false)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#4f46e5', color: '#fff', padding: '20px', borderRadius: '12px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Worker Dashboard</h1>
          <p style={{ margin: 0 }}>{worker?.name || 'Loading...'} - {worker?.profession || ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowProfile(true)} style={buttonStyle}>Profile</button>
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Bookings */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
  <h2>Current Bookings</h2>
  {bookings.length > 0 ? (
    <ul>
      {bookings.map((booking, idx) => (
        <li key={idx} style={{ marginBottom: '12px' }}>
          <strong>{booking.service}</strong> <br />
          📅 {booking.date} <br />
          ⏰ {booking.time}
        </li>
      ))}
    </ul>
  ) : (
    <p>No current bookings.</p>
  )}
</div>

        {/* Payments & Complaints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Payments */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2>Past Payments</h2>
            {payments.length > 0 ? (
              <ul>
                {payments.map((payment, idx) => (
                  <li key={idx}>
                    ₹{payment.amount} - {payment.service}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No past payments.</p>
            )}
          </div>

          {/* Complaints */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2>Complaint Box</h2>
            <ComplaintBox />
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.4)',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)'
};
