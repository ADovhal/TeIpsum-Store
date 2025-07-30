import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAsync } from '../../auth/authSlice';
import { deleteUserAccount } from '../profileSlice';
import ProfileData from './ProfileData';
import styles from './ProfileForm.module.css';

const ProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const profileData = useSelector(state => state.profile.profileData);
    const error = useSelector(state => state.profile.error);


    const handleLogout = () => {
        dispatch(logoutAsync());
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                dispatch(deleteUserAccount());
                navigate('/login')
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };


    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className={`${styles.profileContainer} ${styles.profileForm}`}>
            {/* <h1 className={styles.title}>Welcome, {profileData?.name || 'User'}</h1> */}
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
