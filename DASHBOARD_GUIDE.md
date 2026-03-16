# Admin & User Dashboard System

## Overview
This e-commerce platform now has **two separate dashboard systems**:

1. **Admin Dashboard** - For website administrators to manage the entire platform
2. **User Dashboard** - For customers to view their orders and manage their profile

---

## 🔐 Admin Dashboard

### Access
- **URL**: `http://localhost:5173/admin/login`
- **Default Credentials**:
  - Email: `admin@example.com`
  - Password: `password`

### Features
- **Dashboard Statistics**
  - Total Users
  - Total Products
  - Total Orders
  - Total Revenue
  
- **Product Management**
  - Add new products
  - Edit existing products
  - Delete products
  - Upload product images

- **Order Management**
  - View all orders
  - Update order status (pending, processing, shipped, delivered, cancelled)
  - View order details
  - Delete orders

- **User Management**
  - View all registered users
  - Delete users (except admin)
  - View user order history

### API Endpoints (Admin)
```
POST   /api/admin/login                    - Admin login
POST   /api/admin/logout                   - Admin logout
GET    /api/admin/me                       - Get admin profile

GET    /api/admin/dashboard/stats          - Dashboard statistics
GET    /api/admin/dashboard/users          - List all users
DELETE /api/admin/dashboard/users/{id}     - Delete user

GET    /api/admin/products                 - List products
POST   /api/admin/products                 - Create product
PUT    /api/admin/products/{id}            - Update product
DELETE /api/admin/products/{id}            - Delete product

GET    /api/admin/orders                   - List all orders
GET    /api/admin/orders/{id}              - View order details
PUT    /api/admin/orders/{id}/status       - Update order status
DELETE /api/admin/orders/{id}              - Delete order
```

---

## 👤 User Dashboard

### Access
- **URL**: `http://localhost:5173/user/dashboard`
- **Login Required**: Yes (regular customer account)

### Features
- **My Orders**
  - View all your orders
  - Check order status
  - View order details
  - Track order history

- **Profile Settings**
  - Update name
  - Update phone number
  - Update address
  - View email (read-only)

### API Endpoints (User)
```
GET    /api/user/orders                    - Get user's orders
GET    /api/user/orders/{id}               - Get order details
GET    /api/user/profile                   - Get user profile
PUT    /api/user/profile                   - Update user profile
```

---

## 🚀 How to Use

### For Admin:
1. Navigate to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. You'll be redirected to the admin dashboard
4. Manage products, orders, and users from the dashboard

### For Customers:
1. Register/Login as a normal user on the main website
2. After login, click on your profile dropdown in the header
3. Click "My Dashboard" to access your user dashboard
4. View your orders and update your profile

---

## 🔒 Security Features

- **Role-Based Access**: Admin routes are protected and only accessible to users with 'admin' role
- **Token Authentication**: Both admin and user sessions use Laravel Sanctum tokens
- **Separate Login Systems**: Admin and user login are completely separate
- **Protected Routes**: All dashboard routes require authentication

---

## 📝 Database Seeder

To create the default admin account, run:
```bash
php artisan db:seed --class=AdminSeeder
```

This creates an admin user with:
- Email: admin@example.com
- Password: password
- Role: admin

---

## 🎨 UI Features

### Admin Dashboard
- Dark professional navbar
- Statistics cards with icons
- Recent orders table
- Quick action buttons
- Responsive design

### User Dashboard
- Clean, modern interface
- Sidebar navigation
- Tabbed content (Orders/Profile)
- Order status badges
- Empty state messages

---

## 🔄 Navigation Flow

**Admin Flow:**
```
Admin Login → Admin Dashboard → Manage Products/Orders/Users → Logout
```

**User Flow:**
```
Website → Register/Login → Shop → Cart → Checkout → User Dashboard → View Orders
```

---

## 📱 Responsive Design

Both dashboards are fully responsive and work on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (320px+)

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 11
- Laravel Sanctum (Authentication)
- MySQL Database

**Frontend:**
- React 18
- React Router v6
- Bootstrap 5
- Font Awesome 6

---

## 📌 Important Notes

1. **Admin and User are separate** - They have different login pages and dashboards
2. **Admin cannot be deleted** - The system prevents deletion of admin users
3. **User Dashboard** is accessible from the main website header after login
4. **Admin Dashboard** is a completely separate interface without the main website header/footer

---

## 🎯 Future Enhancements

- Product image upload in admin panel
- Order filtering and search
- User analytics
- Email notifications
- Invoice generation
- Product categories management
- Bulk operations
