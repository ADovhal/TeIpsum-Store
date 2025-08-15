import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminRegistrationForm from '../../components/Admin/AdminRegistrationForm';
import styles from './AdminUserManagementPage.module.css';

/**
 * Admin page for user management including creating new admin accounts
 */
const AdminUserManagementPage = () => {
  const { t } = useTranslation();
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAdminCreated = (result) => {
    console.log('Admin created:', result);
    setShowCreateAdmin(false);
    setSuccessMessage(t('admin.adminCreatedSuccess'));
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleCancelCreate = () => {
    setShowCreateAdmin(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('userManagement')}</h1>
        <p className={styles.subtitle}>
          Manage user accounts and administrative privileges
        </p>
      </div>

      {successMessage && (
        <div className={styles.successAlert}>
          <span className={styles.successIcon}>✅</span>
          <div>
            <p className={styles.successTitle}>{successMessage}</p>
            <p className={styles.successMessage}>{t('admin.adminCreatedMessage')}</p>
          </div>
        </div>
      )}

      {!showCreateAdmin ? (
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Administrator Management</h2>
              <p className={styles.sectionDescription}>
                Create and manage administrator accounts with system-wide privileges
              </p>
            </div>

            <div className={styles.actionCards}>
              <div className={styles.actionCard}>
                <div className={styles.cardIcon}>👤</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Create New Admin</h3>
                  <p className={styles.cardDescription}>
                    Register a new administrator account with full system access
                  </p>
                  <button 
                    className={styles.primaryButton}
                    onClick={() => setShowCreateAdmin(true)}
                  >
                    {t('admin.createNewAdmin')}
                  </button>
                </div>
              </div>

              <div className={styles.actionCard}>
                <div className={styles.cardIcon}>👥</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Manage Users</h3>
                  <p className={styles.cardDescription}>
                    View and manage regular user accounts and their permissions
                  </p>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => {/* TODO: Implement user list */}}
                  >
                    View All Users
                  </button>
                </div>
              </div>

              <div className={styles.actionCard}>
                <div className={styles.cardIcon}>🔐</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Security Settings</h3>
                  <p className={styles.cardDescription}>
                    Configure security policies and access controls
                  </p>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => {/* TODO: Implement security settings */}}
                  >
                    Security Settings
                  </button>
                </div>
              </div>

              <div className={styles.actionCard}>
                <div className={styles.cardIcon}>📊</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>User Analytics</h3>
                  <p className={styles.cardDescription}>
                    View user registration trends and account statistics
                  </p>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => {/* TODO: Implement analytics */}}
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
              <p className={styles.sectionDescription}>
                Latest user management activities and system events
              </p>
            </div>

            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>👤</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>New user registration</p>
                  <p className={styles.activityTime}>2 hours ago</p>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>🔐</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Admin login detected</p>
                  <p className={styles.activityTime}>4 hours ago</p>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>⚠️</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Account deletion request</p>
                  <p className={styles.activityTime}>1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AdminRegistrationForm
          onSuccess={handleAdminCreated}
          onCancel={handleCancelCreate}
        />
      )}
    </div>
  );
};

export default AdminUserManagementPage;
