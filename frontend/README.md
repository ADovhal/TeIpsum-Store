# TeIpsum Frontend - Modern E-commerce Store

A comprehensive React-based e-commerce frontend with modern UI/UX, advanced filtering, cart management, and admin functionality.

## 🚀 Features

### 🛍️ Store & Shopping Experience
- **Modern Product Grid/List View** - Toggle between grid and list layouts
- **Advanced Product Filtering** - Filter by category, price range, and ratings
- **Real-time Search** - Search products by name with instant results
- **Product Cards with Ratings** - Star ratings and product badges (NEW, SALE)
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Pagination** - Efficient product browsing with page navigation

### 🛒 Cart Management
- **Shopping Cart Sidebar** - Slide-out cart with real-time updates
- **Quantity Controls** - Increment/decrement product quantities
- **Cart Persistence** - Cart items saved in Redux store
- **Cart Total Calculation** - Automatic price calculations
- **Bulk Actions** - Clear cart, remove individual items

### 💳 Checkout & Orders
- **Complete Checkout Flow** - Shipping and payment information forms
- **Order Confirmation** - Success page with order details
- **Order History** - View past orders in user profile
- **Order Status Tracking** - Visual status indicators

### 👤 User Management
- **User Authentication** - Login/Register with JWT tokens
- **Profile Management** - Update personal information
- **Order History** - View and track past orders
- **Settings Panel** - User preferences and account settings

### 🔐 Admin Panel (Role-based Access)
- **Product Management** - CRUD operations for products
- **Bulk Operations** - Select and manage multiple products
- **User Management** - Create and manage admin users
- **Order Management** - View and update order statuses
- **Analytics Dashboard** - Sales and performance metrics
- **Role-based Security** - Admin-only access with PreAuthorize

## 🛠️ Technical Stack

### Frontend Technologies
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with RTK Query
- **Styled Components** - CSS-in-JS for component styling
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend Integration
- **Catalog Service** - Product listing and filtering
- **Admin Product Service** - Product management (admin only)
- **Auth Service** - User authentication and authorization
- **User Service** - User profile management

### Key Features
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Admin and user role management
- **Responsive Design** - Mobile-first approach
- **Error Handling** - Comprehensive error management
- **Loading States** - User feedback during operations

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header/         # Navigation and cart
│   │   ├── Footer/         # Site footer
│   │   └── store/          # Store-specific components
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication
│   │   ├── cart/           # Shopping cart
│   │   ├── products/       # Product management
│   │   ├── profile/        # User profile
│   │   └── admin/          # Admin functionality
│   ├── pages/              # Page components
│   │   ├── StorePage.js    # Main store page
│   │   ├── CheckoutPage.js # Checkout process
│   │   ├── ProfilePage.js  # User profile
│   │   └── AdminProductPage.js # Admin product management
│   ├── services/           # API services
│   │   ├── apiAuth.js      # Authentication API
│   │   ├── apiProduct.js   # Product API
│   │   ├── apiUser.js      # User API
│   │   └── apiAdmin.js     # Admin API
│   ├── redux/              # Redux store configuration
│   ├── context/            # React context providers
│   ├── styles/             # Global styles and themes
│   └── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend services running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TeIpsum/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   REACT_APP_ADMIN_API_URL=http://localhost:8082
   REACT_APP_AUTH_API_URL=http://localhost:8081
   REACT_APP_USER_API_URL=http://localhost:8083
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Endpoints
The application connects to multiple backend services:

- **Catalog Service** (Port 8080) - Product catalog and filtering
- **Admin Product Service** (Port 8082) - Product management (admin)
- **Auth Service** (Port 8081) - Authentication and authorization
- **User Service** (Port 8083) - User profile management

### Environment Variables
- `REACT_APP_API_URL` - Catalog service URL
- `REACT_APP_ADMIN_API_URL` - Admin service URL
- `REACT_APP_AUTH_API_URL` - Auth service URL
- `REACT_APP_USER_API_URL` - User service URL

## 🎨 UI/UX Features

### Design System
- **Modern Color Palette** - Professional e-commerce colors
- **Typography** - Clean, readable fonts
- **Spacing** - Consistent spacing system
- **Shadows & Effects** - Subtle depth and interactions
- **Animations** - Smooth transitions and hover effects

### Responsive Breakpoints
- **Mobile** - < 768px
- **Tablet** - 768px - 1024px
- **Desktop** - > 1024px

### Component Library
- **Product Cards** - Grid and list view variants
- **Filter Sidebar** - Advanced filtering interface
- **Cart Sidebar** - Shopping cart overlay
- **Form Components** - Consistent form styling
- **Button Variants** - Primary, secondary, and action buttons

## 🔐 Security Features

### Authentication
- **JWT Tokens** - Secure token-based authentication
- **Token Refresh** - Automatic token renewal
- **Protected Routes** - Role-based route protection
- **Logout Handling** - Secure session termination

### Authorization
- **Role-based Access** - Admin and user role management
- **Protected Endpoints** - Backend PreAuthorize integration
- **Admin Panel Access** - Admin-only functionality

## 📊 State Management

### Redux Store Structure
```javascript
{
  auth: {
    accessToken,
    isAuthenticated,
    user,
    loading,
    error
  },
  products: {
    products: [],
    totalPages,
    loading,
    error
  },
  cart: {
    items: [],
    isOpen,
    total
  },
  profile: {
    profileData,
    loading,
    error
  },
  admin: {
    products: [],
    users: [],
    orders: [],
    analytics: {},
    selectedItems: [],
    forms: {}
  }
}
```

## 🧪 Testing

### Available Scripts
```bash
npm test          # Run tests
npm run test:coverage  # Run tests with coverage
npm run build     # Build for production
npm run eject     # Eject from Create React App
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t teipsum-frontend .

# Run container
docker run -p 3000:3000 teipsum-frontend
```

### Production Build
```bash
npm run build
# Serve the build folder with a static server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the backend documentation

## 🔄 Version History

### v1.0.0 (Current)
- Complete e-commerce functionality
- Admin panel with role-based access
- Modern UI/UX design
- Responsive layout
- Cart and checkout system
- User profile management
- Order history and tracking
