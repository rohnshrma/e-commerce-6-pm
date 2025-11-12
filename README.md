# E-Commerce Backend - MERN Stack

A student-friendly Node.js/Express/MongoDB backend for an e-commerce platform with JWT authentication, role-based access control, and payment integration.

## Features

- 🔐 JWT Authentication with bcrypt password hashing
- 👥 Role-based access control (Buyer, Vendor, Admin)
- 🛍️ Product management
- 🛒 Shopping cart functionality
- 📦 Order management
- 💳 Payment integration (Stripe or mock)
- ✅ Input validation with express-validator
- 🛡️ Security middleware (Helmet, CORS)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Payment**: Stripe (optional, mock available)

## Project Structure

```
e-commerce/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User management
│   │   ├── productController.js  # Product CRUD
│   │   ├── cartController.js    # Cart operations
│   │   ├── orderController.js   # Order management
│   │   └── paymentController.js  # Payment processing
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── roles.js              # Role-based access
│   │   ├── errorHandler.js       # Error handling
│   │   └── validate.js           # Validation middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Cart.js               # Cart schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── productRoutes.js      # Product endpoints
│   │   ├── cartRoutes.js         # Cart endpoints
│   │   ├── orderRoutes.js        # Order endpoints
│   │   └── paymentRoutes.js      # Payment endpoints
│   ├── services/
│   │   └── paymentService.js     # Stripe integration
│   ├── utils/
│   │   ├── generateToken.js      # JWT generation
│   │   └── resetToken.js         # Password reset token
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── seed/
│   └── seed.js                   # Database seeding script
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
├── plan.md                       # Detailed project plan
├── DEVELOPMENT_ORDER.md          # File creation order guide
└── README.md                     # This file
```

## 📚 Documentation

- **README.md** - This file (setup and usage guide)
- **plan.md** - Detailed API documentation with all routes
- **DEVELOPMENT_ORDER.md** - Step-by-step guide showing file creation order and reasoning (great for learning!)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohnshrma/e-commerce-6-pm.git
   cd e-commerce-6-pm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=1h
   SALT_ROUNDS=10
   # Optional: Stripe keys (leave empty to use mock payment)
   STRIPE_SECRET_KEY=
   STRIPE_PUBLISHABLE_KEY=
   ```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your machine
   - Atlas: Update `MONGO_URI` with your Atlas connection string

5. **Seed the database**
   ```bash
   npm run seed
   ```
   
   This creates:
   - Admin: `admin@example.com` / `admin123`
   - Vendor: `vendor@example.com` / `vendor123`
   - Buyer: `buyer@example.com` / `buyer123`
   - Sample products

6. **Start the server**
   ```bash
   npm start          # Production
   npm run dev        # Development (with nodemon)
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users` - List all users (Admin only)
- `DELETE /api/users/:id` - Deactivate user (Admin only)

### Products
- `GET /api/products` - List products (with pagination & filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Vendor/Admin)
- `PUT /api/products/:id` - Update product (Vendor/Admin)
- `DELETE /api/products/:id` - Delete product (Vendor/Admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get orders (role-based)
- `GET /api/orders/:id` - Get single order

### Payments
- `POST /api/payments/webhook` - Payment webhook (Stripe or mock)
- `POST /api/payments/mock` - Mock payment (for testing)

## Postman Testing

### Import Collection

1. Import the `postman_collection.json` file into Postman
2. Set up environment variables in Postman:
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set automatically after login)

### Testing Flow

1. **Register/Login**
   - POST `/api/auth/register` (create a buyer)
   - POST `/api/auth/login` → copy the token
   - Set token in Postman: Authorization → Bearer Token

2. **Browse Products**
   - GET `/api/products`
   - GET `/api/products/:id`

3. **Cart Operations**
   - POST `/api/cart` (add product)
   - GET `/api/cart` (view cart)
   - PUT `/api/cart` (update quantity)
   - DELETE `/api/cart/:productId` (remove item)

4. **Create Order**
   - POST `/api/orders` → receive payment info

5. **Process Payment**
   - POST `/api/payments/mock` (with orderId)
   - Or use Stripe if configured

6. **View Orders**
   - GET `/api/orders`
   - GET `/api/orders/:id`

### Testing Webhook (Mock)

Send POST request to `/api/payments/webhook` with:
```json
{
  "token": "test_webhook_token",
  "orderId": "your_order_id",
  "status": "paid",
  "paymentIntentId": "mock_pi_123"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 1h) |
| `SALT_ROUNDS` | Bcrypt salt rounds | No (default: 10) |
| `STRIPE_SECRET_KEY` | Stripe secret key | No (optional) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No (optional) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | No (optional) |

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with express-validator
- Helmet for security headers
- CORS configuration
- Request body size limits

## Notes for Students

- **No Refresh Tokens**: JWT tokens expire in 1 hour. For production, implement refresh tokens.
- **Password Reset**: Returns token in API response for Postman testing. In production, send via email.
- **Mock Payment**: Use `/api/payments/mock` if Stripe is not configured.
- **Webhook Testing**: Use `{ token: 'test_webhook_token' }` for Postman testing.
- **Vendor Ownership**: Vendors can only modify their own products. Admins can modify any product.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For Atlas, whitelist your IP address

### JWT Errors
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration (default: 1 hour)
- Ensure token is sent in `Authorization: Bearer <token>` header

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

## License

ISC

## Contributing

This is a student project. Feel free to fork and modify for learning purposes.

