// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Element }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // получение состояния из authSlice
    const isLoading = useSelector((state) => state.auth.isLoading);

    if (isLoading) {
        return <div>Loading...</div>; // Показать индикатор загрузки, если данные еще загружаются
    }

    // Проверка на аутентификацию
    return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;
