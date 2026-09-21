import React, { useState } from 'react';
import Login from './Login';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);

  const [measurement, setMeasurement] = useState({
    customerId: '',
    chest: '',
    waist: '',
    hips: '',
    shoulder: ''
  });

  const [order, setOrder] = useState({
    customerId: '',
    designName: ''
  });

  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('measurement');

  const handleLoginSuccess = () => {
    setUser({ name: 'Admin' });
  };

  const handleMeasurementSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/measurements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: Number(measurement.customerId),
          chest: Number(measurement.chest),
          waist: Number(measurement.waist),
          hips: Number(measurement.hips),
          shoulder: Number(measurement.shoulder)
        }),
      });

      if (response.ok) {
        setMessage('Measurement saved successfully! You can now place an order.');
        setMeasurement({ customerId: '', chest: '', waist: '', hips: '', shoulder: '' });
        setActiveTab('order');
      } else {
        setMessage('Failed to save measurement.');
      }
    } catch (err) {
      setMessage('Backend is not running');
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: Number(order.customerId),
          designName: order.designName
        }),
      });

      if (response.ok) {
        setMessage('Order placed successfully!');
        setOrder({ customerId: '', designName: '' });
      } else {
        setMessage('Failed to place order.');
      }
    } catch (err) {
      setMessage('Backend is not running');
    }
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Custom Clothing Order Management</h2>
      
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('measurement')} 
          style={{ padding: '10px 20px', marginRight: '10px', background: activeTab === 'measurement' ? '#007bff' : '#ccc', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          1. Measurements
        </button>
        <button 
          onClick={() => setActiveTab('order')} 
          style={{ padding: '10px 20px', background: activeTab === 'order' ? '#007bff' : '#ccc', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          2. Order Form
        </button>
      </div>

      {activeTab === 'measurement' && (
        <form onSubmit={handleMeasurementSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px' }}>
          <h3>Enter Customer Measurements</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Customer ID: </label>
            <input type="number" value={measurement.customerId} onChange={(e) => setMeasurement({...measurement, customerId: e.target.value})} required style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Chest: </label>
            <input type="number" step="0.1" value={measurement.chest} onChange={(e) => setMeasurement({...measurement, chest: e.target.value})} required style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Waist: </label>
            <input type="number" step="0.1" value={measurement.waist} onChange={(e) => setMeasurement({...measurement, waist: e.target.value})} required style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Hips: </label>
            <input type="number" step="0.1" value={measurement.hips} onChange={(e) => setMeasurement({...measurement, hips: e.target.value})} required style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Shoulder: </label>
            <input type="number" step="0.1" value={measurement.shoulder} onChange={(e) => setMeasurement({...measurement, shoulder: e.target.value})} required style={{ width: '100%', padding: '5px' }} />
          </div>
          <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer' }}>Save Measurement</button>
        </form>
      )}

      {activeTab === 'order' && (
        <form onSubmit={handleOrderSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px' }}>
          <h3>Place Custom Clothing Order</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Customer ID: </label>
            <input type="number" value={order.customerId} onChange={(e) => setOrder({...order, customerId: e.target.value})} required style={{ width: '100%', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Design Name / Description: </label>
            <input type="text" value={order.designName} onChange={(e) => setOrder({...order, designName: e.target.value})} required style={{ width: '100%', padding: '5px' }} />
          </div>
          <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer' }}>Place Order</button>
        </form>
      )}
    </div>
  );
}

export default App;