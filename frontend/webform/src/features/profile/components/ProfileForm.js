// src/pages/ProfilePage.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { deleteAccount } from '../UserService';
import { useNavigate } from 'react-router-dom';
import ProfileData from './ProfileData';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const { user, logout, profileData } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    if (!user) {
        logout();
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await deleteAccount();
                logout();
                navigate('/');
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        
        <div className={`${styles.profileContainer} ${styles.profileForm}`}>
            <h1 className={styles.title}>Welcome, {profileData?.name || 'User'}</h1>
            {error && <p className={styles.errorMessage}>Error: {error}</p>}
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

export default ProfilePage;
