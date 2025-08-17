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
          {t('admin.userManagementSubtitle')}
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
              <h2 className={styles.sectionTitle}>{t('admin.administratorManagement')}</h2>
              <p className={styles.sectionDescription}>
                {t('admin.adminManagementDescription')}
              </p>
            </div>

            <div className={styles.actionCards}>
              <div className={styles.actionCard}>
                <div className={styles.cardIcon}>👤</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{t('admin.createNewAdminCard')}</h3>
                  <p className={styles.cardDescription}>
                    {t('admin.createNewAdminDescription')}
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
                  <h3 className={styles.cardTitle}>{t('admin.manageUsersCard')}</h3>
                  <p className={styles.cardDescription}>
                    {t('admin.manageUsersDescription')}
                  </p>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => {/* TODO: Implement user list */}}
                  >
                    {t('admin.viewAllUsers')}
                  </button>
                </div>
              </div>

              <div className={styles.actionCard}>
                <div className={styles.cardIcon}>🔐</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{t('admin.securitySettings')}</h3>
                  <p className={styles.cardDescription}>
                    {t('admin.securitySettingsDescription')}
                  </p>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => {/* TODO: Implement security settings */}}
                  >
                    {t('admin.securitySettings')}
                  </button>
                </div>
              </div>

              <div className={styles.actionCard}>
                <div className={styles.cardIcon}>📊</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{t('admin.userAnalytics')}</h3>
                  <p className={styles.cardDescription}>
                    {t('admin.userAnalyticsDescription')}
                  </p>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => {/* TODO: Implement analytics */}}
                  >
                    {t('admin.viewAnalytics')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t('admin.recentActivity')}</h2>
              <p className={styles.sectionDescription}>
                {t('admin.recentActivityDescription')}
              </p>
            </div>

            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>👤</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>{t('admin.newUserRegistration')}</p>
                  <p className={styles.activityTime}>2 {t('admin.hoursAgo')}</p>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>🔐</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>{t('admin.adminLoginDetected')}</p>
                  <p className={styles.activityTime}>4 {t('admin.hoursAgo')}</p>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>⚠️</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>{t('admin.accountDeletionRequest')}</p>
                  <p className={styles.activityTime}>1 {t('admin.dayAgo')}</p>
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
