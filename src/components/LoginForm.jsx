import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ userType }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const endpoint =
        userType === 'worker'
          ? 'http://localhost:5000/api/worker/login'
          : 'http://localhost:5000/api/auth/login';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType })
      });

      const data = await res.json();

      if (res.ok) {
        const userId = data.user?._id || data.userId;
        localStorage.setItem('userId', userId);
        localStorage.setItem('userType', data.userType);
        setSuccessMsg(data.message || 'Login successful!');
        setTimeout(() => {
          const type = data.user?.userType || userType;
          navigate(type === 'worker' ? '/worker/dashboard' : '/dashboard');
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Invalid credentials');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    formWrapper: {
      maxWidth: '420px',
      margin: '60px auto',
      padding: '35px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
      fontFamily: 'Segoe UI, sans-serif'
    },
    icon: { fontSize: '48px', textAlign: 'center', marginBottom: '15px' },
    header: { textAlign: 'center', marginBottom: '25px' },
    title: { fontSize: '26px', fontWeight: '700', margin: '0', color: '#222' },
    subtitle: { fontSize: '14px', color: '#666', marginTop: '6px' },
    message: {
      fontSize: '14px',
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '15px',
      textAlign: 'center',
      animation: 'fadeIn 0.3s ease'
    },
    error: { backgroundColor: '#fdecea', color: '#d93025' },
    success: { backgroundColor: '#e6f4ea', color: '#137333' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { position: 'relative' },
    input: {
      width: '100%',
      padding: '12px 14px',
      border: '2px solid #ddd',
      borderRadius: '10px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    inputFocus: { borderColor: '#007bff' },
    togglePassword: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#007bff'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    buttonHover: { backgroundColor: '#0056b3' },
    spinner: {
      width: '18px',
      height: '18px',
      border: '2px solid white',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
      margin: '0 auto'
    }
  };

  return (
    <div style={styles.formWrapper}>
      <div style={styles.icon}>
        {userType === 'public' ? '👤' : '🔧'}
      </div>
      <div style={styles.header}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>
          Sign in as {userType === 'public' ? 'Public User' : 'Worker'}
        </p>
      </div>

      {errorMsg && <div style={{ ...styles.message, ...styles.error }}>{errorMsg}</div>}
      {successMsg && <div style={{ ...styles.message, ...styles.success }}>{successMsg}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Email */}
        <div style={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = styles.inputFocus.borderColor; }}
            onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
            required
          />
        </div>

        {/* Password */}
        <div style={styles.inputGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = styles.inputFocus.borderColor; }}
            onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
            required
          />
          <span
            style={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={styles.button}
          disabled={loading}
          onMouseEnter={(e) => { e.target.style.backgroundColor = styles.buttonHover.backgroundColor; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = styles.button.backgroundColor; }}
        >
          {loading ? <div style={styles.spinner}></div> : 'Login'}
        </button>
      </form>
    </div>
  );
}
