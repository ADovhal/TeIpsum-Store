# Frontend - TeIpsum E-Commerce Platform

## 🌟 Overview

TeIpsum frontend is a modern React application that provides a comprehensive e-commerce experience for sustainable fashion. Built with React 18 and modern web technologies, it offers a responsive, accessible, and multi-language interface for customers and administrators.

## ✨ Key Features

### 🛍️ E-Commerce Features
- **Product Catalog**: Advanced filtering, search, and product browsing
- **Shopping Cart**: Persistent cart with real-time updates
- **Checkout Process**: Secure multi-step checkout with guest and user options
- **User Authentication**: Registration, login, and profile management
- **Order Management**: Order history and tracking
- **Wishlist**: Save products for later (planned)

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with CSS modules
- **Theme Support**: Light and dark mode switching
- **Animations**: Smooth transitions with Framer Motion
- **Performance**: Code splitting and lazy loading
- **SEO Optimization**: React Helmet for meta tags
- **Accessibility**: WCAG 2.1 AA compliant

### 🌐 Internationalization
- **Multi-language Support**: English, German, Polish, Ukrainian
- **Dynamic Language Switching**: Real-time language changes
- **Localized Content**: Date formats, currency, and cultural adaptations
- **RTL Support**: Planned for Arabic and Hebrew

### 🔧 Admin Features
- **Product Management**: CRUD operations for products
- **Order Management**: View and manage customer orders
- **User Management**: Admin user controls
- **Analytics Dashboard**: Sales and user analytics (planned)

## 🛠️ Technology Stack

### Core Framework
- **React**: 18.3.1 with functional components and hooks
- **React DOM**: 18.3.1 for rendering
- **React Scripts**: 5.0.1 build tooling

### State Management
- **Redux Toolkit**: 2.3.0 for predictable state management
- **React Redux**: 9.1.2 for React bindings
- **RTK Query**: Built-in data fetching and caching

### Routing & Navigation
- **React Router DOM**: 6.27.0 for client-side routing
- **Protected Routes**: Authentication-based route guards

### Styling & UI
- **CSS Modules**: Scoped component styling
- **Styled Components**: 6.1.13 for dynamic styling
- **Responsive Design**: Mobile-first approach
- **Font Awesome**: 4.7.0 for icons

### Animation & Interactions
- **Framer Motion**: 12.14.0 for animations and transitions
- **Lottie React**: 2.4.1 for micro-animations
- **React Intersection Observer**: 9.16.0 for scroll animations

### Internationalization
- **i18next**: 25.3.2 for internationalization
- **react-i18next**: 15.6.1 for React integration
- **i18next-browser-languagedetector**: 8.2.0 for language detection
- **i18next-http-backend**: 3.0.2 for loading translations

### HTTP & API
- **Axios**: 1.7.7 for HTTP requests
- **JWT Decode**: 4.0.0 for token handling

### Form & Data Handling
- **React Select**: 5.10.2 for enhanced select inputs
- **React DatePicker**: 8.4.0 for date selection
- **Date FNS**: 4.1.0 for date manipulation
- **DOMPurify**: 3.1.7 for XSS protection

### SEO & Performance
- **React Helmet Async**: 2.0.5 for meta tag management
- **Web Vitals**: 2.1.4 for performance monitoring

### Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: 13.4.0 for component testing
- **User Event**: 13.5.0 for user interaction testing

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── index.html             # HTML template
│   ├── manifest.json          # PWA manifest
│   └── locales/               # Translation files
│       ├── en/translation.json
│       ├── de/translation.json
│       ├── pl/translation.json
│       └── ua/translation.json
├── src/
│   ├── components/            # Reusable components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── common/
│   ├── pages/                 # Page components
│   │   ├── homePage/
│   │   ├── aboutPage/
│   │   ├── admin/
│   │   └── ...
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication
│   │   ├── cart/              # Shopping cart
│   │   ├── products/          # Product catalog
│   │   ├── orders/            # Order management
│   │   ├── profile/           # User profile
│   │   └── admin/             # Admin features
│   ├── context/               # React contexts
│   │   ├── LanguageContext.js
│   │   ├── ThemeContext.js
│   │   └── GenderContext.js
│   ├── redux/                 # Redux store configuration
│   │   └── store.js
│   ├── routes/                # Route definitions
│   │   ├── PublicRoutes.js
│   │   └── AdminRoutes.js
│   ├── services/              # API services
│   │   ├── apiAuth.js
│   │   ├── apiOrder.js
│   │   └── ...
│   ├── styles/                # Global styles
│   │   ├── GlobalStyles.js
│   │   └── ...
│   ├── utils/                 # Utility functions
│   │   ├── validation.js
│   │   └── ...
│   ├── assets/                # Images, animations
│   │   ├── images/
│   │   └── animations/
│   ├── i18n/                  # Internationalization config
│   │   └── config.js
│   ├── App.js                 # Main App component
│   └── index.js               # Application entry point
├── package.json               # Dependencies and scripts
├── Dockerfile                 # Docker configuration
└── nginx.prod.conf           # Nginx configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18+ (LTS recommended)
- **npm**: 8+ or **yarn**: 1.22+

### Local Development

1. **Clone and navigate to frontend**
   ```bash
   git clone https://github.com/your-repo/TeIpsum.git
   cd TeIpsum/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cat > .env << EOF
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   REACT_APP_ENVIRONMENT=development
   REACT_APP_VERSION=$npm_package_version
   EOF
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Serve production build locally
npx serve -s build
```

### Docker Development

