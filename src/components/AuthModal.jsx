import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthModal() {
  const [activeTab, setActiveTab] = useState('public');
  const [isLogin, setIsLogin] = useState(true);

  const containerStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  };

  const tabButtonStyle = (active) => ({
    padding: '10px 20px',
    borderRadius: '6px',
    backgroundColor: active ? '#007bff' : '#e0e0e0',
    color: active ? '#fff' : '#000',
    border: 'none',
    cursor: 'pointer'
  });

  const switchButtonStyle = (active) => ({
    padding: '10px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: active ? '2px solid #007bff' : 'none',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal'
  });

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('public')}
          style={tabButtonStyle(activeTab === 'public')}
        >
          Normal Public
        </button>
        <button
          onClick={() => setActiveTab('worker')}
          style={tabButtonStyle(activeTab === 'worker')}
        >
          Worker
        </button>
      </div>

      {/* Login / Signup Switch */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setIsLogin(true)}
          style={switchButtonStyle(isLogin)}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          style={switchButtonStyle(!isLogin)}
        >
          Register
        </button>
      </div>

      {/* Form */}
      {isLogin ? (
        <LoginForm userType={activeTab} />
      ) : (
        <SignupForm userType={activeTab} />
      )}
    </div>
  );
}
