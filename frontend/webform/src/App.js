// App.js
import React from 'react';
import GlobalStyles from './styles/GlobalStyles';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/profile/ProfilePage';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {

    return (
        <>
            <GlobalStyles />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <div style={{ flex: '1' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/store" element={<StorePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<PrivateRoute element={ProfilePage} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default App;
