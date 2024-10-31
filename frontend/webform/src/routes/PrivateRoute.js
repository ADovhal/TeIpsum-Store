import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading...</div>; // Пока идет загрузка, показываем индикатор
    }

    // Проверка на наличие аутентификации
    return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;