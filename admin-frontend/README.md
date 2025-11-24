# FoodO Admin Frontend

Separate admin dashboard for super admin access to manage the entire FoodO platform.

## 🚀 Features

- **User Management**: View, manage, and delete users
- **Seller Management**: Approve/reject sellers, view seller details
- **Product Management**: Monitor all products across platform
- **Order Management**: View and manage all orders system-wide
- **Withdrawal Management**: Process seller withdrawal requests
- **Dashboard Analytics**: Overview of platform statistics

## 🛠️ Tech Stack

- **React** 18.2.0
- **Redux Toolkit** - State management
- **Material-UI** v4 - Data grids and UI components
- **React Router** v6 - Navigation
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **React Toastify** - Notifications

## 📦 Installation

### Prerequisites

- Node.js 14+ installed
- Backend running on port 8000
- Admin user account with role "Admin"

### Setup Steps

1. **Install dependencies:**

   ```bash
   cd admin-frontend
   npm install --legacy-peer-deps
   ```

2. **Configure environment:**

   - Check `.env` file (already configured)
   - PORT=3001
   - REACT_APP_SERVER_URL=http://localhost:8000

3. **Start the application:**

   ```bash
   npm start
   ```

4. **Access admin panel:**
   - Open http://localhost:3001
   - Login with admin credentials

## 🔐 Authentication

Only users with `role: "Admin"` can access the admin panel. Regular users and sellers will be redirected even if they try to access admin routes.

### Admin Login Flow:

1. Navigate to `/admin-login`
2. Enter admin email and password
3. System verifies role === "Admin"
4. Redirect to admin dashboard

## 📁 Project Structure

```
admin-frontend/
├── public/              # Static files
├── src/
│   ├── components/
│   │   ├── Admin/      # Admin dashboard components
│   │   │   ├── AdminDashboardMain.jsx
│   │   │   ├── AllProducts.jsx
│   │   │   ├── AllSellers.jsx
│   │   │   ├── AllUsers.jsx
│   │   │   ├── AllWithdraw.jsx
│   │   │   └── Layout/
│   │   │       └── AdminSideBar.jsx
│   │   └── Layout/
│   │       ├── AdminHeader.jsx
│   │       └── AdminSideBar.jsx
│   ├── pages/          # Page components
│   │   ├── AdminLoginPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AdminDashboardUsers.jsx
│   │   ├── AdminDashboardSellers.jsx
│   │   ├── AdminDashboardOrders.jsx
│   │   ├── AdminDashboardProducts.jsx
│   │   └── AdminDashboardWithdraw.jsx
│   ├── redux/
│   │   ├── actions/    # Redux actions
│   │   ├── reducers/   # Redux reducers
│   │   └── store.js    # Redux store config
│   ├── routes/
│   │   └── ProtectedAdminRoute.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── server.js       # Backend URL config
├── .env
├── package.json
└── README.md
```

## 🔗 API Integration

Admin frontend connects to backend at `http://localhost:8000`

### Main Endpoints Used:

- `POST /user/login-user` - Admin login
- `GET /user/admin-all-users` - Fetch all users
- `GET /shop/admin-all-sellers` - Fetch all sellers
- `GET /product/admin-all-products` - Fetch all products
- `GET /order/admin-all-orders` - Fetch all orders
- `GET /withdraw/get-all-withdraw-request` - Fetch withdrawals
- `DELETE /user/delete-user/:id` - Delete user
- `DELETE /shop/delete-seller/:id` - Delete seller

## 🎨 Styling

- Orange theme (#f97316, orange-500/600) consistent with main frontend
- Gradient backgrounds and modern card layouts
- Responsive design for all screen sizes
- Material-UI Data Grid for tables

## 🚦 Running Multiple Frontends

### Option 1: Individual Startup

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Main Frontend
cd frontend
npm start

# Terminal 3 - Admin Frontend
cd admin-frontend
npm start

# Terminal 4 - Ride Frontend (optional)
cd ride-frontend
npm run dev
```

### Option 2: Startup Script (Recommended)

```bash
# Windows
start-all.bat

# Linux/Mac
bash start-all.sh
```

## 🔒 Security Features

### Current Implementation:

- Role-based authentication (Admin only)
- Protected routes with ProtectedAdminRoute
- Credentials included in API requests
- CORS configured for specific origins

### Recommended Enhancements:

- Two-factor authentication (2FA)
- IP whitelisting for admin access
- Admin action logging
- Session timeout
- Rate limiting on admin endpoints
- Admin activity audit trail

## 📊 Dashboard Pages

### 1. Dashboard Overview (`/admin/dashboard`)

- Total users, sellers, products
- Recent orders overview
- Platform statistics

### 2. Users Management (`/admin-users`)

- View all registered users
- User details (email, role, join date)
- Delete user accounts

### 3. Sellers Management (`/admin-sellers`)

- View all sellers
- Seller details and shop info
- Approve/reject seller accounts
- Delete seller accounts

### 4. Products Management (`/admin-products`)

- View all products platform-wide
- Product details and pricing
- Monitor product listings

### 5. Orders Management (`/admin-orders`)

- View all orders
- Order details and status
- Update order status

### 6. Withdrawals Management (`/admin-withdraw`)

- Process seller withdrawal requests
- Approve/reject withdrawals
- Withdrawal history

## 🌐 Deployment

### Development:

- Main Frontend: http://localhost:3000
- Admin Frontend: http://localhost:3001
- Backend: http://localhost:8000

### Production (Recommended):

- Main Frontend: https://foodo.com
- Admin Frontend: https://admin.foodo.com (subdomain)
- Backend: https://api.foodo.com

Update `.env` for production URLs.

## 🐛 Troubleshooting

### Port 3001 already in use:

```bash
# Find and kill process on port 3001
npx kill-port 3001
# Or change PORT in .env file
```

### CORS errors:

- Ensure backend CORS includes http://localhost:3001
- Check backend/app.js origin array

### Cannot access admin routes:

- Verify user role is "Admin" in database
- Check ProtectedAdminRoute implementation
- Clear browser cache and cookies

### Dependencies conflict:

```bash
# Reinstall with legacy peer deps
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📝 Environment Variables

```env
PORT=3001
REACT_APP_SERVER_URL=http://localhost:8000
REACT_APP_MAIN_FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

When adding new admin features:

1. Create new page in `src/pages/`
2. Add route in `src/App.js`
3. Wrap route with `ProtectedAdminRoute`
4. Create corresponding backend endpoint
5. Test thoroughly with admin account

## 📄 License

Part of FoodO platform - Private project

## 👥 Contact

For admin access issues, contact system administrator.
