# Problem Statement

## 1. Title
Custom Clothing Order & Measurement Management Platform

## 2. Domain
E-Commerce / Fashion Technology / Order Management System

## 3. Who is the user? (2-3 user types, with roles)
- **Customer** – Selects clothing designs, provides measurements, places orders, and tracks order status.
- **Tailor** – Views customer measurements, manages clothing orders, and updates stitching progress.
- **Admin** – Manages customers, tailors, orders, designs, and overall platform activities.

## 4. What problem are we solving?
Traditional tailoring businesses often manage customer measurements and orders manually using notebooks, paper records, or phone messages. This can lead to incorrect measurements, misplaced records, order delays, and difficulty in tracking order status. Customers may also have to repeatedly contact the tailor to know whether their order is ready. For example, a customer who orders a custom dress may need to visit the shop multiple times to provide measurements and check the stitching progress.

## 5. Proposed Solution
The proposed platform will provide a centralized system to manage custom clothing orders and customer measurements.

Key features include:
- Customer registration and login.
- Customer measurement storage and management.
- Clothing design and category management.
- Custom clothing order placement.
- Order status tracking.
- Tailor assignment and order management.
- Measurement history for future orders.
- Admin dashboard for managing customers, tailors, designs, and orders.
- Notifications for important order status updates.

## 6. Core Entities / Database Tables
1. Users
2. Customers
3. Tailors
4. Clothing Designs
5. Measurements
6. Orders
7. Order Items
8. Payments
9. Order Status
10. Notifications

## 7. User Roles & Permissions

### Admin
- Manage customers and tailors.
- Add, update, and remove clothing designs.
- View and manage all orders.
- Assign orders to tailors.
- Monitor order status and payments.

### Customer
- Register and login.
- Manage personal measurements.
- Browse clothing designs.
- Place custom clothing orders.
- View order history.
- Track order status.

### Tailor
- View assigned orders.
- Access customer measurements.
- Update stitching progress.
- Update order status.
- View completed and pending orders.

## 8. Success Criteria
- A customer should be able to place a custom clothing order in under 5 minutes.
- Customer measurements should be stored securely and easily accessible for future orders.
- Tailors should be able to view assigned orders and measurements without searching through physical records.
- Customers should be able to track their order status online.
- The system should reduce measurement errors and order-management issues.

## 9. Out of Scope
- Physical delivery management.
- Advanced AI-based clothing design generation.
- Automated body measurement using cameras.
- Real-time GPS tracking of delivery.
- Integration with external tailoring machines.
- International payment gateway integration.

## 10. Chosen Track
Java (Spring Boot)