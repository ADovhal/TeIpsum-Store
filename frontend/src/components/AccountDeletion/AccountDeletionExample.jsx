import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountDeletionDialog from './AccountDeletionDialog';
import accountDeletionService from '../../services/accountDeletionService';
import styles from './AccountDeletionExample.module.css';

/**
 * Example component showing how to integrate account deletion into a profile page
 * This demonstrates the complete flow with proper error handling and user feedback
 */
const AccountDeletionExample = () => {
  const { t } = useTranslation();
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleOpenDeletionDialog = () => {
    setError(null);
    setShowDeletionDialog(true);
  };

  const handleCloseDeletionDialog = () => {
    if (!isDeleting) {
      setShowDeletionDialog(false);
      setError(null);
    }
  };

  const handleConfirmDeletion = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Initiate the account deletion process
      const response = await accountDeletionService.initiateAccountDeletion();
      
      // Show success message
      setSuccess(true);
      setShowDeletionDialog(false);
      
      // Wait a moment for user to see the success message
      setTimeout(() => {
        // Log out and redirect
        accountDeletionService.logout();
      }, 2000);

    } catch (error) {
      console.error('Account deletion failed:', error);
      setError(accountDeletionService.getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h2>{t('deleteAccount.deletionInitiated')}</h2>
          <p>{t('deleteAccount.deletionInProgress')}</p>
          <p>{t('deleteAccount.redirectingMessage')}</p>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <h2>{t('myProfile')}</h2>
        
        {/* Profile information would go here */}
        <div className={styles.profileInfo}>
          <p>{t('profileSettings')}</p>
          {/* ... other profile content ... */}
        </div>

        {/* Danger Zone */}
        <div className={styles.dangerZone}>
          <h3 className={styles.dangerTitle}>⚠️ Danger Zone</h3>
          <div className={styles.dangerContent}>
            <div className={styles.dangerInfo}>
              <h4>{t('deleteAccount.title')}</h4>
              <p className={styles.dangerDescription}>
                {t('deleteAccount.permanentAction')}
              </p>
              <ul className={styles.consequencesList}>
                <li>{t('deleteAccount.consequence1')}</li>
                <li>{t('deleteAccount.consequence2')}</li>
                <li>{t('deleteAccount.consequence3')}</li>
                <li>{t('deleteAccount.consequence4')}</li>
              </ul>
            </div>
            
            <button
              className={styles.deleteButton}
              onClick={handleOpenDeletionDialog}
              disabled={isDeleting}
            >
              {isDeleting ? t('processing') : t('deleteAccount.title')}
            </button>
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>❌</span>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Account Deletion Dialog */}
      <AccountDeletionDialog
        isOpen={showDeletionDialog}
        onClose={handleCloseDeletionDialog}
        onConfirm={handleConfirmDeletion}
      />
    </div>
  );
};

export default AccountDeletionExample;
