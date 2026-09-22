import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [tailors, setTailors] = useState([]);

  const [designForm, setDesignForm] = useState({
    name: '',
    description: ''
  });

  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const usersResponse = await fetch(
        `${API_BASE_URL}/users/all`
      );

      const ordersResponse = await fetch(
        `${API_BASE_URL}/orders/all`
      );

      const designsResponse = await fetch(
        `${API_BASE_URL}/designs`
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();

        setUsers(usersData);

        const tailorUsers = usersData.filter(
          (user) => user.role === 'TAILOR'
        );

        setTailors(tailorUsers);
      }

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }

      if (designsResponse.ok) {
        const designsData = await designsResponse.json();
        setDesigns(designsData);
      }

      setMessage('Admin data loaded successfully.');
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
        loadData();
      } else {
        setMessage('Failed to update order status.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const assignTailor = async (orderId, tailorId) => {
    if (!tailorId) {
      setMessage('Please select a tailor.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/assign-tailor?tailorId=${tailorId}`,
        {
          method: 'PUT'
        }
      );

      if (response.ok) {
        setMessage('Tailor assigned successfully!');
        loadData();
      } else {
        const errorText = await response.text();
        setMessage(
          errorText || 'Failed to assign tailor.'
        );
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const deleteUser = async (userId, userRole) => {
    if (userRole === 'ADMIN') {
      setMessage('Admin account cannot be deleted.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}`,
        {
          method: 'DELETE'
        }
      );

      if (response.ok) {
        setMessage('User deleted successfully!');
        loadData();
      } else {
        setMessage('Failed to delete user.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const handleDesignChange = (e) => {
    setDesignForm({
      ...designForm,
      [e.target.name]: e.target.value
    });
  };

  const addDesign = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/designs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: designForm.name,
            description: designForm.description
          })
        }
      );

      if (response.ok) {
        setMessage('Design added successfully!');

        setDesignForm({
          name: '',
          description: ''
        });

        loadData();
      } else {
        setMessage('Failed to add design.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const deleteDesign = async (designId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this design?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/designs/${designId}`,
        {
          method: 'DELETE'
        }
      );

      if (response.ok) {
        setMessage('Design deleted successfully!');
        loadData();
      } else {
        setMessage('Failed to delete design.');
      }
    } catch (error) {
      setMessage('Backend is not running');
    }
  };

  const getTailorName = (tailorId) => {
    const tailor = tailors.find(
      (user) => user.id === tailorId
    );

    return tailor ? tailor.name : 'Not Assigned';
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
            Admin Management Dashboard
          </p>
        </div>

        <div className="user-area">
          <div className="user-info">
            <strong>Admin</strong>
            <span>Administrator</span>
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
              Admin Dashboard ⚙️
            </h1>

            <p>
              Manage users, clothing designs, orders and
              tailor assignments.
            </p>
          </div>

          <div className="dashboard-badge">
            ADMIN
          </div>
        </div>

        {message && (
          <div
            className={
              message.toLowerCase().includes('failed') ||
              message.toLowerCase().includes('not') ||
              message.toLowerCase().includes('cannot')
                ? 'message-box error-message'
                : 'message-box success-message'
            }
          >
            {message}
          </div>
        )}

        <div className="admin-summary-grid">

          <div className="admin-stat-card">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Tailors</span>
            <strong>{tailors.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Designs</span>
            <strong>{designs.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

        </div>

        <section className="content-card">

          <div className="section-heading">
            <div>
              <h3>Design Management</h3>

              <p>
                Add and manage available clothing designs.
              </p>
            </div>

            <span className="count-badge">
              {designs.length} Designs
            </span>
          </div>

          <form
            onSubmit={addDesign}
            className="admin-design-form"
          >
            <div className="form-group">
              <label>Design Name</label>

              <input
                type="text"
                name="name"
                placeholder="Example: Anarkali"
                value={designForm.name}
                onChange={handleDesignChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                name="description"
                placeholder="Enter design description"
                value={designForm.description}
                onChange={handleDesignChange}
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              + Add Design
            </button>
          </form>

          <div className="admin-table-wrapper">

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Design Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {designs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="empty-table-cell"
                    >
                      No designs available.
                    </td>
                  </tr>
                ) : (
                  designs.map((design) => (
                    <tr key={design.id}>
                      <td>#{design.id}</td>

                      <td>
                        <strong>
                          {design.name}
                        </strong>
                      </td>

                      <td>
                        {design.description}
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            deleteDesign(design.id)
                          }
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>

        </section>

        <section className="content-card">

          <div className="section-heading">
            <div>
              <h3>User Management</h3>

              <p>
                View registered customers and tailors.
              </p>
            </div>

            <span className="count-badge">
              {users.length} Users
            </span>
          </div>

          <div className="admin-table-wrapper">

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>

                    <td>#{user.id}</td>

                    <td>
                      <strong>{user.name}</strong>
                    </td>

                    <td>{user.email}</td>

                    <td>{user.phone}</td>

                    <td>
                      <span
                        className={
                          user.role === 'ADMIN'
                            ? 'role-badge admin-role'
                            : user.role === 'TAILOR'
                            ? 'role-badge tailor-role'
                            : 'role-badge customer-role'
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.role === 'ADMIN' ? (
                        <span className="protected-label">
                          Protected
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            deleteUser(
                              user.id,
                              user.role
                            )
                          }
                          className="delete-button"
                        >
                          Delete
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>

        </section>

        <section className="content-card">

          <div className="section-heading">
            <div>
              <h3>Order Management</h3>

              <p>
                Assign tailors and update order progress.
              </p>
            </div>

            <span className="count-badge">
              {orders.length} Orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>

              <h4>No orders found</h4>

              <p>
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Design</th>
                    <th>Status</th>
                    <th>Tailor</th>
                    <th>Assign</th>
                    <th>Update</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>

                      <td>
                        <strong>
                          #{order.id}
                        </strong>
                      </td>

                      <td>
                        Customer #{order.customerId}
                      </td>

                      <td>
                        <strong>
                          {order.designName}
                        </strong>

                        <small className="table-subtext">
                          {order.orderDate ||
                            'No date'}
                        </small>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            order.status
                          )}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        {getTailorName(
                          order.tailorId
                        )}
                      </td>

                      <td>
                        <select
                          value={
                            order.tailorId || ''
                          }
                          onChange={(e) =>
                            assignTailor(
                              order.id,
                              e.target.value
                            )
                          }
                          className="status-select"
                        >
                          <option value="">
                            Select Tailor
                          </option>

                          {tailors.map((tailor) => (
                            <option
                              key={tailor.id}
                              value={tailor.id}
                            >
                              {tailor.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
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
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;