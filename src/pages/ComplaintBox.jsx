import { useState } from 'react';

export default function ComplaintBox() {
  const [complaint, setComplaint] = useState('');
  const [area, setArea] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Complaint Submitted Successfully!\n\nCategory: ${category}\nPriority: ${priority}\nComplaint: ${complaint}\nLocation: ${area}`);
      setComplaint('');
      setArea('');
      setPriority('medium');
      setCategory('');
      setIsSubmitting(false);
    }, 1000);
  };

  const styles = {
    container: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '26px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: '0',
      fontWeight: '500'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '700',
      color: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    required: {
      color: '#fca5a5',
      fontWeight: '700'
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '16px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '14px',
      fontSize: '15px',
      fontFamily: 'inherit',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box',
      color: 'white',
      fontWeight: '500'
    },
    textareaFocus: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.15)'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '14px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box',
      color: 'white',
      fontWeight: '500'
    },
    inputFocus: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.15)'
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '14px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box',
      cursor: 'pointer',
      color: 'white',
      fontWeight: '500'
    },
    selectFocus: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.15)'
    },
    priorityButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '4px'
    },
    priorityButton: {
      flex: 1,
      padding: '12px 16px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'rgba(30, 41, 59, 0.5)',
      color: 'rgba(255, 255, 255, 0.7)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    priorityButtonActive: {
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
      color: '#fff'
    },
    priorityButtonLow: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderColor: '#10b981',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
    },
    priorityButtonMedium: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      borderColor: '#f59e0b',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
    },
    priorityButtonHigh: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      borderColor: '#ef4444',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(239, 68, 68, 0.6)'
    },
    submitButtonDisabled: {
      background: 'rgba(100, 116, 139, 0.5)',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    charCount: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.5)',
      textAlign: 'right',
      marginTop: '6px',
      fontWeight: '600'
    },
    charCountWarning: {
      color: '#fbbf24'
    },
    charCountError: {
      color: '#fca5a5'
    }
  };

  const getPriorityColor = (selectedPriority) => {
    switch(selectedPriority) {
      case 'low': return styles.priorityButtonLow;
      case 'medium': return styles.priorityButtonMedium;
      case 'high': return styles.priorityButtonHigh;
      default: return {};
    }
  };

  const getCharCountStyle = (count) => {
    if (count > 450) return { ...styles.charCount, ...styles.charCountError };
    if (count > 400) return { ...styles.charCount, ...styles.charCountWarning };
    return styles.charCount;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span>📢</span>
          Submit a Complaint
        </h2>
        <p style={styles.subtitle}>
          Help us improve our services by reporting issues
        </p>
      </div>

      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span>📋</span>
            Complaint Category <span style={styles.required}>*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = styles.selectFocus.borderColor;
              e.target.style.boxShadow = styles.selectFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
            required
          >
            <option value="" style={{ background: '#1e293b', color: 'white' }}>Select a category</option>
            <option value="service-quality" style={{ background: '#1e293b', color: 'white' }}>Service Quality</option>
            <option value="billing" style={{ background: '#1e293b', color: 'white' }}>Billing Issue</option>
            <option value="worker-behavior" style={{ background: '#1e293b', color: 'white' }}>Worker Behavior</option>
            <option value="delayed-service" style={{ background: '#1e293b', color: 'white' }}>Delayed Service</option>
            <option value="damaged-property" style={{ background: '#1e293b', color: 'white' }}>Property Damage</option>
            <option value="other" style={{ background: '#1e293b', color: 'white' }}>Other</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span>📝</span>
            Describe Your Complaint <span style={styles.required}>*</span>
          </label>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Please provide detailed information about your complaint..."
            style={styles.textarea}
            onFocus={(e) => {
              e.target.style.borderColor = styles.textareaFocus.borderColor;
              e.target.style.boxShadow = styles.textareaFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
            maxLength={500}
            required
          />
          <div style={getCharCountStyle(complaint.length)}>
            {complaint.length}/500 characters
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span>📍</span>
            Location/Area <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter your area, street, or landmark"
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
              e.target.style.boxShadow = styles.inputFocus.boxShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <span>⚠️</span>
            Priority Level
          </label>
          <div style={styles.priorityButtons}>
            {['low', 'medium', 'high'].map((level) => (
              <button
                key={level}
                type="button"
                style={{
                  ...styles.priorityButton,
                  ...(priority === level ? getPriorityColor(level) : {})
                }}
                onClick={() => setPriority(level)}
                onMouseEnter={(e) => {
                  if (priority !== level) {
                    e.target.style.background = 'rgba(30, 41, 59, 0.8)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (priority !== level) {
                    e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            ...styles.submitButton,
            ...(isSubmitting ? styles.submitButtonDisabled : {})
          }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.target.style.transform = styles.submitButtonHover.transform;
              e.target.style.boxShadow = styles.submitButtonHover.boxShadow;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <span>⏳</span>
              Submitting...
            </>
          ) : (
            <>
              <span>📤</span>
              Submit Complaint
            </>
          )}
        </button>
      </div>

      <style>
        {`
          input::placeholder,
          textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          select option {
            background: #1e293b;
            color: white;
            padding: 8px;
          }
        `}
      </style>
    </div>
  );
}