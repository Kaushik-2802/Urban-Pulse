import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintBox from './ComplaintBox';
import WorkerProfileForm from './WorkerProfileForm';
import CreateWorkerProfile from '../components/CreateWorkerProfile'
import StartWorkModal from '../components/StartWorkModal';
import CompleteWorkModal from '../components/CompleteWorkModal';

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [worker, setWorker] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [forceProfile, setForceProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);


  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

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

  const isProfileComplete = (worker) => {
  if (!worker) return false;

  return (
    worker.name &&
    worker.phone &&
    worker.gender &&
    worker.profession &&
    worker.address &&
    worker.address.addressLine1 &&
    worker.address.city &&
    worker.address.country
  );
};


  const fetchWorkerDetails = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/worker/profile/${userId}`);

    if (res.status === 404) {
      // 🚨 First time user → force profile
      setForceProfile(true);
      setWorker(null);
      setLoadingProfile(false);
      return;
    }

    const data = await res.json();

    if (res.ok) {
      setWorker(data);
      localStorage.setItem('workerId', data.userId);

      // 🔥 Profile exists but incomplete
      if (!isProfileComplete(data)) {
        setForceProfile(true);
      } else {
        setForceProfile(false);
      }
    }
  } catch (err) {
    console.error('Failed to fetch worker profile:', err);
  } finally {
    setLoadingProfile(false);
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

  const openGoogleMaps = (destination) => {
    if (!destination) {
      alert('Customer address not available for navigation.');
      return;
    }

    const originAddress = worker?.address
      ? `${worker.address.addressLine1 || ''}, ${worker.address.city || ''}, ${worker.address.country || ''}`
        .replace(/\s+/g, ' ')
        .trim()
      : '';

    if (!originAddress) {
      alert('Worker address is missing. Please update your profile.');
      return;
    }

    const destinationAddress = `${destination.addressLine1 || ''}, ${destination.city || ''}, ${destination.country || ''}`
      .replace(/\s+/g, ' ')
      .trim();

    if (!destinationAddress) {
      alert('Customer address is incomplete.');
      return;
    }

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originAddress)}&destination=${encodeURIComponent(destinationAddress)}`;

    window.open(mapsUrl, '_blank');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      navigate('/');
    }
  };

 if (loadingProfile) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading profile...
    </div>
  );
}

if (forceProfile) {
  return (
    <CreateWorkerProfile
      userId={userId}
      onSuccess={() => {
        setForceProfile(false);
        fetchWorkerDetails();
      }}
    />
  );
}

