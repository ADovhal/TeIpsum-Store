import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { registerAdmin } from '../../services/apiAdmin';
import styles from './AdminRegistrationForm.module.css';

/**
 * Admin registration form for creating new admin accounts
 * Only accessible by existing admins
 */
const AdminRegistrationForm = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: '',
    dob: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('validation.requiredField');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('validation.requiredField');
    } else if (formData.password.length < 8) {
      newErrors.password = t('validation.passwordTooWeak');
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = t('validation.requiredField');
    }

    // Surname validation
    if (!formData.surname) {
      newErrors.surname = t('validation.requiredField');
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = t('validation.requiredField');
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = t('validation.invalidPhone');
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = t('validation.requiredField');
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.dob = t('validation.adminMustBeAdult');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerAdmin(formData);
      
      // Show success message and reset form
      onSuccess && onSuccess(result);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        name: '',
        surname: '',
        phone: '',
        dob: ''
      });

    } catch (error) {
      console.error('Admin registration failed:', error);
      
      // Handle different error types
      if (error.status === 401) {
        setGeneralError(t('admin.notAuthorized'));
      } else if (error.status === 409) {
        setGeneralError(t('validation.emailExists'));
      } else if (error.status === 403) {
        setGeneralError(t('admin.insufficientPermissions'));
      } else {
        setGeneralError(error.error || error.message || t('admin.registrationFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('admin.createNewAdmin')}</h2>
          <p className={styles.subtitle}>{t('admin.createAdminDescription')}</p>
        </div>

        {generalError && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>❌</span>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                {t('firstName')} <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder={t('firstNamePlaceholder')}
                disabled={isLoading}
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="surname" className={styles.label}>
                {t('lastName')} <span className={styles.required}>*</span>
              </label>
              <input
                id="surname"
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.surname ? styles.inputError : ''}`}
                placeholder={t('lastNamePlaceholder')}
                disabled={isLoading}
              />
              {errors.surname && <span className={styles.fieldError}>{errors.surname}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              {t('emailAddress')} <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder={t('admin.emailPlaceholder')}
              disabled={isLoading}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>
              {t('phoneNumber')} <span className={styles.required}>*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              placeholder={t('phonePlaceholder')}
              disabled={isLoading}
            />
            {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="dob" className={styles.label}>
              {t('dateOfBirth')} <span className={styles.required}>*</span>
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.dob ? styles.inputError : ''}`}
              disabled={isLoading}
            />
            {errors.dob && <span className={styles.fieldError}>{errors.dob}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              {t('password')} <span className={styles.required}>*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder={t('admin.passwordPlaceholder')}
              disabled={isLoading}
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            <div className={styles.passwordHint}>
              {t('admin.passwordRequirements')}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              {t('cancel')}
            </button>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  {t('admin.creatingAdmin')}
                </>
              ) : (
                t('admin.createAdmin')
              )}
            </button>
          </div>
        </form>

        <div className={styles.securityNote}>
          <div className={styles.securityIcon}>🔒</div>
          <div>
            <p className={styles.securityTitle}>{t('admin.securityNote')}</p>
            <p className={styles.securityText}>{t('admin.securityNoteText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationForm;
