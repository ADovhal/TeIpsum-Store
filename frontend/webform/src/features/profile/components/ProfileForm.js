// src/pages/ProfileForm.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Импортируем useDispatch и useSelector
import { useNavigate } from 'react-router-dom';
import { logout, loadProfile } from '../../auth/authSlice'; // Импортируем экшены
import { deleteAccount } from '../UserService'; // Ваша логика для удаления аккаунта
import ProfileData from './ProfileData'; // Компонент для отображения данных профиля
import styles from './ProfilePage.module.css';

const ProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Используем useSelector для доступа к состоянию из Redux
    const { user, profileData, token, isLoading, error } = useSelector(state => state.auth);
    console.log(user, profileData, token, isLoading, error)

    useEffect(() => {
        // Если пользователь не авторизован, редиректим на страницу входа
        // if (!user) {
        //     navigate('/login');
        // } else {
            // Загружаем профиль, если он не загружен
            if (!profileData && token) {
                dispatch(loadProfile(token)); // Загружаем профиль с API
            } else if (!token) {
                navigate('/login'); // Если нет токена, перенаправляем на страницу логина
            }
        // }
    }, [user, profileData, token, dispatch, navigate]);

    const handleLogout = () => {
        dispatch(logout()); // Вызов экшена для выхода
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await deleteAccount();
                dispatch(logout()); // Вызов экшена для выхода
                navigate('/');
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    if (isLoading) {
        return <p>Loading profile data...</p>; // Показываем сообщение о загрузке, если данные еще загружаются
    }

    if (error) {
        return <p>Error: {error}</p>; // Если возникла ошибка, показываем ее
    }

    return (
        <div className={`${styles.profileContainer} ${styles.profileForm}`}>
            <h1 className={styles.title}>Welcome, {profileData?.name || 'User'}</h1>
            {profileData ? (
                <div className={styles.profileContent}>
                    <h2 className={styles.subtitle}>Your Profile Information</h2>
                    <ProfileData data={profileData} />
                    <div className={styles.buttonContainer}>
                        <button onClick={handleDeleteAccount} className={styles.deleteButton}>
                            Delete Account
                        </button>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading profile data...</p> // Если профиль еще не загружен, показываем сообщение
            )}
        </div>
    );
};

export default ProfileForm;
