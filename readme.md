# FoodO - Multi-Service Food Delivery Platform

A comprehensive full-stack food delivery application with integrated ride-hailing services, built using the MERN stack.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)

## Overview

FoodO is a multi-service platform that combines food delivery and ride-hailing services. The platform consists of three main applications: customer frontend, shop/restaurant management dashboard, and ride-hailing interface, all powered by a Node.js backend with real-time communication via Socket.IO.

## Features

### Customer Features

- Browse restaurants and food items by category
- Advanced search and filtering options
- Shopping cart and wishlist functionality
- Real-time order tracking
- Multiple payment methods integration
- Order history and reordering
- User profile management
- Coupon code system
- Product ratings and reviews

### Restaurant/Shop Features

- Complete shop management dashboard
- Product inventory management
- Order management system
- Sales analytics and reporting
- Withdrawal request system
- Shop profile customization
- Product availability controls
- Coupon creation and management

### Ride Service Features

- Real-time ride booking
- Captain (driver) dashboard
- Live location tracking
- Ride history
- Fare calculation
- Multiple vehicle type support

### Admin Features

- User management
- Restaurant/shop verification
- Product moderation
- Order overview
- Withdrawal approvals
- Platform analytics

## Tech Stack

### Frontend

- React 18.2.0
- Redux Toolkit for state management
- React Router DOM v6
- Tailwind CSS for styling
- Material-UI Data Grid
- Axios for API calls
- Socket.IO Client for real-time features
- React Toastify for notifications
- React Lottie for animations
- Vite (for ride-frontend)

### Backend

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for email services
- CNIC and phone validation utilities
- Google Maps API integration

### Real-time Communication

- Socket.IO for live updates
- Real-time order notifications
- Live ride tracking
- Chat messaging system

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Clone Repository

```bash
git clone https://github.com/MuhammadJawadSaeed/foodO.git
cd foodO
```

### Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install ride-frontend dependencies
cd ../ride-frontend
npm install

# Install socket server dependencies
cd ../socket
npm install
```

## Environment Variables

Create a `.env` file in `backend/config/` directory:

```env
PORT=8000
DB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=7d
ACTIVATION_SECRET=your_activation_secret
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_PASSWORD=your_email_password
SMPT_MAIL=your_email@gmail.com
STRIPE_API_KEY=your_stripe_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Running the Application

### Development Mode

```bash
# Terminal 1 - Backend Server
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - Ride Frontend
cd ride-frontend
npm run dev

# Terminal 4 - Socket Server
cd socket
npm start
```

### Production Mode

```bash
# Backend
cd backend
npm start

# Frontend (build)
cd frontend
npm run build

# Ride Frontend (build)
cd ride-frontend
npm run build
```

### Quick Restart Scripts

Windows:

```bash
./restart-backend.bat
```

Linux/Mac:

```bash
./restart-backend.sh
```

## Key Features Implementation

### Real-time Updates

The application uses Socket.IO for real-time features:

- Order status updates
- Live ride tracking
- Chat messaging
- Notifications

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (User, Shop, Captain, Admin)
- Blacklist token system for logout
- Password encryption using bcrypt

### File Upload System

- Multer middleware for handling file uploads
- Support for product images
- Shop avatar and cover images
- Multiple image upload support

### Payment Integration

- Stripe payment gateway integration
- Secure payment processing
- Order confirmation system

### Location Services

- Google Maps API integration
- Real-time location tracking for rides
- Distance and fare calculation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Muhammad Jawad Saeed - GitHub: @MuhammadJawadSaeed

Project Link: https://github.com/MuhammadJawadSaeed/foodO
