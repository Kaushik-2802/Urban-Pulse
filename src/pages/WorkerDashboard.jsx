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
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#4f46e5', 
        color: '#fff', 
        padding: '20px', 
        borderRadius: '12px' 
      }}>
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
        {/* Improved Bookings Section */}
        <div style={bookingsSectionStyle}>
          <div style={bookingsHeaderStyle}>
            <h2 style={bookingsTitleStyle}>Current Bookings</h2>
            <span style={bookingsCountStyle}>{bookings.length} active</span>
          </div>
          
          {bookings.length > 0 ? (
            <div style={bookingsContainerStyle}>
              {bookings.map((booking, idx) => (
                <div key={idx} style={bookingCardStyle}>
                  <div style={bookingHeaderRowStyle}>
                    <h3 style={serviceNameStyle}>{booking.service}</h3>
                    <span style={statusBadgeStyle}>Active</span>
                  </div>
                  
                  <div style={bookingDetailsStyle}>
                    <div style={detailItemStyle}>
                      <span style={iconStyle}>📅</span>
                      <div style={detailTextStyle}>
                        <span style={labelStyle}>Date</span>
                        <span style={valueStyle}>{booking.date}</span>
                      </div>
                    </div>
                    
                    <div style={detailItemStyle}>
                      <span style={iconStyle}>⏰</span>
                      <div style={detailTextStyle}>
                        <span style={labelStyle}>Time</span>
                        <span style={valueStyle}>{booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <div style={detailItemStyle}>
                      <span style={iconStyle}>📍</span>
                      <div style={detailTextStyle}>
                        <span style={labelStyle}>Location</span>
                        <span style={valueStyle}>
                          {booking.customerAddress 
                            ? `${booking.customerAddress.addressLine1 || ''}, ${booking.customerAddress.city || ''}, ${booking.customerAddress.country || ''}`
                            : 'Not provided'}
                        </span>
                      </div>
                  </div>
                  
                  <div style={bookingActionsStyle}>
                    <button style={actionButtonStyle}>View Details</button>
                    <button style={primaryActionButtonStyle}>Mark Complete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>📋</div>
              <h3 style={emptyTitleStyle}>No Current Bookings</h3>
              <p style={emptyDescriptionStyle}>You don't have any active bookings at the moment. New bookings will appear here.</p>
            </div>
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
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              ComplaintBox component placeholder
            </div>
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

// New styles for improved bookings section
const bookingsSectionStyle = {
  background: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)'
};

const bookingsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px 24px 16px 24px',
  borderBottom: '2px solid #f3f4f6'
};

const bookingsTitleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '700',
  color: '#111827'
};

const bookingsCountStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '6px 14px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const bookingsContainerStyle = {
  padding: '20px 24px 24px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const bookingCardStyle = {
  border: '2px solid #f3f4f6',
  borderRadius: '12px',
  padding: '24px',
  background: '#fafbfc',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden'
};

const bookingHeaderRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '20px'
};

const serviceNameStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '700',
  color: '#374151',
  lineHeight: '1.4',
  maxWidth: '70%'
};

const statusBadgeStyle = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
};

const bookingDetailsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '24px',
  background: '#ffffff',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb'
};

const detailItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const iconStyle = {
  fontSize: '24px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f3f4f6',
  borderRadius: '8px'
};

const detailTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const labelStyle = {
  fontSize: '12px',
  color: '#6b7280',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.8px'
};

const valueStyle = {
  fontSize: '16px',
  color: '#111827',
  fontWeight: '700'
};

const bookingActionsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end'
};

const actionButtonStyle = {
  background: 'transparent',
  border: '2px solid #d1d5db',
  color: '#6b7280',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const primaryActionButtonStyle = {
  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  border: 'none',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)'
};

const emptyStateStyle = {
  padding: '80px 24px',
  textAlign: 'center',
  color: '#6b7280'
};

const emptyIconStyle = {
  fontSize: '64px',
  marginBottom: '20px',
  opacity: '0.5'
};

const emptyTitleStyle = {
  margin: '0 0 12px 0',
  fontSize: '24px',
  fontWeight: '700',
  color: '#374151'
};

const emptyDescriptionStyle = {
  margin: 0,
  fontSize: '16px',
  lineHeight: '1.6',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto'
};