if(showProfile){
  return(
    <WorkerProfileForm
       userId={userId}
       onBack={() => setShowProfile(false)}
       onSuccess={() => {
        setShowProfile(false);
        fetchWorkerDetails();
       }}
    />
  )
}





  return (
    <div style={containerStyle}>

      {showStartModal && (
  <StartWorkModal
    booking={activeBooking}
    onClose={() => setShowStartModal(false)}
    onStarted={() => {
      setShowStartModal(false);
      fetchBookings(worker.userId);
    }}
  />
)}

{showCompleteModal && (
  <CompleteWorkModal
    booking={activeBooking}
    onClose={() => setShowCompleteModal(false)}
    onCompleted={() => {
      setShowCompleteModal(false);
      fetchBookings(worker.userId);
    }}
  />
)}



      {/* Header */}
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <div style={avatarStyle}>
            {worker?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <h1 style={headerTitleStyle}>Worker Dashboard</h1>
            <p style={headerSubtitleStyle}>
              {worker?.name || 'Loading...'} 
              {worker?.profession && <span style={professionBadgeStyle}>{worker.profession}</span>}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowProfile(true)} style={profileButtonStyle}>
            <span style={{ marginRight: '8px' }}>👤</span>
            Profile
          </button>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <span style={{ marginRight: '8px' }}>🚪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={mainGridStyle}>
        {/* Bookings Section */}
        <div style={bookingsSectionStyle}>
          <div style={bookingsHeaderStyle}>
            <div>
              <h2 style={bookingsTitleStyle}>Active Bookings</h2>
              <p style={bookingsSubtitleStyle}>Manage your current service appointments</p>
            </div>
            <div style={bookingsCountBadgeStyle}>
              {bookings.length}
            </div>
          </div>

          {bookings.length > 0 ? (
            <div style={bookingsContainerStyle}>
              {bookings.map((booking, idx) => (
                <div key={idx} style={bookingCardStyle}>
                  <div style={cardGlowStyle}></div>
                  
                  <div style={bookingHeaderRowStyle}>
                    <h3 style={serviceNameStyle}>{booking.service}</h3>
                    <span style={statusBadgeStyle}>
                      <span style={{ marginRight: '6px' }}>●</span>
                      Active
                    </span>
                  </div>

                  <div style={bookingDetailsStyle}>
                    <div style={detailItemStyle}>
                      <div style={iconContainerStyle}>📅</div>
                      <div style={detailTextStyle}>
                        <span style={labelStyle}>Date</span>
                        <span style={valueStyle}>{booking.date}</span>
                      </div>
                    </div>

                    <div style={detailItemStyle}>
                      <div style={iconContainerStyle}>⏰</div>
                      <div style={detailTextStyle}>
                        <span style={labelStyle}>Time</span>
                        <span style={valueStyle}>{booking.time}</span>
                      </div>
                    </div>

                    <div style={{ ...detailItemStyle, gridColumn: '1 / -1' }}>
                      <div style={iconContainerStyle}>📍</div>
                      <div style={detailTextStyle}>
                        <span style={labelStyle}>Location</span>
                        <span style={valueStyle}>
                          {booking.customerAddress
                            ? `${booking.customerAddress.addressLine1 || ''}, ${booking.customerAddress.city || ''}, ${booking.customerAddress.country || ''}`
                            : 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={bookingActionsStyle}>
                  {booking.status === "ACTIVE" && (
                    <button
                      style={primaryButtonStyle}
                      onClick={() => {
                        setActiveBooking(booking);
                        setShowStartModal(true);
                      }}
                    >
                      ▶️ Start Work
                    </button>
                  )}

                  {booking.status === "STARTED" && (
                    <button
                      style={navigationButtonStyle}
                      onClick={() => {
                        setActiveBooking(booking);
                        setShowCompleteModal(true);
                      }}
                    >
                      👉 Slide to Complete
                    </button>
                  )}

                  {booking.status === "COMPLETED" && (
                    <span style={{ color: "#10b981", fontWeight: "700" }}>
                      ✅ Completed
                    </span>
                  )}
                </div>

                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>📋</div>
              <h3 style={emptyTitleStyle}>No Active Bookings</h3>
              <p style={emptyDescriptionStyle}>
                You don't have any active bookings at the moment. New bookings will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={sidebarStyle}>
          {/* Payments */}
          <div style={sidebarCardStyle}>
            <div style={sidebarHeaderStyle}>
              <h2 style={sidebarTitleStyle}>
                <span style={{ marginRight: '10px' }}>💰</span>
                Payment History
              </h2>
            </div>
            {payments.length > 0 ? (
              <div style={paymentsListStyle}>
                {payments.map((payment, idx) => (
                  <div key={idx} style={paymentItemStyle}>
                    <div style={paymentIconStyle}>₹</div>
                    <div style={{ flex: 1 }}>
                      <div style={paymentAmountStyle}>₹{payment.amount}</div>
                      <div style={paymentServiceStyle}>{payment.service}</div>
                    </div>
                    <div style={paymentDotStyle}></div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={noDataTextStyle}>No payment history available</p>
            )}
          </div>

          {/* Complaints */}
          <div style={sidebarCardStyle}>
            <div style={sidebarHeaderStyle}>
              <h2 style={sidebarTitleStyle}>
                <span style={{ marginRight: '10px' }}>📨</span>
                Complaint Box
              </h2>
            </div>
            <div style={complaintPlaceholderStyle}>
              ComplaintBox component placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #0a0a0f 0%, #1a1a2e 100%)',
  padding: '24px',
  margin: '0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
  color: '#fff',
  padding: '24px 32px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)'
};

const headerLeftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0px'
};

const avatarStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  fontWeight: '700',
  color: 'white',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
};

const headerTitleStyle = {
  margin: '0 0 4px 0',
  fontSize: '28px',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #ffffff 0%, #a8b3ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const headerSubtitleStyle = {
  margin: 0,
  fontSize: '15px',
  color: '#a0a0b0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const professionBadgeStyle = {
  background: 'rgba(102, 126, 234, 0.2)',
  color: '#8b9cff',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: '600',
  border: '1px solid rgba(139, 156, 255, 0.3)'
};

const profileButtonStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '12px 24px',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)'
};

const logoutButtonStyle = {
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
};

const mainGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: '24px',
  marginTop: '24px'
};

const bookingsSectionStyle = {
  background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
};

const bookingsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '28px 32px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.02)'
};

const bookingsTitleStyle = {
  margin: '0 0 4px 0',
  fontSize: '26px',
  fontWeight: '700',
  color: '#ffffff'
};

const bookingsSubtitleStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#6b7280'
};

const bookingsCountBadgeStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: '700',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
};

const bookingsContainerStyle = {
  padding: '24px 32px 32px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const bookingCardStyle = {
  position: 'relative',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '28px',
  background: 'linear-gradient(135deg, #252535 0%, #2d2d42 100%)',
  transition: 'all 0.3s ease',
  overflow: 'hidden'
};

const cardGlowStyle = {
  position: 'absolute',
  top: '-50%',
  left: '-50%',
  width: '200%',
  height: '200%',
  background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  pointerEvents: 'none'
};

const bookingHeaderRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '24px'
};

