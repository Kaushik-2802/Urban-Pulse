import ServiceCard from './ServiceCard';
import Payments from './Payments';
import ComplaintBox from './ComplaintBox';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const services = [
    { name: 'Electrician'},
    { name: 'Plumber' },
    { name: 'Carpenter' },
    { name: 'Painter' },
    { name: 'Gardener' },
    { name: 'AC Repair' },
    { name: 'House Cleaning' },
    { name: 'Pest Control' },
    { name: 'Home Appliances Repair' },
    { name: 'Mason' },
    { name: 'Glass Repair' },
    { name: 'Locksmith' },
    { name: 'Interior Designer' },
    { name: 'CCTV Installation' },
    { name: 'Water Tank Cleaning' },
    {name: 'House Help'}
];
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const[selectedService,setSelectedService]=useState(null);
  const [showServiceCategories, setShowServiceCategories] = useState(false);
  const [workers,setWorkers]=useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [hours, setHours] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const navigate = useNavigate();

  const payments = [
    { service: 'Plumber', amount: 200, dueDate: '2025-07-15' },
    { service: 'Electrician', amount: 250, dueDate: '2025-07-10' }
  ];

  const handleBookService = (service) => {
    alert(`You booked ${service.name} service for ₹${service.cost}`);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userId');
      // window.location.href = '/';
      navigate("/",{ replace: true});
    }
  };

  useEffect(() => {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
}, []);
  
  const fetchWorkersByProfession=async(profession)=>{
    try{
      const res=await fetch(`http://localhost:5000/api/worker/${profession.toLowerCase()}`);
      const data=await res.json();
      setWorkers(data);
    }catch(err){
      console.error("Error fetching workers:", err);
    setWorkers([]);
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          // console.error('No user ID found in localStorage');
          navigate('/');
          return;
        }

        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUserProfile(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }

    fetchProfile();
  }, []);

  // 👇 FETCH WORKERS WHEN SERVICE IS SELECTED
useEffect(() => {
  if (selectedService) {
    fetchWorkersByProfession(selectedService);
  }
}, [selectedService]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '0',
      margin: '0',
      width: '100%'
    },
    wrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 24px'
    },
    header: {
      width: '100%',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '32px 0',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '40px'
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      zIndex: 1
    },
    headerContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    headerLeft: {
      flex: 1
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    profileButton: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 20px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
      textDecoration: 'none'
    },
    logoutButton: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '10px 20px',
      color: '#fca5a5',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      textDecoration: 'none'
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px'
    },
    titleIcon: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
    },
    title: {
      fontSize: '42px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
      letterSpacing: '-1px'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '16px',
      fontWeight: '400',
      margin: 0,
      lineHeight: '1.6'
    },
    decorativeElement: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      zIndex: 1
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px'
    },
    servicesSection: {
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      padding: '32px'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '28px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    servicesCount: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      background: 'rgba(59, 130, 246, 0.1)',
      padding: '6px 16px',
      borderRadius: '20px',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    sidebarCard: {
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      padding: '32px'
    },
    paymentHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
      color: '#fca5a5',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    complaintTitle: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '20px'
    },
    statsGrid: {
      marginTop: '32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    statCard: {
      borderRadius: '20px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    statCardBlue: {
      background: 'rgba(59, 130, 246, 0.1)',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)'
    },
    statCardYellow: {
      background: 'rgba(234, 179, 8, 0.1)',
      boxShadow: '0 8px 25px rgba(234, 179, 8, 0.2)'
    },
    statCardGreen: {
      background: 'rgba(16, 185, 129, 0.1)',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px'
    },
    statIconBlue: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
    },
    statIconYellow: {
      background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      boxShadow: '0 6px 20px rgba(234, 179, 8, 0.4)'
    },
    statIconGreen: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
    },
    statText: {
      fontSize: '14px',
      fontWeight: '500',
      margin: '0 0 6px 0'
    },
    statTextBlue: {
      color: '#93c5fd'
    },
    statTextYellow: {
      color: '#fde047'
    },
    statTextGreen: {
      color: '#6ee7b7'
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: '800',
      margin: '0'
    },
    statNumberBlue: {
      color: '#60a5fa'
    },
    statNumberYellow: {
      color: '#facc15'
    },
    statNumberGreen: {
      color: '#34d399'
    }
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.6)';
    } else {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
    }
  };

  const handleLogoutHover = (e, isHover) => {
    if (isHover) {
      e.target.style.background = 'rgba(239, 68, 68, 0.3)';
      e.target.style.transform = 'translateY(-2px)';
    } else {
      e.target.style.background = 'rgba(239, 68, 68, 0.2)';
      e.target.style.transform = 'translateY(0)';
    }
  };

