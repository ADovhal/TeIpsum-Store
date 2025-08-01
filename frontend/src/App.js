import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ViewTypeProvider } from './context/ViewTypeContext';
import { GenderProvider } from './context/GenderContext';
import { HeaderHeightProvider } from './context/HeaderHeightContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes   from './routes/AdminRoutes';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const isAdmin = useSelector(s => s.auth.roles?.includes('ADMIN'));
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <HeaderHeightProvider>
            <GenderProvider>
              <ViewTypeProvider>
                <ScrollToTop />
                  <Header />
                  <Routes>
                    <Route path="/*" element={<PublicRoutes />} />
                    {isAdmin && <Route path="/admin/*" element={<AdminRoutes />} />}
                  </Routes>
                  <Footer />
              </ViewTypeProvider>
            </GenderProvider>
          </HeaderHeightProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;