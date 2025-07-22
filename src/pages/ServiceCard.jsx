export default function ServiceCard({ service, onBook }) {
const styles = {
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      borderColor: '#007bff'
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    serviceName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748',
      margin: '0',
      lineHeight: '1.2',
      flex: 1
    },
    serviceIcon: {
      fontSize: '32px',
      marginLeft: '12px'
    },
    costSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px'
    },
    costLabel: {
      fontSize: '14px',
      color: '#718096',
      fontWeight: '500'
    },
    costAmount: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#007bff',
      margin: '0'
    },
    description: {
      fontSize: '14px',
      color: '#4a5568',
      lineHeight: '1.5',
      marginBottom: '20px'
    },
    features: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '20px'
    },
    feature: {
      backgroundColor: '#f7fafc',
      color: '#2d3748',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      border: '1px solid #e2e8f0'
    },
    bookButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    bookButtonHover: {
      backgroundColor: '#0056b3',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0, 123, 255, 0.3)'
    },
    popularBadge: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: '#ffd700',
      color: '#b45309',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    discountBadge: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      backgroundColor: '#fed7d7',
      color: '#c53030',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    }
  };


  const getServiceIcon = (profession) => {
    const icons = {
      'Plumber': '🔧',
      'Electrician': '⚡',
      'Cleaner': '🧹',
      'Gardener': '🌱',
      'Painter': '🎨',
      'Carpenter': '🔨',
      'AC Repair': '❄️',
      'Appliance Repair': '🔧'
    };
    return icons[profession] || '🛠️';
  };

  const getServiceFeatures = (profession) => {
    const features = {
      'Plumber': ['24/7 Available', 'Licensed', 'Warranty'],
      'Electrician': ['Certified', 'Safety First', 'Quick Service'],
      'Cleaner': ['Eco-Friendly', 'Deep Clean', 'Sanitized'],
      'Gardener': ['Plant Care', 'Seasonal', 'Organic'],
      'Painter': ['Quality Paint', 'Color Matching', 'Clean Finish'],
      'Carpenter': ['Custom Work', 'Quality Wood', 'Precision'],
      'AC Repair': ['All Brands', 'Gas Refill', 'Maintenance'],
      'Appliance Repair': ['Home Visit', 'Parts Available', 'Guarantee']
    };
    return features[profession] || ['Professional', 'Reliable', 'Affordable'];
  };

  const getServiceDescription = (profession) => {
    const descriptions = {
      'Plumber': 'Expert plumbing services for all your water and drainage needs',
      'Electrician': 'Safe and reliable electrical work by certified professionals',
      'Cleaner': 'Professional cleaning services to make your space spotless',
      'Gardener': 'Transform your garden with expert landscaping and plant care',
      'Painter': 'Quality painting services for interior and exterior surfaces',
      'Carpenter': 'Custom woodwork and furniture repair by skilled craftsmen',
      'AC Repair': 'Complete air conditioning repair and maintenance services',
      'Appliance Repair': 'Fix all your home appliances with expert technicians'
    };
    return descriptions[profession] || 'Professional service with quality guarantee';
  };

  const isPopular = service.cost > 1000;
  const hasDiscount = service.cost % 100 === 0;

  return (
    <div 
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = styles.cardHover.transform;
        e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
        e.currentTarget.style.borderColor = styles.cardHover.borderColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = styles.card.boxShadow;
        e.currentTarget.style.borderColor = styles.card.borderColor;
      }}
    >
      {isPopular && <div style={styles.popularBadge}>⭐ Popular</div>}
      {hasDiscount && <div style={styles.discountBadge}>💰 Best Value</div>}

      <div style={styles.header}>
        <h3 style={styles.serviceName}>{service.profession}</h3>
        <span style={styles.serviceIcon}>{getServiceIcon(service.profession)}</span>
      </div>

      <p style={styles.description}>{getServiceDescription(service.profession)}</p>

      <div style={styles.features}>
        {getServiceFeatures(service.profession).map((feature, idx) => (
          <span key={idx} style={styles.feature}>✓ {feature}</span>
        ))}
      </div>

      <div style={styles.costSection}>
        <span style={styles.costLabel}>Starting from</span>
        <p style={styles.costAmount}>₹{service.cost.toLocaleString()}</p>
      </div>

      {/* Additional worker details */}
      <div style={{ marginBottom: '12px', fontSize: '14px', color: '#4a5568' }}>
        <strong>Provided by:</strong> {service.name}<br />
        <strong>Location:</strong> {service.location}
      </div>

      <button
        style={styles.bookButton}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = styles.bookButtonHover.backgroundColor;
          e.target.style.transform = styles.bookButtonHover.transform;
          e.target.style.boxShadow = styles.bookButtonHover.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.bookButton.backgroundColor;
          e.target.style.transform = 'none';
          e.target.style.boxShadow = 'none';
        }}
        onClick={() => onBook(service)}
      >
        <span>📅</span> Book Now
      </button>
    </div>
  );
}
