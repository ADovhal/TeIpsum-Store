import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../profileSlice';
import { validateEmail, validateName, validatePhone } from '../../../utils/inputValidation';
import { useLanguage } from '../../../context/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FormContainer = styled(motion.form)`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    display: inline;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.hasError ? '#e74c3c' : '#ecf0f1'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : '#3498db'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)'};
  }

  &::placeholder {
    color: #bdc3c7;
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ErrorMessage = styled(motion.span)`
  color: #e74c3c;
  font-size: 0.85rem;
  font-weight: 500;
  min-height: 20px;
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;

  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #229954, #27ae60);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(39, 174, 96, 0.3);
  }
`;

const CancelButton = styled(Button)`
  background: linear-gradient(45deg, #95a5a6, #7f8c8d);
  color: white;

  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #7f8c8d, #6c7b7d);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(149, 165, 166, 0.3);
  }
`;

const ProfileEditForm = ({ onCancel, profileData }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    surname: profileData?.surname || '',
    email: profileData?.email || '',
    phone: profileData?.phone || ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        surname: profileData.surname || '',
        email: profileData.email || '',
        phone: profileData.phone || ''
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input to prevent XSS
    const sanitizedValue = value
      .trim()
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    // Validate surname
    const surnameValidation = validateName(formData.surname);
    if (!surnameValidation.isValid) {
      newErrors.surname = surnameValidation.message;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    // Validate phone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onCancel();
      }, 2000);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (showSuccess) {
    return (
      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SuccessMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {t('profileUpdatedSuccessfully') || 'Profile updated successfully!'}
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <FormGrid>
        <FormGroup>
          <Label>{t('firstName')}</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('firstNamePlaceholder')}
            hasError={!!errors.name}
            disabled={isLoading}
            maxLength={50}
          />
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: errors.name ? 1 : 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errors.name}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label>{t('lastName')}</Label>
          <Input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder={t('lastNamePlaceholder')}
            hasError={!!errors.surname}
            disabled={isLoading}
            maxLength={50}
          />
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: errors.surname ? 1 : 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errors.surname}
          </ErrorMessage>
        </FormGroup>
      </FormGrid>

      <FormGrid>
        <FormGroup>
          <Label>{t('emailAddress')}</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('emailPlaceholder')}
            hasError={!!errors.email}
            disabled={isLoading}
            maxLength={100}
          />
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: errors.email ? 1 : 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errors.email}
          </ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label>{t('phoneNumber')}</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('phonePlaceholder')}
            hasError={!!errors.phone}
            disabled={isLoading}
            maxLength={20}
          />
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: errors.phone ? 1 : 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errors.phone}
          </ErrorMessage>
        </FormGroup>
      </FormGrid>

      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: 'center', marginBottom: '20px' }}
        >
          {error}
        </ErrorMessage>
      )}

      <ButtonContainer>
        <CancelButton
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('cancel')}
        </CancelButton>
        <SaveButton
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (t('saving') || 'Saving...') : t('save')}
        </SaveButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default ProfileEditForm;