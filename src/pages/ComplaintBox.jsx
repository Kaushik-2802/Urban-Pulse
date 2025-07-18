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
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      maxWidth: '600px',
      margin: '32px auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#2d3748',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#718096',
      margin: '0'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    required: {
      color: '#e53e3e'
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      fontFamily: 'inherit',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    textareaFocus: {
      borderColor: '#e53e3e',
      boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#e53e3e',
      boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)'
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      backgroundColor: '#fff',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box',
      cursor: 'pointer'
    },
    selectFocus: {
      borderColor: '#e53e3e',
      boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)'
    },
    priorityButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px'
    },
    priorityButton: {
      flex: 1,
      padding: '10px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff'
    },
    priorityButtonActive: {
      backgroundColor: '#e53e3e',
      borderColor: '#e53e3e',
      color: '#fff'
    },
    priorityButtonLow: {
      backgroundColor: '#38a169',
      borderColor: '#38a169',
      color: '#fff'
    },
    priorityButtonMedium: {
      backgroundColor: '#d69e2e',
      borderColor: '#d69e2e',
      color: '#fff'
    },
    priorityButtonHigh: {
      backgroundColor: '#e53e3e',
      borderColor: '#e53e3e',
      color: '#fff'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#e53e3e',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    submitButtonHover: {
      backgroundColor: '#c53030',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(229, 62, 62, 0.3)'
    },
    submitButtonDisabled: {
      backgroundColor: '#a0aec0',
      cursor: 'not-allowed',
      transform: 'none'
    },
    charCount: {
      fontSize: '12px',
      color: '#718096',
      textAlign: 'right',
      marginTop: '4px'
    },
    charCountWarning: {
      color: '#d69e2e'
    },
    charCountError: {
      color: '#e53e3e'
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
    if (count > 450) return styles.charCountError;
    if (count > 400) return styles.charCountWarning;
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
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
            required
          >
            <option value="">Select a category</option>
            <option value="service-quality">Service Quality</option>
            <option value="billing">Billing Issue</option>
            <option value="worker-behavior">Worker Behavior</option>
            <option value="delayed-service">Delayed Service</option>
            <option value="damaged-property">Property Damage</option>
            <option value="other">Other</option>
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
              e.target.style.borderColor = '#e2e8f0';
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
              e.target.style.borderColor = '#e2e8f0';
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
                    e.target.style.backgroundColor = '#f7fafc';
                    e.target.style.borderColor = '#cbd5e0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (priority !== level) {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.borderColor = '#e2e8f0';
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
              e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
              e.target.style.transform = styles.submitButtonHover.transform;
              e.target.style.boxShadow = styles.submitButtonHover.boxShadow;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = styles.submitButton.backgroundColor;
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
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
    </div>
  );
}