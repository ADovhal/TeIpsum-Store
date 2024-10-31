import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { deleteAccount } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import ProfileData from './ProfileData';

const Profile = () => {
    const { user, logout, profileData} = useContext(AuthContext);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    if (!user) {
        logout();
        navigate('/login');
    }

    const handleLogout = () => {
        logout();
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await deleteAccount();
                logout();
                navigate('/');
            } catch (error) {
                setError(error.message);
                console.error('Failed to delete account:', error.message);
            }
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Welcome, {user?.username || 'User'}</h1>
            {profileData ? (
                <div>
                    <h2>Profile Data</h2>
                    <ProfileData data={profileData} />
                    <button onClick={handleDeleteAccount} style={{ color: 'red' }}>Delete Account</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
