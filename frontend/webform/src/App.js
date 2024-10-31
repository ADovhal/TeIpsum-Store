import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/auth/LoginForm';
import Profile from './components/Profile';
import PrivateRoute from './routes/PrivateRoute';
import RegistrationForm from './components/auth/RegistrationForm';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute element={Profile} />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default App;
