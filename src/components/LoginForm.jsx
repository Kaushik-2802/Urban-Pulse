import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ userType }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        userType
      };
      const endpoint= userType==='worker'?'http://localhost:5000/api/worker/login':'http://localhost:5000/api/auth/login'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        alert(data.message || 'Login successful');
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userType', data.userType);
        const type = data.user?.userType || userType;
        if (type === 'worker') {
          navigate('/worker/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
     } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  const styles = {
    formWrapper: {
      maxWidth: '400px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    icon: {
      fontSize: '40px',
      textAlign: 'center',
      marginBottom: '15px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      margin: '0'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#fff',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#007bff'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      boxSizing: 'border-box'
    },
    buttonHover: {
      backgroundColor: '#0056b3'
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

      <form onSubmit={handleSubmit} style={styles.form}>
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

        <div style={styles.inputGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = styles.inputFocus.borderColor; }}
            onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
            required
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => { e.target.style.backgroundColor = styles.buttonHover.backgroundColor; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = styles.button.backgroundColor; }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