return (
  <>
    {/* Booking Modal */}
    {showBookingModal && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '32px',
            borderRadius: '24px',
            width: '400px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h3 style={{ 
            marginBottom: '24px', 
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Book {selectedWorker?.name}
          </h3>

          <label style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontWeight: '600', 
            fontSize: '14px',
            display: 'block',
            marginBottom: '8px'
          }}>Date:</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            style={{ 
              width: '100%', 
              marginBottom: '20px', 
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          <label style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontWeight: '600', 
            fontSize: '14px',
            display: 'block',
            marginBottom: '8px'
          }}>Time Slot:</label>
          <select
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            style={{ 
              width: '100%', 
              marginBottom: '20px', 
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select Time</option>
            <option>09:00 AM - 10:00 AM</option>
            <option>10:00 AM - 11:00 AM</option>
            <option>01:00 PM - 02:00 PM</option>
            <option>03:00 PM - 04:00 PM</option>
          </select>

          <label style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontWeight: '600', 
            fontSize: '14px',
            display: 'block',
            marginBottom: '8px'
          }}>Hours:</label>
          <input
            type="number"
            min="1"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={{ 
              width: '100%', 
              marginBottom: '20px', 
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          <button
            onClick={async () => {
              if (!selectedWorker?.profession || !hours) return;

              try {
                const res = await fetch('http://localhost:5000/api/calculate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    service: selectedWorker.profession,
                    hours,
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setEstimatedCost(data.estimatedCost);
                } else {
                  alert(data.error || 'Failed to calculate cost.');
                }
              } catch (err) {
                console.error('Error fetching cost:', err);
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '12px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
            }}
          >
            Get Estimated Cost
          </button>

          {estimatedCost !== null && (
            <p
              style={{
                marginBottom: '20px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '600',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              Estimated Cost: ₹{estimatedCost} <br />
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '400' }}>
                * Materials must be provided by the user.
              </span>
            </p>
          )}

          <button
            onClick={async () => {
              if (!bookingDate || !bookingTime) {
                alert('Please select date and time');
                return;
              }

              const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: localStorage.getItem('userId'),
                  workerId: selectedWorker._id,
                  service: selectedWorker.profession,
                  date: bookingDate,
                  time: bookingTime,
                }),
              });

              const data = await res.json();
              if (res.ok) {
                alert('Booking confirmed!');
                setShowBookingModal(false);
              } else {
                alert(data.message || 'Booking failed.');
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
            }}
          >
            Confirm Booking
          </button>

          <button
            onClick={() => setShowBookingModal(false)}
            style={{
              marginTop: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              padding: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              width: '100%',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Main Dashboard Container */}
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.decorativeElement}></div>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.titleContainer}>
              <div style={styles.titleIcon}>
                <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </div>
              <h1 style={styles.title}>Dashboard</h1>
            </div>
            <p style={styles.subtitle}>
              Welcome back! Manage your services, payments, and support requests all
              in one place
            </p>
          </div>

          <div style={styles.headerRight}>
            <button
              onClick={() => navigate('/profile')}
              style={styles.profileButton}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Profile
            </button>

            <button
              style={styles.logoutButton}
              onClick={handleLogout}
              onMouseEnter={(e) => handleLogoutHover(e, true)}
              onMouseLeave={(e) => handleLogoutHover(e, false)}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.wrapper}>
        <div
          style={{
            ...styles.mainGrid,
            ...(window.innerWidth >= 1024 ? { gridTemplateColumns: '2fr 1fr' } : {}),
          }}
        >
          {/* Services Section */}
          <div style={styles.servicesSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Available Services</h2>
              <span style={styles.servicesCount}>{services.length} services available</span>
            </div>

            <div style={styles.servicesGrid}>
              {/* Show initial Services button */}
              {!showServiceCategories && !selectedService && (
  <>
    {/* Services box */}
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onClick={() => setShowServiceCategories(true)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        borderRadius: '16px',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
      }}>🔧</div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
        Services
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
        Click to view all available service categories
      </p>
    </div>

    {/* Event Management box */}
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onClick={() => navigate("/events")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#8b5cf6';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        borderRadius: '16px',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
      }}>🎉</div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
        Event Management
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Plan and manage your events</p>
    </div>

    {/* Nearby Schools box */}
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onClick={() => navigate("/nearby-schools")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#10b981';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '16px',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
      }}>🏫</div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
        Nearby Schools
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Find schools around you</p>
    </div>

    {/* Nearby Hospitals box */}
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onClick={()=> navigate('/nearby-hospitals')}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#ef4444';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        borderRadius: '16px',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
      }}>🏥</div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
        Nearby Hospitals
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Find hospitals near you</p>
    </div>

    {/* Traffic Situation box */}
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onClick={() => navigate('/nearby-traffic')}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#f59e0b';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(245, 158, 11, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: '16px',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)'
      }}>🚦</div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
        Traffic Situation
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Check current traffic updates</p>
    </div>

    {/* Report Issues box */}
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '28px',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onClick={() => alert('Report Your Issues clicked!')}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#06b6d4';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(6, 182, 212, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        borderRadius: '16px',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)'
      }}>📝</div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
        Report Your Issues
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>Real time issue reporting</p>
    </div>
  </>
)}

              {/* Show service categories */}
              {showServiceCategories && !selectedService &&
                services.map((service, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedService(service.name);
                      fetchWorkersByProfession(service.name);
                    }}
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '28px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      borderRadius: '16px',
                      margin: '0 auto 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                    }}>⚙️</div>
                    <h3
                      style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'white' }}
                    >
                      {service.name}
                    </h3>
                  </div>
                ))}

              {/* Show workers list when a service is selected */}
              {selectedService && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <h2 style={styles.sectionTitle}>Workers offering {selectedService}</h2>
                  <div style={styles.servicesGrid}>
                    {workers.length > 0 ? (
                      workers.map((worker, idx) => (
                        <div
                          key={idx}
                          style={{
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '28px',
                            background: 'rgba(30, 41, 59, 0.5)',
                            backdropFilter: 'blur(10px)',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                          }}
                        >
                          <div style={{
                            width: '70px',
                            height: '70px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            borderRadius: '50%',
                            margin: '0 auto 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                          }}>👷</div>
                          <h3
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              marginBottom: '8px',
                              color: 'white'
                            }}
                          >
                            {worker.name}
                          </h3>
                          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>{worker.location}</p>
                          <button
                            onClick={() => {
                              setSelectedWorker(worker);
                              setShowBookingModal(true);
                            }}
                            style={{
                              padding: '12px 24px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                              color: 'white',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '14px',
                              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                            }}
                          >
                            Book Now
                          </button>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '20px' }}>No workers available for {selectedService}</p>
                    )}
                  </div>

                  {/* Back button to go back to service categories */}
                  <button
                    onClick={() => {
                      setSelectedService(null);
                    }}
                    style={{
                      marginTop: '32px',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: 'rgba(100, 116, 139, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(100, 116, 139, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(100, 116, 139, 0.3)';
                    }}
                  >
                    ← Back to Services
                  </button>
                </div>
              )}
            </div>

            {/* Back to Services Overview button */}
            {showServiceCategories && (
              <button
                onClick={() => {
                  setShowServiceCategories(false);
                  setSelectedService(null);
                }}
                style={{
                  marginTop: '32px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'rgba(100, 116, 139, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(100, 116, 139, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(100, 116, 139, 0.3)';
                }}
              >
                ← Back to Services Overview
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <div style={styles.paymentHeader}>
                <h2 style={styles.sectionTitle}>Payments</h2>
                <span style={styles.badge}>{payments.length} pending</span>
              </div>
              <Payments payments={payments} />
            </div>

            <div style={styles.sidebarCard}>
              <h2 style={styles.complaintTitle}>Report an Issue</h2>
              <ComplaintBox />
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={styles.statsGrid}>
          <div 
            style={{ ...styles.statCard, ...styles.statCardBlue }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.2)';
            }}
          >
            <div style={{ ...styles.statIcon, ...styles.statIconBlue }}>
              <svg
                width="20"
                height="20"
                fill="white"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p style={{ ...styles.statText, ...styles.statTextBlue }}>Total Services</p>
              <p style={{ ...styles.statNumber, ...styles.statNumberBlue }}>{services.length}</p>
            </div>
          </div>

          <div 
            style={{ ...styles.statCard, ...styles.statCardYellow }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(234, 179, 8, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(234, 179, 8, 0.2)';
            }}
          >
            <div style={{ ...styles.statIcon, ...styles.statIconYellow }}>
              <svg
                width="20"
                height="20"
                fill="white"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              >
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p style={{ ...styles.statText, ...styles.statTextYellow }}>Pending Payments</p>
              <p style={{ ...styles.statNumber, ...styles.statNumberYellow }}>{payments.length}</p>
            </div>
          </div>

          <div 
            style={{ ...styles.statCard, ...styles.statCardGreen }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.2)';
            }}
          >
            <div style={{ ...styles.statIcon, ...styles.statIconGreen }}>
              <svg
                width="20"
                height="20"
                fill="white"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p style={{ ...styles.statText, ...styles.statTextGreen }}>Active Since</p>
              <p style={{ ...styles.statNumber, ...styles.statNumberGreen }}>2025</p>
            </div>
          </div>
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

          input, select {
            font-family: inherit;
          }

          input::placeholder,
          textarea::placeholder,
          select option {
            color: rgba(255, 255, 255, 0.4);
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
        `}
      </style>
    </div>
  </>
);

}