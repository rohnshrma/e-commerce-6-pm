# E-Commerce Backend - Project Plan

> 📚 **Related Documentation:**
> - [README.md](./README.md) - Setup and usage guide
> - [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Complete Postman testing guide
> - [DEVELOPMENT_ORDER.md](./DEVELOPMENT_ORDER.md) - File creation order guide

## Project Overview

This is a student-friendly MERN backend for an e-commerce platform. It provides a simple, well-organized Node.js/Express/MongoDB backend with JWT authentication, role-based access control, and basic payment integration (Stripe or mock).

## User Roles & Capabilities

### Buyer
- Register, login, logout
- View product list and single product details
- Add/remove/update items in cart
- Create orders and process payments
- View own profile and order history

### Vendor
- Register, login, logout
- Add, edit, and delete their own products
- View orders containing their products

### Admin
- Created via seed script or protected route
- View all users and orders
- Manage products and vendors (can modify any product)

## API Routes

### Authentication (`/api/auth`)
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/api/auth/register` | Register new user (buyer or vendor) | Public |
| POST | `/api/auth/login` | Login user, returns JWT | Public |
| POST | `/api/auth/forgot-password` | Generate reset token (returns in response for Postman) | Public |
| POST | `/api/auth/reset-password` | Reset password using token | Public |

### Users (`/api/users`)
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/api/users/me` | Get current user profile | Private |
| PUT | `/api/users/me` | Update current user profile | Private |
| GET | `/api/users` | List all users | Admin |
| DELETE | `/api/users/:id` | Soft delete user (deactivate) | Admin |

### Products (`/api/products`)
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/api/products` | List products (pagination, filters) | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Vendor/Admin |
| PUT | `/api/products/:id` | Update product (vendor: own only) | Vendor/Admin |
| DELETE | `/api/products/:id` | Delete product (vendor: own only) | Vendor/Admin |

### Cart (`/api/cart`)
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/api/cart` | Get user's cart | Buyer |
| POST | `/api/cart` | Add item to cart | Buyer |
| PUT | `/api/cart` | Update item quantity | Buyer |
| DELETE | `/api/cart/:productId` | Remove item from cart | Buyer |
| DELETE | `/api/cart` | Clear entire cart | Buyer |

### Orders (`/api/orders`)
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/api/orders` | Create order from cart, returns payment info | Buyer |
| GET | `/api/orders` | Get orders (buyer: own, vendor: with their products, admin: all) | Private |
| GET | `/api/orders/:id` | Get single order (role-protected) | Private |

### Payments (`/api/payments`)
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/api/payments/webhook` | Webhook endpoint (Stripe or mock) | Public |
| POST | `/api/payments/mock` | Mock payment for testing without Stripe | Buyer |

## Controllers

- **authController**: register, login, forgotPassword, resetPassword
- **userController**: getMe, updateMe, getUsers, deleteUser
- **productController**: getProducts, getProduct, createProduct, updateProduct, deleteProduct
- **cartController**: getCart, addToCart, updateCart, removeFromCart, clearCart
- **orderController**: createOrder, getOrders, getOrder
- **paymentController**: handleWebhook, mockPayment

## Database Models

### User
- `_id` (ObjectId)
- `name` (String, required)
- `email` (String, unique, required)
- `passwordHash` (String, required, hashed with bcrypt)
- `role` (Enum: 'buyer', 'vendor', 'admin')
- `profile` (Object: address, phone)
- `isActive` (Boolean, default: true)
- `timestamps` (createdAt, updatedAt)

### Product
- `_id` (ObjectId)
- `title` (String, required)
- `description` (String, required)
- `price` (Number, required, min: 0)
- `stock` (Number, required, min: 0)
- `images` (Array of Strings)
- `category` (String, required)
- `vendor` (ObjectId, ref: User, required)
- `timestamps` (createdAt, updatedAt)

### Cart
- `_id` (ObjectId)
- `user` (ObjectId, ref: User, unique, required)
- `items` (Array: { product: ObjectId, quantity: Number, priceSnapshot: Number })
- `timestamps` (createdAt, updatedAt)

### Order
- `_id` (ObjectId)
- `user` (ObjectId, ref: User, required)
- `items` (Array: { product: ObjectId, quantity: Number, priceSnapshot: Number })
- `totalAmount` (Number, required)
- `paymentStatus` (Enum: 'pending', 'paid', 'failed')
- `paymentMethod` (String, default: 'stripe')
- `paymentIntentId` (String)
- `timestamps` (createdAt, updatedAt)

## Typical Flow

1. **Register** → POST `/api/auth/register` (buyer or vendor)
2. **Login** → POST `/api/auth/login` → receive JWT token
3. **Browse Products** → GET `/api/products`
4. **Add to Cart** → POST `/api/cart` (as buyer)
5. **View Cart** → GET `/api/cart`
6. **Create Order** → POST `/api/orders` → receive payment client secret
7. **Process Payment** → POST `/api/payments/mock` or use Stripe
8. **View Orders** → GET `/api/orders`

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
SALT_ROUNDS=10
STRIPE_SECRET_KEY=sk_test_... (optional)
STRIPE_PUBLISHABLE_KEY=pk_test_... (optional)
STRIPE_WEBHOOK_SECRET=whsec_... (optional)
```

## How to Run

1. Install dependencies: `npm install`
2. Create `.env` file from `.env.example`
3. Start MongoDB (local or Atlas)
4. Run seed script: `npm run seed`
5. Start server: `npm start` or `npm run dev`
6. Test endpoints with Postman

## Postman Testing

> 📖 **For detailed Postman setup and usage, see [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)**

**Quick Steps:**
1. Import the `postman_collection.json` file into Postman
2. Register a buyer: POST `/api/auth/register`
3. Login: POST `/api/auth/login` → token auto-saves
4. Browse products: GET `/api/products`
5. Add to cart: POST `/api/cart`
6. Create order: POST `/api/orders`
7. Process payment: POST `/api/payments/mock`
8. View orders: GET `/api/orders`

## Notes

- Passwords are hashed with bcrypt (10 rounds by default)
- JWT tokens expire in 1 hour (configurable)
- No refresh tokens (simplified for students)
- Password reset returns token in response (for Postman testing)
- Webhook can be simulated with `{ token: 'test_webhook_token', orderId: '...', status: 'paid' }`
- Mock payment endpoint available if Stripe is not configured
- Vendors can only modify their own products (ownership check)
- Admin can modify any product

