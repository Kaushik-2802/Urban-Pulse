export default function Payments({ payments }) {
  const styles = {
    container: {
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #e2e8f0'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#2d3748',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    icon: {
      fontSize: '32px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      border: '2px dashed #cbd5e0'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    emptyText: {
      fontSize: '18px',
      color: '#4a5568',
      margin: '0',
      fontWeight: '500'
    },
    paymentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    paymentCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    },
    paymentCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      borderColor: '#007bff'
    },
    paymentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    serviceName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      margin: '0',
      flex: 1
    },
    amount: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#e53e3e',
      margin: '0'
    },
    dueDate: {
      fontSize: '14px',
      color: '#718096',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    urgentBadge: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: '#fed7d7',
      color: '#c53030',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    payButton: {
      marginTop: '16px',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      width: '100%'
    },
    payButtonHover: {
      backgroundColor: '#0056b3'
    },
    summary: {
      backgroundColor: '#f7fafc',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px',
      border: '1px solid #e2e8f0'
    },
    summaryTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2d3748',
      margin: '0 0 12px 0'
    },
    summaryStats: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#007bff',
      margin: '0'
    },
    statLabel: {
      fontSize: '14px',
      color: '#718096',
      margin: '4px 0 0 0'
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const overdueCount = payments.filter(payment => isOverdue(payment.dueDate)).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span style={styles.icon}>💳</span>
          Pending Payments
        </h2>
      </div>

      {payments.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎉</div>
          <p style={styles.emptyText}>No pending payments!</p>
        </div>
      ) : (
        <>
          <div style={styles.summary}>
            <h3 style={styles.summaryTitle}>Payment Summary</h3>
            <div style={styles.summaryStats}>
              <div style={styles.statItem}>
                <p style={styles.statNumber}>{payments.length}</p>
                <p style={styles.statLabel}>Total Bills</p>
              </div>
              <div style={styles.statItem}>
                <p style={styles.statNumber}>₹{totalAmount.toLocaleString()}</p>
                <p style={styles.statLabel}>Total Amount</p>
              </div>
              <div style={styles.statItem}>
                <p style={{...styles.statNumber, color: overdueCount > 0 ? '#e53e3e' : '#38a169'}}>
                  {overdueCount}
                </p>
                <p style={styles.statLabel}>Overdue</p>
              </div>
            </div>
          </div>

          <div style={styles.paymentsList}>
            {payments.map((payment, idx) => (
              <div 
                key={idx} 
                style={styles.paymentCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.paymentCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.paymentCardHover.boxShadow;
                  e.currentTarget.style.borderColor = styles.paymentCardHover.borderColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = styles.paymentCard.boxShadow;
                  e.currentTarget.style.borderColor = styles.paymentCard.borderColor;
                }}
              >
                {isOverdue(payment.dueDate) && (
                  <div style={styles.urgentBadge}>OVERDUE</div>
                )}
                
                <div style={styles.paymentHeader}>
                  <h3 style={styles.serviceName}>{payment.service}</h3>
                  <p style={styles.amount}>₹{payment.amount.toLocaleString()}</p>
                </div>
                
                <p style={styles.dueDate}>
                  📅 Due: {new Date(payment.dueDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>

                <button 
                  style={styles.payButton}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = styles.payButtonHover.backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = styles.payButton.backgroundColor;
                  }}
                  onClick={() => {
                    alert(`Initiating payment for ${payment.service} - ₹${payment.amount}`);
                  }}
                >
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}