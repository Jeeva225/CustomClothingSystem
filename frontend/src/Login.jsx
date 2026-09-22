import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isRegister) {
        const response = await fetch(
          `${API_BASE_URL}/users/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              role: 'CUSTOMER'
            })
          }
        );

        const data = await response.json().catch(() => null);

        if (response.ok) {
          setMessage(
            'Registration successful! Please login.'
          );

          setIsRegister(false);

          setFormData({
            name: '',
            email: '',
            password: '',
            phone: ''
          });
        } else {
          setMessage(
            typeof data === 'string'
              ? data
              : 'Registration failed.'
          );
        }
      } else {
        const response = await fetch(
          `${API_BASE_URL}/users/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          }
        );

        const data = await response.json().catch(() => null);

        if (response.ok) {
          setMessage('Login successful!');
          onLoginSuccess(data);
        } else {
          setMessage(
            typeof data === 'string'
              ? data
              : 'Login failed.'
          );
        }
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(135deg, #eef4ff, #f8f9ff)',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'white',
          padding: '35px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.10)'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 15px',
              borderRadius: '50%',
              background: '#007bff',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            CC
          </div>

          <h2
            style={{
              margin: '0',
              color: '#222',
              fontSize: '27px',
              lineHeight: '1.4',
              fontWeight: 'bold'
            }}
          >
            Custom Clothing Order & Measurement
            Management Platform
          </h2>
        </div>

        <h3
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333'
          }}
        >
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h3>

        {message && (
          <div
            style={{
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '6px',
              background:
                message
                  .toLowerCase()
                  .includes('success')
                  ? '#eaf8ef'
                  : '#fdecec',
              color:
                message
                  .toLowerCase()
                  .includes('success')
                  ? '#198754'
                  : '#dc3545',
              textAlign: 'center',
              fontSize: '14px'
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </>
          )}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '5px'
            }}
          >
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#666'
          }}
        >
          {isRegister
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              marginLeft: '5px',
              fontWeight: 'bold',
              padding: 0
            }}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

const fieldStyle = {
  marginBottom: '16px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '7px',
  color: '#444',
  fontSize: '14px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  border: '1px solid #d6d6d6',
  borderRadius: '7px',
  fontSize: '14px',
  outline: 'none'
};

export default Login;