```bash
# Build Docker image
docker build -t teipsum-frontend .

# Run container
docker run -p 3000:80 teipsum-frontend
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend root:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_AUTH_SERVICE_URL=http://localhost:8081/api/auth
REACT_APP_USER_SERVICE_URL=http://localhost:8082/api/users
REACT_APP_CATALOG_SERVICE_URL=http://localhost:8083/api/products
REACT_APP_ORDER_SERVICE_URL=http://localhost:8084/api/orders

# Application Configuration
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=$npm_package_version
REACT_APP_COMPANY_NAME=TeIpsum

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_CHAT=false

# SEO Configuration
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_DEFAULT_LANGUAGE=en
```

### Internationalization Setup

The application supports 4 languages with dynamic switching:

```javascript
// Supported languages
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ua', name: 'Українська', flag: '🇺🇦' }
];
```

Translation files are located in `public/locales/{language}/translation.json`.

## 🎨 Styling & Theming

### CSS Modules
Components use CSS Modules for scoped styling:

```javascript
// Component.js
import styles from './Component.module.css';

const Component = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Title</h1>
  </div>
);
```

### Theme System
Dynamic theme switching with context:

```javascript
// Theme usage
const { theme, toggleTheme } = useTheme();

<div style={{ backgroundColor: theme.primary }}>
  Content
</div>
```

### Responsive Design
Mobile-first approach with breakpoints:

```css
/* Mobile first */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

## 🔄 State Management

### Redux Store Structure
```
store/
├── auth/           # Authentication state
├── cart/           # Shopping cart state
├── products/       # Product catalog state
├── orders/         # Order management state
├── profile/        # User profile state
└── admin/          # Admin panel state
```

### Example Slice
```javascript
// features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    isOpen: false
  },
  reducers: {
    addItem: (state, action) => {
      // Add item to cart logic
    },
    removeItem: (state, action) => {
      // Remove item logic
    }
  }
});
```

## 🛣️ Routing

### Public Routes
Available to all users:
- `/` - Homepage
- `/store` - Product catalog
- `/product/:id` - Product details
- `/about` - About page
- `/contact` - Contact page
- `/login` - User login
- `/register` - User registration
- `/checkout` - Checkout process

### Protected Routes
Require authentication:
- `/profile` - User profile
- `/orders` - Order history

### Admin Routes
Require admin role:
- `/admin/products/new` - Create product
- `/admin/products/:id/edit` - Edit product
- `/admin/orders` - Manage orders

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- Component.test.js
```

### Test Structure
```javascript
// Component.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import Component from './Component';
import { store } from '../redux/store';

test('renders component correctly', () => {
  render(
    <Provider store={store}>
      <Component />
    </Provider>
  );
  
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Testing Best Practices
- Test user interactions, not implementation details
- Use data-testid for complex selectors
- Mock external dependencies
- Test accessibility features
- Write integration tests for user flows

## 🔒 Security

### XSS Protection
```javascript
import DOMPurify from 'dompurify';

// Sanitize user input
const sanitizedHtml = DOMPurify.sanitize(userInput);
```

### JWT Token Handling
```javascript
// Secure token storage
const authService = {
  setToken: (token) => {
    localStorage.setItem('accessToken', token);
  },
  
  getToken: () => {
    return localStorage.getItem('accessToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('accessToken');
  }
};
```

### Input Validation
```javascript
// Validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password);
};
```

## 📈 Performance Optimization

### Code Splitting
```javascript
// Lazy loading components
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('../pages/admin/AdminPanel'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanel />
    </Suspense>
  );
}
```

### Image Optimization
- Use WebP format where possible
- Implement lazy loading for images
- Optimize image sizes for different screen resolutions
- Use CDN for static assets

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 📱 Progressive Web App (PWA)

### Service Worker
The application includes PWA capabilities:
- Offline support
- App installation
- Push notifications (planned)
- Background sync (planned)

### Manifest Configuration
```json
{
  "name": "TeIpsum - Sustainable Fashion",
  "short_name": "TeIpsum",
  "theme_color": "#2E7D32",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "start_url": "/"
}
```

## 🚀 Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# Files will be generated in the 'build' directory
```

### Docker Deployment
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf
```

### Environment-Specific Builds
```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 🔍 SEO Optimization

### Meta Tags Management
```javascript
// Using React Helmet
import { Helmet } from 'react-helmet-async';

const ProductPage = ({ product }) => (
  <>
    <Helmet>
      <title>{product.name} - TeIpsum</title>
      <meta name="description" content={product.description} />
      <meta property="og:title" content={product.name} />
      <meta property="og:image" content={product.image} />
    </Helmet>
    {/* Component content */}
  </>
);
```

### Structured Data
```javascript
const productStructuredData = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.name,
  "image": product.image,
  "description": product.description,
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": product.price
  }
};
```

## 🔧 Development Tools

### VS Code Extensions
Recommended extensions for development:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Chrome Extensions
Useful for debugging:
- React Developer Tools
- Redux DevTools
- Lighthouse

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **CORS Errors**
   - Check API base URL configuration
   - Verify backend CORS settings
   - Use proxy in development

3. **Translation Not Loading**
   - Check translation file syntax
   - Verify language code matches folder name
   - Clear browser cache

### Debug Mode
```bash
# Run with debug information
REACT_APP_DEBUG=true npm start
```

## 🤝 Contributing

1. **Code Style**: Follow Prettier and ESLint configurations
2. **Component Structure**: Use functional components with hooks
3. **Testing**: Write tests for new components and features
4. **Documentation**: Update README for new features
5. **Accessibility**: Ensure WCAG 2.1 AA compliance

---

**Built with ❤️ for sustainable fashion**