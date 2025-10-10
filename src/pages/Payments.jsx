export default function Payments({ payments }) {
  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid rgba(59, 130, 246, 0.2)'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      letterSpacing: '-0.5px'
    },
    icon: {
      fontSize: '28px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px 20px',
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '2px dashed rgba(59, 130, 246, 0.3)'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px',
      filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
    },
    emptyText: {
      fontSize: '18px',
      color: 'rgba(255, 255, 255, 0.7)',
      margin: '0',
      fontWeight: '600'
    },
    paymentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    paymentCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    },
    paymentCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 30px rgba(59, 130, 246, 0.3)',
      borderColor: 'rgba(59, 130, 246, 0.5)'
    },
    paymentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    serviceName: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'white',
      margin: '0',
      flex: 1
    },
    amount: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0',
      letterSpacing: '-1px'
    },
    dueDate: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontWeight: '500'
    },
    urgentBadge: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.5)',
      animation: 'pulse 2s infinite'
    },
    payButton: {
      marginTop: '20px',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    payButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 25px rgba(59, 130, 246, 0.6)'
    },
    summary: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      marginBottom: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    },
    summaryTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: 'white',
      margin: '0 0 20px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    summaryStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px'
    },
    statItem: {
      textAlign: 'center',
      padding: '16px',
      background: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease'
    },
    statItemHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0',
      letterSpacing: '-1px'
    },
    statLabel: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: '8px 0 0 0',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
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
              <div 
                style={styles.statItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.statItemHover.transform;
                  e.currentTarget.style.boxShadow = styles.statItemHover.boxShadow;
                  e.currentTarget.style.borderColor = styles.statItemHover.borderColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <p style={styles.statNumber}>{payments.length}</p>
                <p style={styles.statLabel}>Total Bills</p>
              </div>
              <div 
                style={styles.statItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.statItemHover.transform;
                  e.currentTarget.style.boxShadow = styles.statItemHover.boxShadow;
                  e.currentTarget.style.borderColor = styles.statItemHover.borderColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <p style={styles.statNumber}>₹{totalAmount.toLocaleString()}</p>
                <p style={styles.statLabel}>Total Amount</p>
              </div>
              <div 
                style={styles.statItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.statItemHover.transform;
                  e.currentTarget.style.boxShadow = styles.statItemHover.boxShadow;
                  e.currentTarget.style.borderColor = styles.statItemHover.borderColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <p style={{
                  ...styles.statNumber,
                  background: overdueCount > 0 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
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
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {isOverdue(payment.dueDate) && (
                  <div style={styles.urgentBadge}>⚠️ OVERDUE</div>
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
                    e.target.style.transform = styles.payButtonHover.transform;
                    e.target.style.boxShadow = styles.payButtonHover.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                  }}
                  onClick={() => {
                    alert(`Initiating payment for ${payment.service} - ₹${payment.amount}`);
                  }}
                >
                  💳 Pay Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.9;
              transform: scale(1.02);
            }
          }

          @media (max-width: 768px) {
            .summaryStats {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}