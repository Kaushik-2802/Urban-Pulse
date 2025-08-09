import { useState } from 'react';

export default function SignupForm({ userType }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (!value) error = 'Confirm Password is required';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'profession':
        if (userType === 'worker' && !value.trim()) error = 'Profession is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Live validation
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));

    if (name === 'password') {
      if (value.length < 6) setPasswordStrength('Weak');
      else if (value.length < 10) setPasswordStrength('Medium');
      else setPasswordStrength('Strong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key === 'profession' && userType !== 'worker') return;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMsg('');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType,
        profession: userType === 'worker' ? formData.profession : undefined
      };
      const endpoint =
        userType === 'worker'
          ? 'http://localhost:5000/api/worker/register'
          : 'http://localhost:5000/api/auth/register';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Registration successful!');
        setFormData({ name: '', email: '', password: '', confirmPassword: '', profession: '' });
        setErrors({});
        setPasswordStrength('');
      } else {
        setErrors({ api: data.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ api: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    formWrapper: {
      maxWidth: '420px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    },
    header: { textAlign: 'center', marginBottom: '20px' },
    title: { fontSize: '26px', fontWeight: '700', margin: '0' },
    subtitle: { fontSize: '14px', color: '#666', margin: '5px 0 20px' },
    input: {
      width: '100%',
      padding: '12px 14px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s ease'
    },
    inputError: { borderColor: '#e74c3c' },
    errorText: {
      color: '#e74c3c',
      fontSize: '13px',
      margin: '5px 0 0',
      opacity: 1,
      transition: 'opacity 0.3s ease'
    },
    passwordStrength: { fontSize: '13px', marginTop: '5px' },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s ease'
    },
    successMsg: {
      color: 'green',
      textAlign: 'center',
      marginBottom: '10px',
      opacity: 1,
      transition: 'opacity 0.3s ease'
    },
    apiError: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '10px',
      opacity: 1,
      transition: 'opacity 0.3s ease'
    }
  };

  return (
    <div style={styles.formWrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>
          Sign up as {userType === 'public' ? 'Public User' : 'Worker'}
        </p>
      </div>

      {successMsg && <p style={styles.successMsg}>{successMsg}</p>}
      {errors.api && <p style={styles.apiError}>{errors.api}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Full Name"
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.name ? styles.inputError : {})
            }}
          />
          {errors.name && <p style={styles.errorText}>{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {})
            }}
          />
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.password ? styles.inputError : {})
            }}
          />
          {passwordStrength && (
            <p
              style={{
                ...styles.passwordStrength,
                color:
                  passwordStrength === 'Weak'
                    ? 'red'
                    : passwordStrength === 'Medium'
                    ? 'orange'
                    : 'green'
              }}
            >
              Strength: {passwordStrength}
            </p>
          )}
          {errors.password && <p style={styles.errorText}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.confirmPassword ? styles.inputError : {})
            }}
          />
          {errors.confirmPassword && (
            <p style={styles.errorText}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Profession */}
        {userType === 'worker' && (
          <div>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              placeholder="Profession (Electrician/Plumber...)"
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.profession ? styles.inputError : {})
              }}
            />
            {errors.profession && (
              <p style={styles.errorText}>{errors.profession}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
