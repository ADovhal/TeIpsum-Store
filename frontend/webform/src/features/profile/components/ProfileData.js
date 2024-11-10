// src/components/ProfileData.js
import React from 'react';
import styles from './ProfileData.module.css';

const ProfileData = ({ data }) => (
    <div className={styles.profileDataContainer}>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Full Name:</strong> {data.fullName}</p>
        <p><strong>Joined on:</strong> {data.joinDate}</p>
    </div>
);

export default ProfileData;
