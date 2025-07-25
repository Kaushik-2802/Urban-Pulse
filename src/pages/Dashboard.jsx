import ServiceCard from './ServiceCard';
import Payments from './Payments';
import ComplaintBox from './ComplaintBox';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const services = [
    { name: 'Electrician', cost: 250 },
    { name: 'Plumber', cost: 200 },
    { name: 'Carpenter', cost: 300 }
  ];
  const [userProfile, setUserProfile] = useState(null);
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
      window.location.href = '/';
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No user ID found in localStorage');
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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '0'
    },
    wrapper: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px'
    },
    header: {
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      background: 'rgba(0, 0, 0, 0.1)',
      zIndex: 1
    },
    headerContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '1280px',
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
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      padding: '8px 16px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
      textDecoration: 'none'
    },
    logoutButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      padding: '8px 16px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
      textDecoration: 'none'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
      padding: '8px 12px',
      backdropFilter: 'blur(10px)'
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white'
    },
    userName: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'white',
      margin: 0
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px'
    },
    titleIcon: {
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
      backdropFilter: 'blur(10px)'
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      color: 'white',
      margin: 0,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '16px',
      fontWeight: '400',
      margin: 0,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    decorativeElement: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      width: '120px',
      height: '120px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      zIndex: 1
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px'
    },
    servicesSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '24px'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827'
    },
    servicesCount: {
      fontSize: '14px',
      color: '#6b7280'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    sidebarCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '24px'
    },
    paymentHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    complaintTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px'
    },
    statsGrid: {
      marginTop: '32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    statCard: {
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center'
    },
    statCardBlue: {
      backgroundColor: '#dbeafe',
      border: '1px solid #93c5fd'
    },
    statCardYellow: {
      backgroundColor: '#fef3c7',
      border: '1px solid #fcd34d'
    },
    statCardGreen: {
      backgroundColor: '#d1fae5',
      border: '1px solid #6ee7b7'
    },
    statIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px'
    },
    statIconBlue: {
      backgroundColor: '#3b82f6'
    },
    statIconYellow: {
      backgroundColor: '#eab308'
    },
    statIconGreen: {
      backgroundColor: '#10b981'
    },
    statText: {
      fontSize: '14px',
      fontWeight: '500',
      margin: '0 0 4px 0'
    },
    statTextBlue: {
      color: '#1e3a8a'
    },
    statTextYellow: {
      color: '#92400e'
    },
    statTextGreen: {
      color: '#064e3b'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0'
    },
    statNumberBlue: {
      color: '#1d4ed8'
    },
    statNumberYellow: {
      color: '#d97706'
    },
    statNumberGreen: {
      color: '#059669'
    }
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      e.target.style.transform = 'translateY(-1px)';
    } else {
      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      e.target.style.transform = 'translateY(0)';
    }
  };

  return (
    <div style={styles.container}>
      {/* Full-width Header */}
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.decorativeElement}></div>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.titleContainer}>
              <div style={styles.titleIcon}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <h1 style={styles.title}>
                Dashboard
              </h1>
            </div>
            <p style={styles.subtitle}>
              Welcome back! Manage your services, payments, and support requests all in one place
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
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile
            </button>
            
            <button 
              style={styles.logoutButton}
              onClick={handleLogout}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.wrapper}>
        {/* Main Content Grid */}
        <div style={{
          ...styles.mainGrid,
          ...(window.innerWidth >= 1024 ? { gridTemplateColumns: '2fr 1fr' } : {})
        }}>
          {/* Services Section */}
          <div style={styles.servicesSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                Available Services
              </h2>
              <span style={styles.servicesCount}>
                {services.length} services available
              </span>
            </div>
            
            <div style={styles.servicesGrid}>
              {services.map((service, idx) => (
                <ServiceCard
                  key={idx}
                  service={service}
                  onBook={() => handleBookService(service)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Payments Section */}
            <div style={styles.sidebarCard}>
              <div style={styles.paymentHeader}>
                <h2 style={styles.sectionTitle}>
                  Payments
                </h2>
                <span style={styles.badge}>
                  {payments.length} pending
                </span>
              </div>
              <Payments payments={payments} />
            </div>

            {/* Complaint Box Section */}
            <div style={styles.sidebarCard}>
              <h2 style={styles.complaintTitle}>
                Report an Issue
              </h2>
              <ComplaintBox />
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, ...styles.statCardBlue}}>
            <div style={{...styles.statIcon, ...styles.statIconBlue}}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p style={{...styles.statText, ...styles.statTextBlue}}>Total Services</p>
              <p style={{...styles.statNumber, ...styles.statNumberBlue}}>{services.length}</p>
            </div>
          </div>

          <div style={{...styles.statCard, ...styles.statCardYellow}}>
            <div style={{...styles.statIcon, ...styles.statIconYellow}}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p style={{...styles.statText, ...styles.statTextYellow}}>Pending Payments</p>
              <p style={{...styles.statNumber, ...styles.statNumberYellow}}>{payments.length}</p>
            </div>
          </div>

          <div style={{...styles.statCard, ...styles.statCardGreen}}>
            <div style={{...styles.statIcon, ...styles.statIconGreen}}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p style={{...styles.statText, ...styles.statTextGreen}}>Active Since</p>
              <p style={{...styles.statNumber, ...styles.statNumberGreen}}>2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}