import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
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

  const [trackCustomerId, setTrackCustomerId] = useState('');
  const [orders, setOrders] = useState([]);

  const handleMeasurementChange = (e) => {
    setMeasurement({ ...measurement, [e.target.name]: e.target.value });
  };

  const saveMeasurement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/measurements`, measurement);
      alert('Measurements Saved Successfully!');
    } catch (error) {
      console.error('Error saving measurement:', error);
      alert('Failed to save measurement');
    }
  };

  const handleOrderChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/orders`, order);
      alert('Order Placed Successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const fetchOrders = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/customer/${trackCustomerId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    }
  };

  return (
    <div className="container">
      <h1>Custom Clothing Management System</h1>

      <div className="card">
        <h2>1. Enter Customer Measurements</h2>
        <form onSubmit={saveMeasurement}>
          <div className="form-group">
            <input type="number" name="customerId" placeholder="Customer ID" value={measurement.customerId} onChange={handleMeasurementChange} required />
          </div>
          <div className="form-group">
            <input type="number" name="chest" placeholder="Chest (inches)" value={measurement.chest} onChange={handleMeasurementChange} required />
          </div>
          <div className="form-group">
            <input type="number" name="waist" placeholder="Waist (inches)" value={measurement.waist} onChange={handleMeasurementChange} required />
          </div>
          <div className="form-group">
            <input type="number" name="hips" placeholder="Hips (inches)" value={measurement.hips} onChange={handleMeasurementChange} required />
          </div>
          <div className="form-group">
            <input type="number" name="shoulder" placeholder="Shoulder (inches)" value={measurement.shoulder} onChange={handleMeasurementChange} required />
          </div>
          <button type="submit">Save Measurements</button>
        </form>
      </div>

      <div className="card">
        <h2>2. Place Order</h2>
        <form onSubmit={placeOrder}>
          <div className="form-group">
            <input type="number" name="customerId" placeholder="Customer ID" value={order.customerId} onChange={handleOrderChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="designName" placeholder="Design Name (e.g. Suit, Shirt)" value={order.designName} onChange={handleOrderChange} required />
          </div>
          <button type="submit">Place Order</button>
        </form>
      </div>

      <div className="card">
        <h2>3. Track Orders</h2>
        <form onSubmit={fetchOrders}>
          <div className="form-group">
            <input type="number" placeholder="Enter Customer ID to Track" value={trackCustomerId} onChange={(e) => setTrackCustomerId(e.target.value)} required />
          </div>
          <button type="submit">Get Orders</button>
        </form>

        {orders.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Your Orders:</h3>
            <ul>
              {orders.map((ord) => (
                <li key={ord.id}>
                  <strong>Order ID:</strong> #{ord.id} | <strong>Design:</strong> {ord.designName} | <strong>Status:</strong> {ord.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;