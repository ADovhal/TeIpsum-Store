import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDeletionInfo, initiateAccountDeletion } from '../../services/apiUser';
import styles from './AccountDeletionDialog.module.css';

/**
 * Account deletion dialog with proper warnings and confirmation
 */
const AccountDeletionDialog = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [deletionInfo, setDeletionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: Confirmation, 3: Final Warning

  useEffect(() => {
    if (isOpen && !deletionInfo) {
      fetchDeletionInfo();
    }
  }, [isOpen]);

  const fetchDeletionInfo = async () => {
    setLoading(true);
    try {
      const info = await getDeletionInfo();
      setDeletionInfo(info);
    } catch (error) {
      console.error('Error fetching deletion info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmDeletion = async () => {
    if (confirmText === 'DELETE MY ACCOUNT') {
      setLoading(true);
      try {
        await initiateAccountDeletion();
        onConfirm(); // Notify parent that deletion was successful
        onClose();
      } catch (error) {
        console.error('Error initiating account deletion:', error);
        // Could add error state here to show user-friendly error message
      } finally {
        setLoading(false);
      }
    }
  };

  const resetDialog = () => {
    setStep(1);
    setConfirmText('');
    setDeletionInfo(null);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {step === 1 && t('deleteAccount.title')}
            {step === 2 && t('deleteAccount.confirmTitle')}
            {step === 3 && t('deleteAccount.finalWarningTitle')}
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>{t('deleteAccount.loadingInfo')}</p>
            </div>
          )}

          {!loading && deletionInfo && (
            <>
              {step === 1 && (
                <div className={styles.infoStep}>
                  <div className={styles.userInfo}>
                    <h3>{t('deleteAccount.accountInfo')}</h3>
                    <p><strong>{t('deleteAccount.email')}:</strong> {deletionInfo.email}</p>
                    <p><strong>{t('deleteAccount.fullName')}:</strong> {deletionInfo.fullName}</p>
                    <p><strong>{t('deleteAccount.joinDate')}:</strong> {new Date(deletionInfo.joinDate).toLocaleDateString()}</p>
                    <p><strong>{t('deleteAccount.lastLogin')}:</strong> {new Date(deletionInfo.lastLogin).toLocaleString()}</p>
                  </div>

                  {deletionInfo.hasOrders && (
                    <div className={styles.orderWarning}>
                      <div className={styles.warningIcon}>⚠️</div>
                      <div>
                        <h4>{t('deleteAccount.orderWarningTitle')}</h4>
                        <p>{t('deleteAccount.orderCount', { count: deletionInfo.orderCount })}</p>
                        {deletionInfo.hasActiveOrders && (
                          <p className={styles.activeOrdersWarning}>
                            {t('deleteAccount.activeOrdersWarning')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.warning}>
                    <p>{deletionInfo.warning}</p>
                  </div>

                  <div className={styles.consequences}>
                    <h4>{t('deleteAccount.whatWillBeDeleted')}</h4>
                    <ul>
                      <li>{t('deleteAccount.consequence1')}</li>
                      <li>{t('deleteAccount.consequence2')}</li>
                      <li>{t('deleteAccount.consequence3')}</li>
                      {deletionInfo.hasOrders && (
                        <li>{t('deleteAccount.consequence4')}</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={styles.confirmStep}>
                  <div className={styles.confirmationWarning}>
                    <h3>{t('deleteAccount.areYouSure')}</h3>
                    <p>{t('deleteAccount.noUndoWarning')}</p>
                    
                    {deletionInfo.hasOrders && (
                      <div className={styles.dataLossWarning}>
                        <p>{t('deleteAccount.dataLossWarning', { count: deletionInfo.orderCount })}</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.alternativeOptions}>
                    <h4>{t('deleteAccount.alternativeTitle')}</h4>
                    <p>{t('deleteAccount.alternativeText')}</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={styles.finalStep}>
                  <div className={styles.finalWarning}>
                    <div className={styles.dangerIcon}>🚨</div>
                    <h3>{t('deleteAccount.finalConfirmation')}</h3>
                    <p>{t('deleteAccount.finalWarningText')}</p>
                  </div>

                  <div className={styles.confirmationInput}>
                    <label htmlFor="confirmText">
                      {t('deleteAccount.typeToConfirm')} <strong>DELETE MY ACCOUNT</strong>
                    </label>
                    <input
                      id="confirmText"
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                      className={styles.confirmInput}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          {step > 1 && (
            <button 
              className={styles.backButton} 
              onClick={handlePreviousStep}
            >
              {t('deleteAccount.back')}
            </button>
          )}
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.cancelButton} 
              onClick={handleClose}
            >
              {t('deleteAccount.cancel')}
            </button>
            
            {step < 3 && (
              <button 
                className={styles.nextButton} 
                onClick={handleNextStep}
                disabled={loading}
              >
                {step === 1 ? t('deleteAccount.continue') : t('deleteAccount.next')}
              </button>
            )}
            
            {step === 3 && (
              <button 
                className={styles.deleteButton} 
                onClick={handleConfirmDeletion}
                disabled={confirmText !== 'DELETE MY ACCOUNT'}
              >
                {t('deleteAccount.deleteAccount')}
              </button>
            )}
          </div>
        </div>

        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3</div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletionDialog;