const serviceNameStyle = {
  margin: 0,
  fontSize: '22px',
  fontWeight: '700',
  color: '#ffffff',
  lineHeight: '1.4',
  maxWidth: '65%'
};

const statusBadgeStyle = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  display: 'flex',
  alignItems: 'center'
};

const bookingDetailsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '28px',
  background: 'rgba(0, 0, 0, 0.2)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const detailItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px'
};

const iconContainerStyle = {
  fontSize: '22px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
  borderRadius: '10px',
  border: '1px solid rgba(139, 156, 255, 0.3)',
  flexShrink: 0
};

const detailTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1
};

const labelStyle = {
  fontSize: '11px',
  color: '#6b7280',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const valueStyle = {
  fontSize: '16px',
  color: '#e5e7eb',
  fontWeight: '600',
  lineHeight: '1.4'
};

const bookingActionsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  flexWrap: 'wrap'
};

const secondaryButtonStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#e5e7eb',
  padding: '12px 20px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center'
};

const primaryButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  display: 'flex',
  alignItems: 'center'
};

const navigationButtonStyle = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  border: 'none',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  display: 'flex',
  alignItems: 'center'
};

const emptyStateStyle = {
  padding: '80px 32px',
  textAlign: 'center'
};

const emptyIconStyle = {
  fontSize: '72px',
  marginBottom: '24px',
  opacity: '0.3',
  filter: 'grayscale(100%)'
};

const emptyTitleStyle = {
  margin: '0 0 12px 0',
  fontSize: '24px',
  fontWeight: '700',
  color: '#e5e7eb'
};

const emptyDescriptionStyle = {
  margin: 0,
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#6b7280',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const sidebarCardStyle = {
  background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
};

const sidebarHeaderStyle = {
  padding: '24px 24px 20px 24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.02)'
};

const sidebarTitleStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '700',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center'
};

const paymentsListStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  maxHeight: '400px',
  overflowY: 'auto'
};

const paymentItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  background: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s ease'
};

const paymentIconStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: '700',
  color: 'white',
  flexShrink: 0
};

const paymentAmountStyle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#10b981',
  marginBottom: '2px'
};

const paymentServiceStyle = {
  fontSize: '14px',
  color: '#6b7280'
};

const paymentDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#10b981',
  flexShrink: 0
};

const noDataTextStyle = {
  padding: '40px 24px',
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '15px'
};

const complaintPlaceholderStyle = {
  padding: '40px 24px',
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '15px'
}