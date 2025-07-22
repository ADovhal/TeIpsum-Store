import React, { useEffect } from 'react';
import ProfileForm from '../features/profile/components/ProfileForm';

const ProfilePage = () => {
  useEffect(() => {
    document.title = "Profile";
  }, []);

  return (
      <ProfileForm />
  );
};

export default ProfilePage;
