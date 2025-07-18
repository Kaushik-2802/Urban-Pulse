import { useState } from 'react';

export default function SignupForm({ userType }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profession: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType,
        profession: userType === 'worker' ? formData.profession : undefined
      };
      const endpoint=userType==='worker'?'http://localhost:5000/api/worker/register':'http://localhost:5000/api/auth/register'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Registration successful');
        setFormData({ name: '', email: '', password: '', profession: '' });
      } else {
        alert(data.message || 'Registration failed');
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
      <div style={styles.header}>
        <h2 style={styles.title}>Register</h2>
        <p style={styles.subtitle}>
          Sign up as {userType === 'public' ? 'Public User' : 'Worker'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          style={styles.input}
          onFocus={(e) => { e.target.style.borderColor = styles.inputFocus.borderColor; }}
          onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={styles.input}
          onFocus={(e) => { e.target.style.borderColor = styles.inputFocus.borderColor; }}
          onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          style={styles.input}
          onFocus={(e) => { e.target.style.borderColor = styles.inputFocus.borderColor; }}
          onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
          required
        />

        {userType === 'worker' && (
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Profession (Electrician/Plumber...)"
            style={styles.input}
            onFocus={(e) => { e.target.style.borderColor = styles.inputFocus.borderColor; }}
            onBlur={(e) => { e.target.style.borderColor = '#ddd'; }}
            required
          />
        )}

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => { e.target.style.backgroundColor = styles.buttonHover.backgroundColor; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = styles.button.backgroundColor; }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
