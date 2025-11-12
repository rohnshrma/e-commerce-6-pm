# Postman Collection Guide

## What is Postman?

**Postman** is a popular API testing tool that allows you to:
- Send HTTP requests to your backend API
- Test endpoints without writing code
- Organize API requests in collections
- Save and reuse requests
- Automate testing workflows

## What is a Postman Collection?

A **Postman Collection** is a file (JSON format) that contains:
- Pre-configured API requests (endpoints)
- Request methods (GET, POST, PUT, DELETE)
- Headers and authentication
- Request body examples
- Organized folders for different API sections

**Think of it as a ready-made set of API requests** that you can import and use immediately!

---

## Why Use the Postman Collection?

### ✅ Benefits:

1. **Saves Time** - No need to manually create each request
2. **Pre-configured** - All endpoints are already set up
3. **Organized** - Requests grouped by feature (Auth, Products, Cart, etc.)
4. **Examples Included** - Sample request bodies provided
5. **Easy Testing** - Test the entire API quickly
6. **Learning Tool** - See how API requests should be structured

### 📋 What's Included in Our Collection:

- **Auth** - Register, Login, Password Reset
- **Users** - Profile management, Admin operations
- **Products** - CRUD operations
- **Cart** - Add, update, remove items
- **Orders** - Create and view orders
- **Payments** - Mock payment and webhook testing

---

## How to Use the Postman Collection

### Step 1: Install Postman

1. Download Postman from: https://www.postman.com/downloads/
2. Install it on your computer
3. Create a free account (optional but recommended)

### Step 2: Import the Collection

1. **Open Postman**
2. Click **"Import"** button (top left)
3. Choose one of these methods:
   - **File**: Select `postman_collection.json` from the project folder
   - **Link**: If hosted, paste the URL
   - **Raw Text**: Copy-paste the JSON content
4. Click **"Import"**
5. You should see "E-Commerce Backend API" collection in the left sidebar

### Step 3: Set Up Environment Variables

The collection uses variables to make testing easier:

1. In Postman, click the **"Environments"** tab (left sidebar)
2. Click **"+"** to create a new environment
3. Name it: `E-Commerce Local`
4. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000` | `http://localhost:5000` |
| `token` | (leave empty) | (leave empty) |

5. Click **"Save"**
6. Select this environment from the dropdown (top right)

**Why?** 
- `base_url` - Makes it easy to switch between local/dev/production
- `token` - Automatically saved after login (see Step 4)

### Step 4: Start Your Server

Before testing, make sure your backend is running:

```bash
# In your project directory
npm start
```

Server should be running on `http://localhost:5000`

### Step 5: Test Authentication (Login)

1. Expand the **"Auth"** folder in the collection
2. Click on **"Login"** request
3. The request body should already have example data:
   ```json
   {
     "email": "buyer@example.com",
     "password": "buyer123"
   }
   ```
4. Click **"Send"**
5. You should get a response with a `token`
6. **Important**: The token is automatically saved to `{{token}}` variable!

**Test Accounts** (from seed script):
- Admin: `admin@example.com` / `admin123`
- Vendor: `vendor@example.com` / `vendor123`
- Buyer: `buyer@example.com` / `buyer123`

### Step 6: Test Protected Endpoints

Now that you're logged in, the token is automatically used for protected routes:

1. Expand **"Products"** folder
2. Click **"Get All Products"** (this is public, no auth needed)
3. Click **"Send"** - Should return list of products
4. Click **"Create Product"** (requires vendor/admin role)
5. Notice the **Authorization** tab - it uses `Bearer {{token}}`
6. Click **"Send"** - Should create a product

**How it works:**
- The collection uses `{{token}}` in the Authorization header
- After login, the token is automatically saved
- All protected requests use this token automatically

---

## Common Testing Workflows

### Workflow 1: Buyer Flow (Shopping)

1. **Login as Buyer**
   - Use "Login" with `buyer@example.com` / `buyer123`
   
2. **Browse Products**
   - GET `/api/products` - See all products
   - Copy a product `_id` from the response

3. **Add to Cart**
   - POST `/api/cart`
   - Body: `{ "productId": "paste_id_here", "quantity": 2 }`

4. **View Cart**
   - GET `/api/cart` - See your cart items

5. **Create Order**
   - POST `/api/orders` - Creates order from cart
   - Copy the `orderId` from response

6. **Process Payment**
   - POST `/api/payments/mock`
   - Body: `{ "orderId": "paste_order_id_here" }`

7. **View Orders**
   - GET `/api/orders` - See your order history

### Workflow 2: Vendor Flow (Product Management)

