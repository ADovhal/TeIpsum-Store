// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
// import store from './redux/store';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/homePage/HomePage';
import StorePage from './pages/StorePage';
import AboutPage from './pages/aboutPage/AboutPage';
import ContactPage from './pages/contactPage/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PreStorePage from './pages/PreStorePage';
import SingleProductPage from './pages/SingleProductPage';
import DiscountsPage from './pages/DiscountsPage';
import NewCollectionPage from './pages/NewCollectionPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import FAQPage from './pages/FAQPage';
import SizeGuidePage from './pages/SizeGuidePage';
import BestsellersPage from './pages/BestsellersPage';
import SustainabilityPage from './pages/SustainabilityPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AccessibilityPage from './pages/AccessibilityPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import PrivateRoute from './routes/PrivateRoute';
import { ViewTypeProvider } from './context/ViewTypeContext';
import { GenderProvider } from './context/GenderContext';
import { HeaderHeightProvider } from './context/HeaderHeightContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <HelmetProvider>
      {/* <Provider store={store}> */}
        <ThemeProvider>
          <LanguageProvider>
            <HeaderHeightProvider>
              <GenderProvider>
                <ViewTypeProvider>
                  {/* <Router> */}
                    <ScrollToTop />
                    {/* <div className="App"> */}
                      <Header />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/pre-store" element={<PreStorePage />} />
                        <Route path="/store" element={<StorePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/product/:id" element={<SingleProductPage />} />
                        <Route path="/discounts" element={<DiscountsPage />} />
                        <Route path="/new-collection" element={<NewCollectionPage />} />
                        <Route path="/new-arrivals" element={<NewCollectionPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-success" element={<OrderSuccessPage />} />
                        <Route path="/shipping" element={<ShippingPage />} />
                        <Route path="/returns" element={<ReturnsPage />} />
                        <Route path="/cookies" element={<CookiePolicyPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/bestsellers" element={<BestsellersPage />} />
                        <Route path="/size-guide" element={<SizeGuidePage />} />
                        <Route path="/sustainability" element={<SustainabilityPage />} />
                        <Route path="/accessibility" element={<AccessibilityPage />} />
                        <Route path="/privacy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms" element={<TermsOfServicePage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route 
                          path="/profile" 
                          element={
                              <PrivateRoute element={<ProfilePage />} />
                          } 
                        />
                      </Routes>
                      <Footer />
                    {/* </div>
                  </Router> */}
                </ViewTypeProvider>
              </GenderProvider>
            </HeaderHeightProvider>
          </LanguageProvider>
        </ThemeProvider>
      {/* </Provider> */}
    </HelmetProvider>
  );
}

export default App;