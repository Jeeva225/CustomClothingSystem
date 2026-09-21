import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Backend API தேவையின்றி நேரடியாக லாகினை வெற்றிகரமாக அனுமதிக்கிறோம்
    setMessage(isRegister ? 'Registration Successful! Please Login.' : 'Login Successful!');
    
    if (isRegister) {
      setIsRegister(false);
    } else if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxshadow: '0 4px 10px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>{isRegister ? 'Register' : 'Login'}</h2>
        
        {message && <p style={{ color: 'green', textAlign: 'center', fontSize: '14px' }}>{message}</p>}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Name:</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', background: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            onClick={() => setIsRegister(!isRegister)} 
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;