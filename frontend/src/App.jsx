import React, { useEffect, useState } from 'react';
import Login from './Login';
import TailorDashboard from './TailorDashboard';
import AdminDashboard from './AdminDashboard';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);

  const [measurement, setMeasurement] = useState({
    chest: '',
    waist: '',
    hips: '',
    shoulder: ''
  });

  const [designs, setDesigns] = useState([]);

  const [order, setOrder] = useState({
    designName: ''
  });

  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderStatusHistory, setOrderStatusHistory] = useState([]);

  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerMeasurements, setCustomerMeasurements] = useState([]);

  const [editingMeasurementId, setEditingMeasurementId] =
    useState(null);

  const [historyOrderId, setHistoryOrderId] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState([]);

  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('measurement');

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setMessage('');
    setActiveTab('measurement');
  };

  const handleLogout = () => {
    setUser(null);
    setMessage('');
    setActiveTab('measurement');
    setTrackingOrderId('');
    setOrderInfo(null);
    setOrderStatusHistory([]);
    setCustomerOrders([]);
    setCustomerMeasurements([]);
    setEditingMeasurementId(null);
    setHistoryOrderId(null);
    setSelectedHistory([]);

    setMeasurement({
      chest: '',
      waist: '',
      hips: '',
      shoulder: ''
    });

    setOrder({
      designName: ''
    });
  };

  const loadDesigns = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/designs`);

      if (response.ok) {
        const data = await response.json();
        setDesigns(data);
      }
    } catch (error) {
      console.log('Failed to load designs');
    }
  };

  const loadCustomerOrders = async () => {
    if (!user || user.role !== 'CUSTOMER') {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/customer/${user.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setCustomerOrders(data);
      } else {
        setMessage('Failed to load order history.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const loadCustomerMeasurements = async () => {
    if (!user || user.role !== 'CUSTOMER') {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/measurements/customer/${user.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setCustomerMeasurements(data);
      } else {
        setMessage('Failed to load measurements.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const loadOrderStatusHistory = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/history`
      );

      if (response.ok) {
        const data = await response.json();
        setOrderStatusHistory(data);
      } else {
        setOrderStatusHistory([]);
      }
    } catch (error) {
      setOrderStatusHistory([]);
    }
  };

  const loadSelectedHistory = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/history`
      );

      if (response.ok) {
        const data = await response.json();
        setHistoryOrderId(orderId);
        setSelectedHistory(data);
      } else {
        setHistoryOrderId(orderId);
        setSelectedHistory([]);
      }
    } catch (error) {
      setHistoryOrderId(orderId);
      setSelectedHistory([]);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      loadCustomerOrders();
      loadCustomerMeasurements();
    }
  }, [user]);

  const handleMeasurementSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== 'CUSTOMER') {
      setMessage('Please login as a customer.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/measurements`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: Number(user.id),
            chest: Number(measurement.chest),
            waist: Number(measurement.waist),
            hips: Number(measurement.hips),
            shoulder: Number(measurement.shoulder)
          })
        }
      );

      if (response.ok) {
        setMessage(
          'Measurement saved successfully!'
        );

        setMeasurement({
          chest: '',
          waist: '',
          hips: '',
          shoulder: ''
        });

        await loadCustomerMeasurements();

        setActiveTab('myMeasurements');
      } else {
        setMessage('Failed to save measurement.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const startEditMeasurement = (item) => {
    setEditingMeasurementId(item.id);

    setMeasurement({
      chest: item.chest,
      waist: item.waist,
      hips: item.hips,
      shoulder: item.shoulder
    });

    setActiveTab('measurement');
    setMessage(
      'Edit your measurements and click Save Changes.'
    );
  };

  const updateMeasurement = async (e) => {
    e.preventDefault();

    if (!editingMeasurementId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/measurements/${editingMeasurementId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chest: Number(measurement.chest),
            waist: Number(measurement.waist),
            hips: Number(measurement.hips),
            shoulder: Number(measurement.shoulder)
          })
        }
      );

      if (response.ok) {
        setMessage(
          'Measurement updated successfully!'
        );

        setEditingMeasurementId(null);

        setMeasurement({
          chest: '',
          waist: '',
          hips: '',
          shoulder: ''
        });

        await loadCustomerMeasurements();

        setActiveTab('myMeasurements');
      } else {
        setMessage('Failed to update measurement.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const cancelEdit = () => {
    setEditingMeasurementId(null);

    setMeasurement({
      chest: '',
      waist: '',
      hips: '',
      shoulder: ''
    });

    setMessage('');
    setActiveTab('myMeasurements');
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== 'CUSTOMER') {
      setMessage('Please login as a customer.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: Number(user.id),
            designName: order.designName
          })
        }
      );

      if (response.ok) {
        const data = await response.json();

        setMessage(
          `Order placed successfully! Order ID: ${data.id}`
        );

        setTrackingOrderId(String(data.id));

        setOrder({
          designName: ''
        });

        await loadCustomerOrders();

        setActiveTab('history');
      } else {
        setMessage('Failed to place order.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (!trackingOrderId) {
      setMessage('Please enter an Order ID.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${trackingOrderId}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data) {
          setOrderInfo(data);
          await loadOrderStatusHistory(data.id);
          setMessage(
            'Order details loaded successfully.'
          );
        } else {
          setOrderInfo(null);
          setOrderStatusHistory([]);
          setMessage('Order not found.');
        }
      } else {
        setOrderInfo(null);
        setOrderStatusHistory([]);
        setMessage('Order not found.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const getStatusStep = (status) => {
    const steps = [
      'Order Placed',
      'Confirmed',
      'Stitching',
      'Ready',
      'Completed'
    ];

    return steps.indexOf(status);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return 'Not available';
    }

    return new Date(dateTime).toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'status status-completed';

      case 'Ready':
        return 'status status-ready';

      case 'Stitching':
        return 'status status-stitching';

      case 'Confirmed':
        return 'status status-confirmed';

      default:
        return 'status status-placed';
    }
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (user.role === 'TAILOR') {
    return (
      <TailorDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (user.role === 'ADMIN') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="customer-app">

      <header className="top-navbar">
        <div>
          <h2 className="brand-title">
            Custom Clothing
          </h2>

          <p className="brand-subtitle">
            Order & Measurement Management
          </p>
        </div>

        <div className="user-area">
          <div className="user-info">
            <strong>{user.name}</strong>
            <span>Customer ID: {user.id}</span>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">

        <div className="welcome-card">
          <div>
            <h1>
              Welcome, {user.name} 👋
            </h1>

            <p>
              Manage your measurements, clothing orders
              and order tracking from one place.
            </p>
          </div>

          <div className="dashboard-badge">
            CUSTOMER
          </div>
        </div>

        {message && (
          <div
            className={
              message.toLowerCase().includes('failed') ||
              message.toLowerCase().includes('not')
                ? 'message-box error-message'
                : 'message-box success-message'
            }
          >
            {message}
          </div>
        )}

        <div className="dashboard-tabs">
          <button
            onClick={() => {
              setActiveTab('measurement');
              setEditingMeasurementId(null);
            }}
            className={
              activeTab === 'measurement'
                ? 'tab-button active'
                : 'tab-button'
            }
          >
            📏 Measurements
          </button>

          <button
            onClick={() => {
              loadDesigns();
              setActiveTab('order');
            }}
            className={
              activeTab === 'order'
                ? 'tab-button active'
                : 'tab-button'
            }
          >
            👗 Order Form
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={
              activeTab === 'tracking'
                ? 'tab-button active'
                : 'tab-button'
            }
          >
            📦 Track Order
          </button>

          <button
            onClick={() => {
              loadCustomerOrders();
              setActiveTab('history');
            }}
            className={
              activeTab === 'history'
                ? 'tab-button active'
                : 'tab-button'
            }
          >
            🧾 Order History
          </button>

          <button
            onClick={() => {
              loadCustomerMeasurements();
              setActiveTab('myMeasurements');
            }}
            className={
              activeTab === 'myMeasurements'
                ? 'tab-button active'
                : 'tab-button'
            }
          >
            📐 My Measurements
          </button>
        </div>

        {activeTab === 'measurement' && (
          <section className="content-card">

            <div className="section-heading">
              <div>
                <h3>
                  {editingMeasurementId
                    ? 'Edit Your Measurements'
                    : 'Enter Your Measurements'}
                </h3>

                <p>
                  Save your measurements for accurate
                  custom stitching.
                </p>
              </div>

              <span className="customer-id-badge">
                Customer #{user.id}
              </span>
            </div>

            <form
              onSubmit={
                editingMeasurementId
                  ? updateMeasurement
                  : handleMeasurementSubmit
              }
              className="form-grid"
            >
              <div className="form-group">
                <label>Chest</label>

                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter chest measurement"
                  value={measurement.chest}
                  onChange={(e) =>
                    setMeasurement({
                      ...measurement,
                      chest: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Waist</label>

                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter waist measurement"
                  value={measurement.waist}
                  onChange={(e) =>
                    setMeasurement({
                      ...measurement,
                      waist: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Hips</label>

                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter hips measurement"
                  value={measurement.hips}
                  onChange={(e) =>
                    setMeasurement({
                      ...measurement,
                      hips: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Shoulder</label>

                <input
                  type="number"
                  step="0.1"
                  placeholder="Enter shoulder measurement"
                  value={measurement.shoulder}
                  onChange={(e) =>
                    setMeasurement({
                      ...measurement,
                      shoulder: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingMeasurementId
                    ? 'Save Changes'
                    : 'Save Measurement'}
                </button>

                {editingMeasurementId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {activeTab === 'myMeasurements' && (
          <section className="content-card">

            <div className="section-heading">
              <div>
                <h3>My Measurements</h3>
                <p>
                  Your saved measurements for custom orders.
                </p>
              </div>
            </div>

            {customerMeasurements.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📏</div>
                <h4>No measurements found</h4>
                <p>
                  Add your measurements to start a custom order.
                </p>
              </div>
            ) : (
              <div className="measurement-grid">
                {customerMeasurements.map((item) => (
                  <div
                    key={item.id}
                    className="measurement-card"
                  >
                    <div className="measurement-card-header">
                      <h4>
                        Measurement #{item.id}
                      </h4>

                      <button
                        onClick={() =>
                          startEditMeasurement(item)
                        }
                        className="edit-button"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="measurement-values">

                      <div>
                        <span>Chest</span>
                        <strong>{item.chest}</strong>
                      </div>

                      <div>
                        <span>Waist</span>
                        <strong>{item.waist}</strong>
                      </div>

                      <div>
                        <span>Hips</span>
                        <strong>{item.hips}</strong>
                      </div>

                      <div>
                        <span>Shoulder</span>
                        <strong>{item.shoulder}</strong>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'order' && (
          <section className="content-card">

            <div className="section-heading">
              <div>
                <h3>Place Custom Clothing Order</h3>
                <p>
                  Choose one of the available designs.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleOrderSubmit}
              className="order-form"
            >
              <div className="order-info-card">
                <span>Customer</span>
                <strong>{user.name}</strong>
                <small>Customer ID: {user.id}</small>
              </div>

              <div className="form-group">
                <label>Select Design</label>

                <select
                  value={order.designName}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      designName: e.target.value
                    })
                  }
                  required
                >
                  <option value="">
                    Select a Design
                  </option>

                  {designs.map((design) => (
                    <option
                      key={design.id}
                      value={design.name}
                    >
                      {design.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Place Order
              </button>
            </form>
          </section>
        )}

        {activeTab === 'tracking' && (
          <section className="content-card">

            <div className="section-heading">
              <div>
                <h3>Track Your Order</h3>
                <p>
                  Enter your order ID to view the latest
                  order status.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleTrackOrder}
              className="tracking-form"
            >
              <div className="form-group tracking-input">
                <label>Order ID</label>

                <input
                  type="number"
                  placeholder="Example: 5"
                  value={trackingOrderId}
                  onChange={(e) =>
                    setTrackingOrderId(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button"
              >
                Track Order
              </button>
            </form>

            {orderInfo && (
              <div className="tracking-result">

                <div className="order-summary-card">

                  <div>
                    <span>Order ID</span>
                    <strong>#{orderInfo.id}</strong>
                  </div>

                  <div>
                    <span>Design</span>
                    <strong>
                      {orderInfo.designName}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong
                      className={getStatusClass(
                        orderInfo.status
                      )}
                    >
                      {orderInfo.status}
                    </strong>
                  </div>

                  <div>
                    <span>Order Date</span>
                    <strong>
                      {orderInfo.orderDate ||
                        'Not available'}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery Date</span>
                    <strong>
                      {orderInfo.deliveryDate ||
                        'Not available'}
                    </strong>
                  </div>

                </div>

                <div className="progress-card">
                  <h4>Order Progress</h4>

                  <div className="status-timeline">
                    {[
                      'Order Placed',
                      'Confirmed',
                      'Stitching',
                      'Ready',
                      'Completed'
                    ].map((step, index) => {
                      const currentStep =
                        getStatusStep(
                          orderInfo.status
                        );

                      const completed =
                        index <= currentStep;

                      return (
                        <div
                          key={step}
                          className={
                            completed
                              ? 'timeline-item completed'
                              : 'timeline-item'
                          }
                        >
                          <div className="timeline-dot">
                            {completed
                              ? '✓'
                              : index + 1}
                          </div>

                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="history-card">
                  <h4>Status History</h4>

                  {orderStatusHistory.length === 0 ? (
                    <p>
                      No status history available.
                    </p>
                  ) : (
                    orderStatusHistory.map((history) => (
                      <div
                        key={history.id}
                        className="history-row"
                      >
                        <div>
                          <strong>
                            {history.status}
                          </strong>

                          <span>
                            {formatDateTime(
                              history.changedAt
                            )}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'history' && (
          <section className="content-card">

            <div className="section-heading">
              <div>
                <h3>My Order History</h3>
                <p>
                  View all your previous and current orders.
                </p>
              </div>

              <span className="count-badge">
                {customerOrders.length} Orders
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🧾</div>
                <h4>No orders found</h4>
                <p>
                  Your orders will appear here.
                </p>
              </div>
            ) : (
              <div className="orders-list">

                {customerOrders.map((orderItem) => (
                  <div
                    key={orderItem.id}
                    className="order-history-card"
                  >
                    <div className="order-history-top">
                      <div>
                        <span>Order</span>
                        <h4>
                          #{orderItem.id}
                        </h4>
                      </div>

                      <span
                        className={getStatusClass(
                          orderItem.status
                        )}
                      >
                        {orderItem.status}
                      </span>
                    </div>

                    <div className="order-history-details">

                      <div>
                        <span>Design</span>
                        <strong>
                          {orderItem.designName}
                        </strong>
                      </div>

                      <div>
                        <span>Order Date</span>
                        <strong>
                          {orderItem.orderDate ||
                            'Not available'}
                        </strong>
                      </div>

                      <div>
                        <span>Delivery Date</span>
                        <strong>
                          {orderItem.deliveryDate ||
                            'Not available'}
                        </strong>
                      </div>

                    </div>

                    <div className="order-history-actions">

                      <button
                        onClick={() => {
                          setTrackingOrderId(
                            String(orderItem.id)
                          );
                          setActiveTab('tracking');
                        }}
                        className="primary-button small-button"
                      >
                        Track Order
                      </button>

                      <button
                        onClick={() =>
                          loadSelectedHistory(
                            orderItem.id
                          )
                        }
                        className="history-button"
                      >
                        View Status History
                      </button>

                    </div>

                    {historyOrderId === orderItem.id && (
                      <div className="inline-history">

                        <h4>Status History</h4>

                        {selectedHistory.length === 0 ? (
                          <p>
                            No status history found.
                          </p>
                        ) : (
                          selectedHistory.map(
                            (history) => (
                              <div
                                key={history.id}
                                className="history-row"
                              >
                                <div>
                                  <strong>
                                    {history.status}
                                  </strong>

                                  <span>
                                    {formatDateTime(
                                      history.changedAt
                                    )}
                                  </span>
                                </div>
                              </div>
                            )
                          )
                        )}
                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}

export default App;