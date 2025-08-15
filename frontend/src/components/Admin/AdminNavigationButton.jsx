import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useIsAdmin from '../../features/admin/useIsAdmin';
import styles from './AdminNavigationButton.module.css';

/**
 * Admin navigation button - only visible to admin users
 * Provides quick access to admin management features
 */
const AdminNavigationButton = () => {
  const { t } = useTranslation();
  const isAdmin = useIsAdmin();

  // Only render for admin users
  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.adminNav}>
      <Link to="/admin/users" className={styles.adminLink}>
        <div className={styles.adminButton}>
          <span className={styles.adminIcon}>👑</span>
          {/* <span className={styles.adminText}>{t('admin.manageUsers')}</span> */}
        </div>
      </Link>
    </div>
  );
};

export default AdminNavigationButton;
