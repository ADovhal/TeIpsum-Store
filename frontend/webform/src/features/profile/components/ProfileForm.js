// src/pages/ProfileForm.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../auth/authSlice';
import { loadProfile } from '../profileSlice';
import { deleteAccount } from '../UserService';
import ProfileData from './ProfileData';
import styles from './ProfileForm.module.css';

const ProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { token, user } = useSelector(state => state.auth);
    const { profileData, isLoading, error } = useSelector(state => state.profile);
    console.log(user, profileData, token, isLoading, error)

    useEffect(() => {
            if (!profileData && token) {
                dispatch(loadProfile(token));
            } else if (!token) {
                navigate('/login');
            }
    }, [user, profileData, token, dispatch, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await deleteAccount();
                dispatch(logout());
                navigate('/');
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    if (isLoading) {
        return <p>Loading profile data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
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
                <p>Loading profile data...</p>
            )}
        </div>
    );
};

export default ProfileForm;
