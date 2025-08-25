// src/components/DeleteAccountDialog/DeleteAccountDialog.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeletionInfo } from '../profileSlice';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './DeleteAccountDialog.module.css';

const DeleteAccountDialog = ({ open, onClose, onConfirm }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const { deletionInfo, isLoadingDeletionInfo } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    if (open) dispatch(fetchDeletionInfo());
  }, [open, dispatch]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{t('deleteAccountConfirmTitle')}</h2>

        {isLoadingDeletionInfo && <p>{t('loading')}</p>}
        {deletionInfo && (
          <ul className={styles.warningList}>
            <li>{t('ordersToBeDeleted', { count: deletionInfo.orderCount })}</li>
            {deletionInfo.hasActiveOrders && (
              <li className={styles.warning}>{t('activeOrdersWarning')}</li>
            )}
            <li>{t('profileAndHistory')}</li>
          </ul>
        )}

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            {t('cancel')}
          </button>
          <button type="button" onClick={onConfirm} className={styles.deleteBtn}>
            {t('deleteAnyway')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountDialog;