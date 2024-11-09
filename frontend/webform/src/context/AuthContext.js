import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfileData } from '../features/profile/UserService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);   
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loadProfileData = useCallback(async (storedToken) => {
        try {
            const data = await fetchProfileData(storedToken);
            setProfileData(data);
        } catch (error) {
            console.error('Failed to fetch profile data:', error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedProfileData = localStorage.getItem('profileData');
        console.log('Stored Token on reload:', storedToken);
        console.log('Stored Profile Data on reload:', storedProfileData);


        if (storedToken) {
            setUser(storedProfileData);
            setToken(storedToken);
            loadProfileData(storedToken);
        }
        setIsLoading(false);
    }, [ loadProfileData]);

    

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('profileData',JSON.stringify(userData));
        loadProfileData(token);
        navigate('/profile');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setProfileData(null);
        localStorage.removeItem('token');
        localStorage.removeItem('profileData');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, profileData, setProfileData, isAuthenticated: !!token, isLoading  }}>
            {children}
        </AuthContext.Provider>
    );
};