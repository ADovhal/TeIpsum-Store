import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAsync } from '../../auth/authSlice';
import { deleteUserAccount } from '../profileSlice';
import ProfileData from './ProfileData';
import ProfileEditForm from './ProfileEditForm';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './ProfileForm.module.css';

const ProfileForm = () => {
    const { t } = useLanguage();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    
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

    if (isEditing) {
        return (
            <div className={`${styles.profileContainer} ${styles.profileForm}`}>
                <h2 className={styles.subtitle}>{t('editProfileInformation')}</h2>
                <ProfileEditForm 
                    profileData={profileData}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.profileContainer} ${styles.profileForm}`}>
            {/* <h1 className={styles.title}>Welcome, {profileData?.name || 'User'}</h1> */}
            {profileData ? (
                <div className={styles.profileContent}>
                    <h2 className={styles.subtitle}>{t('yourProfileInformation')}</h2>
                    <ProfileData data={profileData} />
                    <div className={styles.buttonContainer}>
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className={styles.editButton}
                        >
                            {t('editProfile')}
                        </button>
                        <button onClick={handleDeleteAccount} className={styles.deleteButton}>
                            {t('deleteAccount')}
                        </button>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            {t('logout')}
                        </button>
                    </div>
                </div>
            ) : (
                <p>{t('loading')}</p>
            )}
        </div>
    );
};

export default ProfileForm;