1. **Login as Vendor**
   - Use "Login" with `vendor@example.com` / `vendor123`

2. **Create Product**
   - POST `/api/products`
   - Fill in title, description, price, stock, category

3. **View My Products**
   - GET `/api/products` - See all products (including yours)

4. **Update Product**
   - PUT `/api/products/:id` - Update your product
   - Replace `:id` with your product ID

5. **View Orders**
   - GET `/api/orders` - See orders containing your products

### Workflow 3: Admin Flow (Management)

1. **Login as Admin**
   - Use "Login" with `admin@example.com` / `admin123`

2. **View All Users**
   - GET `/api/users` - See all registered users

3. **View All Orders**
   - GET `/api/orders` - See all orders in the system

4. **Manage Products**
   - Can create, update, delete any product
   - Can modify vendor products too

---

## Understanding Request Components

### 1. Request Method
- **GET** - Retrieve data (no body needed)
- **POST** - Create new data (body required)
- **PUT** - Update existing data (body required)
- **DELETE** - Remove data (no body needed)

### 2. Request URL
- Uses `{{base_url}}` variable
- Example: `{{base_url}}/api/products`
- Becomes: `http://localhost:5000/api/products`

### 3. Headers
- **Content-Type**: `application/json` (for POST/PUT)
- **Authorization**: `Bearer {{token}}` (for protected routes)

### 4. Request Body
- Only for POST and PUT requests
- JSON format
- Example:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

### 5. Path Variables
- Some URLs have `:id` or `:productId`
- Replace these with actual IDs
- Example: `/api/products/:id` → `/api/products/507f1f77bcf86cd799439011`

---

## Tips & Tricks

### ✅ Best Practices:

1. **Always Login First** - Protected routes need authentication
2. **Check Response Status** - 200 = success, 400/401/403 = error
3. **Read Error Messages** - They tell you what went wrong
4. **Copy IDs** - You'll need product IDs, order IDs, etc.
5. **Test Incrementally** - Test one feature at a time

### 🔧 Troubleshooting:

**Problem**: "401 Unauthorized"
- **Solution**: Login again, token might have expired (1 hour expiry)

**Problem**: "404 Not Found"
- **Solution**: Check if server is running, check URL spelling

**Problem**: "400 Bad Request"
- **Solution**: Check request body format, required fields

**Problem**: "403 Forbidden"
- **Solution**: Check user role (buyer can't create products, etc.)

### 🎯 Pro Tips:

1. **Save Responses** - Right-click response → Save Response
2. **Create Examples** - Save successful responses as examples
3. **Use Variables** - Store IDs in variables for reuse
4. **Test Different Roles** - Login as different users to test permissions
5. **Check Console** - View server logs for debugging

---

## Collection Structure

```
E-Commerce Backend API
├── Auth
│   ├── Register Buyer
│   ├── Register Vendor
│   ├── Login (auto-saves token)
│   ├── Forgot Password
│   └── Reset Password
├── Users
│   ├── Get My Profile
│   ├── Update My Profile
│   ├── Get All Users (Admin)
│   └── Delete User (Admin)
├── Products
│   ├── Get All Products
│   ├── Get Single Product
│   ├── Create Product (Vendor/Admin)
│   ├── Update Product (Vendor/Admin)
│   └── Delete Product (Vendor/Admin)
├── Cart
│   ├── Get Cart
│   ├── Add to Cart
│   ├── Update Cart Item
│   ├── Remove from Cart
│   └── Clear Cart
├── Orders
│   ├── Create Order
│   ├── Get My Orders
│   └── Get Single Order
└── Payments
    ├── Mock Payment
    └── Webhook (Mock)
```

---

## Quick Start Checklist

- [ ] Install Postman
- [ ] Import `postman_collection.json`
- [ ] Create environment with `base_url` variable
- [ ] Start backend server (`npm start`)
- [ ] Run seed script (`npm run seed`)
- [ ] Login using "Login" request
- [ ] Test a public endpoint (GET products)
- [ ] Test a protected endpoint (GET cart)
- [ ] Complete a full workflow (login → add to cart → order → payment)

---

## Summary

The Postman collection is your **ready-to-use API testing toolkit**. It:
- Saves you from manually creating requests
- Provides examples for all endpoints
- Automatically handles authentication
- Organizes requests logically
- Makes testing fast and easy

**Just import, login, and start testing!** 🚀

---

## Need Help?

- Check server logs for errors
- Verify MongoDB is running
- Ensure environment variables are set
- Check that token is saved after login
- Review error messages in Postman responses

Happy Testing! 🎉

