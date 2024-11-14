// App.js
import React, { useEffect } from 'react';
import GlobalStyles from './styles/GlobalStyles';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './routes/PrivateRoute';
import {ViewTypeProvider} from './context/ViewTypeContext';
import { useDispatch, useSelector } from 'react-redux';
import { loadProfile } from './features/profile/profileSlice';


const App = () => {

    const dispatch = useDispatch();
    const profileData = useSelector((state) => state.profile.profileData);
    const accessToken = useSelector((state) => state.auth.accessToken);

    // Загружаем профиль только если его нет в Redux и доступен токен
    useEffect(() => {
        if (!profileData && accessToken) {
            // Запрашиваем профиль с сервера, если данных нет в Redux
            dispatch(loadProfile(accessToken)); 
        }
    }, [dispatch, profileData, accessToken]);

    return (
        <>
            <GlobalStyles />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <div style={{ flex: '1' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/store" element={<ViewTypeProvider> <StorePage /> </ViewTypeProvider>} />
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
