import React from 'react';
import styles from './ProfileData.module.css';

const ProfileData = ({ data }) => (
    <div className={styles.profileDataContainer}>
        <p><strong>Email:</strong> {data?.email || 'N/A'}</p>
        <p><strong>Full Name:</strong> {data?.fullName || 'N/A'}</p>
        <p><strong>Joined on:</strong> {data?.joinDate || 'N/A'}</p>
    </div>
);

export default ProfileData;
