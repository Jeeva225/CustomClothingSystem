import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

function TailorDashboard({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    if (!user || !user.id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/tailor/${user.id}`
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setMessage('Failed to load assigned orders.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status?status=${encodeURIComponent(
          status
        )}`,
        {
          method: 'PUT'
        }
      );

      if (response.ok) {
        setMessage('Order status updated successfully!');
        loadOrders();
      } else {
        setMessage('Failed to update order status.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const viewMeasurements = async (order) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/measurements/customer/${order.customerId}`
      );

      if (response.ok) {
        const data = await response.json();

        setSelectedOrder(order);
        setSelectedMeasurements(data);
        setMessage('Customer measurements loaded successfully.');
      } else {
        setSelectedOrder(order);
        setSelectedMeasurements([]);
        setMessage('Failed to load customer measurements.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const closeMeasurements = () => {
    setSelectedOrder(null);
    setSelectedMeasurements([]);
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

  return (
    <div className="customer-app">

      <header className="top-navbar">
        <div>
          <h2 className="brand-title">
            Custom Clothing
          </h2>

          <p className="brand-subtitle">
            Tailor Order Management
          </p>
        </div>

        <div className="user-area">
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>Tailor ID: {user?.id}</span>
          </div>

          <button
            onClick={onLogout}
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
              Welcome, {user?.name} 👋
            </h1>

            <p>
              Manage assigned customer orders, measurements
              and stitching progress.
            </p>
          </div>

          <div className="dashboard-badge">
            TAILOR
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

        {selectedOrder && (
          <section className="content-card measurement-panel">

            <div className="section-heading">
              <div>
                <h3>Customer Measurements</h3>

                <p>
                  Measurements for the selected order.
                </p>
              </div>

              <button
                onClick={closeMeasurements}
                className="secondary-button"
              >
                Close
              </button>
            </div>

            <div className="order-info-card">
              <span>Order</span>

              <strong>
                #{selectedOrder.id} - {selectedOrder.designName}
              </strong>

              <small>
                Customer ID: {selectedOrder.customerId}
              </small>
            </div>

            {selectedMeasurements.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📏</div>

                <h4>No measurements found</h4>

                <p>
                  This customer has no saved measurements.
                </p>
              </div>
            ) : (
              <div className="measurement-grid">

                {selectedMeasurements.map((item) => (
                  <div
                    key={item.id}
                    className="measurement-card"
                  >
                    <div className="measurement-card-header">
                      <h4>
                        Measurement #{item.id}
                      </h4>
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

        <section className="content-card">

          <div className="section-heading">
            <div>
              <h3>My Assigned Orders</h3>

              <p>
                Orders assigned to you by the admin.
              </p>
            </div>

            <span className="count-badge">
              {orders.length} Orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>

              <h4>No assigned orders</h4>

              <p>
                Orders assigned by the admin will appear here.
              </p>
            </div>
          ) : (
            <div className="orders-list">

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="order-history-card"
                >

                  <div className="order-history-top">

                    <div>
                      <span>Order</span>

                      <h4>
                        #{order.id}
                      </h4>
                    </div>

                    <span
                      className={getStatusClass(
                        order.status
                      )}
                    >
                      {order.status}
                    </span>

                  </div>

                  <div className="order-history-details">

                    <div>
                      <span>Customer ID</span>

                      <strong>
                        {order.customerId}
                      </strong>
                    </div>

                    <div>
                      <span>Design</span>

                      <strong>
                        {order.designName}
                      </strong>
                    </div>

                    <div>
                      <span>Order Date</span>

                      <strong>
                        {order.orderDate ||
                          'Not available'}
                      </strong>
                    </div>

                    <div>
                      <span>Delivery Date</span>

                      <strong>
                        {order.deliveryDate ||
                          'Not available'}
                      </strong>
                    </div>

                    <div>
                      <span>Current Status</span>

                      <strong
                        className={getStatusClass(
                          order.status
                        )}
                      >
                        {order.status}
                      </strong>
                    </div>

                  </div>

                  <div className="order-history-actions">

                    <button
                      onClick={() =>
                        viewMeasurements(order)
                      }
                      className="history-button"
                    >
                      View Measurements
                    </button>

                    <select
                      value={
                        order.status ||
                        'Order Placed'
                      }
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="status-select"
                    >
                      <option value="Order Placed">
                        Order Placed
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Stitching">
                        Stitching
                      </option>

                      <option value="Ready">
                        Ready
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default TailorDashboard;