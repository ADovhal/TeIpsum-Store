// ProfileData.js
import React from 'react';

const ProfileData = ({ data }) => {
    return (
        <div>
            <h3>User Information</h3>
            <p><strong>ID:</strong> {data.id}</p>
            <p><strong>Username:</strong> {data.username}</p>
            {/* Если у вас есть другие поля, вы можете их отобразить здесь */}
        </div>
    );
};

export default ProfileData;
