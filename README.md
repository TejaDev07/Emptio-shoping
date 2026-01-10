# Emptio E-commerce Platform

A complete Amazon-style e-commerce platform with separate user and admin frontends sharing a common backend.

## Architecture

```
Emptio/
├── backend/ (Shared API server)
├── user-frontend/ (Customer-facing app)
└── admin-frontend/ (Admin dashboard)
```

## Features

### User Frontend
- User registration and login
- Product browsing and search
- Shopping cart and wishlist
- Order placement and tracking
- Responsive design

### Admin Frontend
- Admin login with role-based access
- Order management dashboard
- Order status updates
- Customer order tracking
- Real-time statistics

### Backend
- RESTful API with JWT authentication
- Role-based authorization (user/admin)
- Order management with status tracking
- Email notifications (Nodemailer)
- MongoDB database

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT, Nodemailer
- **Frontend**: React, Vite, React Router, Tailwind CSS
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v20.19+ recommended)
- MongoDB
- Email service (Gmail or other SMTP)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/emptio
JWT_SECRET=your_jwt_secret_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=Emptio
```

Start the backend:

```bash
npm run dev
```

### 2. User Frontend Setup

```bash
cd user-frontend
npm install
npm run dev
```

The user frontend will run on `http://localhost:5173`

### 3. Admin Frontend Setup

```bash
cd admin-frontend
npm install
npm run dev
```

The admin frontend will run on `http://localhost:5174`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User/Admin login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Orders (User)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### Admin Orders
- `GET /api/admin/orders` - Get all orders (Admin only)
- `GET /api/admin/orders/stats` - Get order statistics (Admin only)
- `GET /api/admin/orders/:id` - Get order details (Admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (Admin only)

## Order Status Flow

1. **PLACED** - Order created by customer
2. **CONFIRMED** - Admin confirms the order
3. **SHIPPED** - Order shipped
4. **OUT_FOR_DELIVERY** - Order out for delivery
5. **DELIVERED** - Order delivered successfully

## Email Notifications

The system sends automated emails for:
- Order confirmation (when placed)
- Order status updates (when admin changes status)

## Default Admin User

To create an admin user, register a normal user and then manually update the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Development

### Running All Services

1. Start MongoDB
2. Start backend: `cd backend && npm run dev`
3. Start user frontend: `cd user-frontend && npm run dev`
4. Start admin frontend: `cd admin-frontend && npm run dev`

### Testing

- User frontend: `http://localhost:5173`
- Admin frontend: `http://localhost:5174`
- API: `http://localhost:5000`

## Production Deployment

1. Build the frontends:
   ```bash
   cd user-frontend && npm run build
   cd admin-frontend && npm run build
   ```

2. Serve the built files using a web server (nginx, Apache, etc.)

3. Deploy backend to a server with PM2 or similar process manager

## Security Features

- JWT authentication with role-based access
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Secure API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request