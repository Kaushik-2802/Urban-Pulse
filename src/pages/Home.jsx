import React, { useState, useEffect } from "react";

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: "1.6",
      margin: 0,
      padding: 0,
      color: "#333"
    },
    header: {
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "white",
      padding: "1rem 0",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 1000
    },
    headerContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 2rem"
    },
    logo: {
      fontSize: "1.8rem",
      fontWeight: "700",
      letterSpacing: "-0.5px"
    },
    nav: {
      display: "flex",
      listStyle: "none",
      margin: 0,
      padding: 0,
      gap: "2rem"
    },
    navLink: {
      color: "white",
      textDecoration: "none",
      fontWeight: "500",
      transition: "all 0.3s ease",
      padding: "0.5rem 0"
    },
    loginBtn: {
      background: "white",
      color: "#2563eb",
      padding: "0.6rem 1.5rem",
      borderRadius: "25px",
      textDecoration: "none",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(255, 255, 255, 0.2)"
    },
    hero: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      padding: "8rem 2rem 5rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    },
    heroContent: {
      maxWidth: "800px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2
    },
    heroTitle: {
      fontSize: "3.5rem",
      fontWeight: "800",
      marginBottom: "1.5rem",
      background: "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      lineHeight: "1.2"
    },
    heroSubtitle: {
      fontSize: "1.3rem",
      color: "#64748b",
      marginBottom: "2.5rem",
      fontWeight: "400"
    },
    ctaButton: {
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "white",
      padding: "1rem 2.5rem",
      border: "none",
      borderRadius: "50px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(37, 99, 235, 0.3)",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    },
    features: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "5rem 2rem",
      background: "white"
    },
    featuresTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "3rem",
      color: "#1e293b"
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2.5rem"
    },
    featureCard: {
      background: "white",
      padding: "2.5rem",
      borderRadius: "16px",
      boxShadow: "0 4px 25px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden"
    },
    featureIcon: {
      width: "60px",
      height: "60px",
      borderRadius: "12px",
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "white"
    },
    featureTitle: {
      fontSize: "1.4rem",
      fontWeight: "700",
      marginBottom: "1rem",
      color: "#1e293b"
    },
    featureDescription: {
      color: "#64748b",
      fontSize: "1rem",
      lineHeight: "1.6"
    },
    // Contact Form Styles
    contactSection: {
      background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
      padding: "5rem 2rem",
    },
    contactContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      background: "white",
      borderRadius: "20px",
      padding: "3rem",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0"
    },
    contactTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "1rem",
      color: "#1e293b"
    },
    contactSubtitle: {
      fontSize: "1.1rem",
      color: "#64748b",
      textAlign: "center",
      marginBottom: "3rem"
    },
    formGroup: {
      marginBottom: "2rem"
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "2rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#374151"
    },
    input: {
      width: "100%",
      padding: "1rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      boxSizing: "border-box"
    },
    textarea: {
      width: "100%",
      padding: "1rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "1rem",
      minHeight: "120px",
      resize: "vertical",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      fontFamily: "inherit"
    },
    submitBtn: {
      width: "100%",
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "white",
      padding: "1rem 2rem",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(37, 99, 235, 0.3)"
    },
    footer: {
      background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      color: "white",
      textAlign: "center",
      padding: "2rem",
      fontSize: "0.95rem"
    },
    // Scroll to top button
    scrollTopBtn: {
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      width: "50px",
      height: "50px",
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      fontSize: "1.2rem",
      boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
      transition: "all 0.3s ease",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    // Decorative elements
    heroDecoration: {
      position: "absolute",
      top: "20%",
      right: "-10%",
      width: "400px",
      height: "400px",
      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)",
      borderRadius: "50%",
      zIndex: 1
    },
    heroDecorationLeft: {
      position: "absolute",
      bottom: "10%",
      left: "-15%",
      width: "300px",
      height: "300px",
      background: "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.05) 100%)",
      borderRadius: "50%",
      zIndex: 1
    }
  };

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#2563eb';
    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  const handleMouseEnter = (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.textContent !== '↑') {
      if (e.target.style.background.includes('gradient')) {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 12px 35px rgba(37, 99, 235, 0.4)';
      } else {
        e.target.style.color = '#93c5fd';
      }
    }
    if (e.target.closest('.feature-card')) {
      const card = e.target.closest('.feature-card');
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    }
  };

  const handleMouseLeave = (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.textContent !== '↑') {
      if (e.target.style.background.includes('gradient')) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
      } else {
        e.target.style.color = 'white';
      }
    }
    if (e.target.closest('.feature-card')) {
      const card = e.target.closest('.feature-card');
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.08)';
    }
  };

  const handleLoginHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.background = '#f1f5f9';
      e.target.style.transform = 'scale(1.05)';
    } else {
      e.target.style.background = 'white';
      e.target.style.transform = 'scale(1)';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <h1 style={styles.logo}>UrbanPulse</h1>
          <nav>
            <ul style={styles.nav}>
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  style={{...styles.navLink, background: 'none', border: 'none', cursor: 'pointer'}}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('features')}
                  style={{...styles.navLink, background: 'none', border: 'none', cursor: 'pointer'}}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  style={{...styles.navLink, background: 'none', border: 'none', cursor: 'pointer'}}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Contact
                </button>
              </li>
              <li>
                <a 
                  href="#" 
                  style={styles.loginBtn}
                  onMouseEnter={(e) => handleLoginHover(e, true)}
                  onMouseLeave={(e) => handleLoginHover(e, false)}
                >
                  Login
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroDecoration}></div>
        <div style={styles.heroDecorationLeft}></div>
        <div style={styles.heroContent}>
          <h2 style={styles.heroTitle}>Welcome to UrbanPulse</h2>
          <p style={styles.heroSubtitle}>Smart Living for Modern Communities</p>
          <button 
            style={styles.ctaButton}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.features}>
        <h3 style={styles.featuresTitle}>Our Features</h3>
        <div style={styles.featuresGrid}>
          <div 
            className="feature-card"
            style={styles.featureCard}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{...styles.featureIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
              👥
            </div>
            <h4 style={styles.featureTitle}>Visitor Management</h4>
            <p style={styles.featureDescription}>
              Keep track of guests entering your society with secure approvals and real-time notifications.
            </p>
          </div>
          
          <div 
            className="feature-card"
            style={styles.featureCard}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{...styles.featureIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
              📢
            </div>
            <h4 style={styles.featureTitle}>Community Alerts</h4>
            <p style={styles.featureDescription}>
              Stay updated with instant announcements, emergency alerts, and important community news.
            </p>
          </div>
          
          <div 
            className="feature-card"
            style={styles.featureCard}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{...styles.featureIcon, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
              💳
            </div>
            <h4 style={styles.featureTitle}>Rent & Bills</h4>
            <p style={styles.featureDescription}>
              Easily pay your rent and utility bills online without hassle through our secure payment system.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.contactSection}>
        <div style={styles.contactContainer}>
          <h3 style={styles.contactTitle}>Get In Touch</h3>
          <p style={styles.contactSubtitle}>
            Have questions about UrbanPulse? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={styles.input}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={styles.input}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.textarea}
                required
                placeholder="Tell us about your inquiry..."
              />
            </div>
            
            <button 
              type="submit" 
              style={styles.submitBtn}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={styles.scrollTopBtn}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.4)';
          }}
        >
          ↑
        </button>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2025 UrbanPulse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;