import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import { useLanguage } from '../../../context/LanguageContext';
import { enUS, de, pl, uk } from 'date-fns/locale';

import { registerUser } from '../AuthService';
import { 
  validateEmail, 
  validatePassword, 
  validateName,
  validateDateOfBirth,
  validatePhone,
  validateForm,
  rateLimiter
} from '../../../utils/inputValidation';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const RegisterCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  box-sizing: unset;
  scrollbar-width: none;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid ${props => props.hasError ? '#e74c3c' : '#ecf0f1'};
  border-radius: 10px;
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
`;

const ErrorMessage = styled(motion.span)`
  color: #e74c3c;
  font-size: 0.85rem;
  font-weight: 500;
`;

const PasswordStrength = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
`;

const StrengthBar = styled.div`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: ${props => {
    if (props.active) {
      switch (props.strength) {
        case 'weak': return '#e74c3c';
        case 'medium': return '#f39c12';
        case 'strong': return '#27ae60';
        default: return '#ecf0f1';
      }
    }
    return '#ecf0f1';
  }};
  transition: all 0.3s ease;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ecf0f1;
  }
  
  span {
    color: #7f8c8d;
    padding: 0 15px;
    font-size: 0.9rem;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  color: #7f8c8d;
  margin-top: 20px;
  font-size: 0.95rem;
  
  a {
    color: #3498db;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 15px;
    border: 2px solid ${props => props.hasError ? '#e74c3c' : '#ecf0f1'};
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    cursor: pointer;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: ${props => props.hasError ? '#e74c3c' : '#3498db'};
      box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)'};
    }

    &::placeholder {
      color: #bdc3c7;
    }
  }

  .react-datepicker {
    font-family: inherit;
    border: none;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .react-datepicker__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-bottom: none;
    border-radius: 0;
    padding: 20px 0 15px;
  }

  .react-datepicker__current-month {
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  .react-datepicker__day-names {
    margin-bottom: 0;
  }

  .react-datepicker__day-name {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    width: 2.2rem;
    line-height: 2.2rem;
  }

  .react-datepicker__navigation {
    top: 22px;
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }
  }

  .react-datepicker__navigation-icon::before {
    border-color: white;
    border-width: 2px 2px 0 0;
    width: 7px;
    height: 7px;
  }

  .react-datepicker__month-container {
    background: white;
  }

  .react-datepicker__month {
    margin: 15px;
  }

  .react-datepicker__day {
    width: 2.2rem;
    line-height: 2.2rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    margin: 2px;
    color: #2c3e50;
    font-weight: 500;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      transform: scale(1.1);
    }
  }

  .react-datepicker__day--selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    transform: scale(1.1);

    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      transform: scale(1.1);
    }
  }

  .react-datepicker__day--today {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    font-weight: 600;
  }

  .react-datepicker__day--outside-month {
    color: #bdc3c7;
  }

  .react-datepicker__day--disabled {
    color: #ecf0f1;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      transform: none;
    }
  }

  .react-datepicker__year-dropdown,
  .react-datepicker__month-dropdown {
    background: white;
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 10px 0;
  }

  .react-datepicker__year-option,
  .react-datepicker__month-option {
    padding: 8px 15px;
    color: #2c3e50;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }
  }

  .react-datepicker__year-option--selected,
  .react-datepicker__month-option--selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker-popper {
    z-index: 9999;
  }

  .react-datepicker-popper[data-placement^="bottom"] {
    margin-top: 10px;
  }

  .react-datepicker-popper[data-placement^="top"] {
    margin-bottom: 10px;
  }
`;

const StyledDatePicker = styled(DatePicker)``;

const RegisterForm = () => {

  const { currentLanguage, t } = useLanguage();

  useEffect(() => {
    document.title = `${t('registerTitle')} - TeIpsum`;
  }, [t]);

  

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: null,
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  registerLocale('en', enUS);
  registerLocale('de', de);
  registerLocale('pl', pl);
  registerLocale('ua', uk);

  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rate limiting check
    if (!rateLimiter.isAllowed('register_attempt', 3, 300000)) { // 3 attempts per 5 minutes
      setErrors({ general: t('validation.tooManyAttempts') });
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Define validation rules
    const validationRules = {
      firstName: { required: true, validator: validateName },
      lastName: { required: true, validator: validateName },
      dob: { required: true, validator: validateDateOfBirth },
      email: { required: true, validator: validateEmail },
      phone: { required: true, validator: validatePhone },
      password: { required: true, validator: validatePassword },
      confirmPassword: { required: true, validator: (value) => {
        if (value !== formData.password) {
          return { isValid: false, message: t('validation.passwordsDontMatch') };
        }
        return { isValid: true, value };
      }}
    };

    // Validate form
    const validation = validateForm(formData, validationRules);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({
        name: validation.sanitizedData.firstName,
        surname: validation.sanitizedData.lastName,
        email: validation.sanitizedData.email,
        phone: validation.sanitizedData.phone,
        password: validation.sanitizedData.password
      });

      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already exists') || error.message.includes('уже существует')) {
        setErrors({ email: t('A user with this email already exists') });
      } else {
        setErrors({ general: t('Registration failed. Please try again.') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <RegisterContainer>
        <RegisterCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SuccessMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2>{t('welcomeTitle')}</h2>
            <p>{t('accountCreated')}</p>
            <SubmitButton
              onClick={handleRedirectToLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '20px' }}
            >
              {t('signInNow')}
            </SubmitButton>
          </SuccessMessage>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>{t('registerTitle')}</Title>
        <Subtitle>{t('registerSubtitle')}</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>{t('firstName')}</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('firstNamePlaceholder')}
                hasError={!!errors.firstName}
                required
              />
              {errors.firstName && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.firstName}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>{t('lastName')}</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('lastNamePlaceholder')}
                hasError={!!errors.lastName}
                required
              />
              {errors.lastName && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.lastName}
                </ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>{t('emailAddress')}</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("emailPlaceholder")}
              hasError={!!errors.email}
              required
            />
            {errors.email && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.email}
              </ErrorMessage>
            )}
          </FormGroup>
          <FormRow>
            <FormGroup>
              <Label>{t('phoneNumber')}</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('phonePlaceholder')}
                hasError={!!errors.phone}
                required
              />
              {errors.phone && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.phone}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>{t('dateOfBirth')}</Label>
              <DatePickerWrapper hasError={!!errors.dob}>
                <StyledDatePicker
                  locale={currentLanguage}
                  selected={formData.dob}
                  onChange={(date) => setFormData(prev => ({ ...prev, dob: date }))}
                  dateFormat={
                    currentLanguage === 'en' ? 'MM/dd/yyyy' :
                    ['ru', 'ua', 'de', 'pl'].includes(currentLanguage) ? 'dd.MM.yyyy' :
                    'dd/MM/yyyy'
                  }
                  placeholderText={t("selectBirthDate")}
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  required
                />
              </DatePickerWrapper>
              {errors.dob && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.dob}
                </ErrorMessage>
              )}
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label>{t('password')}</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('passwordPlaceholder')}
              hasError={!!errors.password}
              required
            />
            {formData.password && (
              <PasswordStrength>
                {[1, 2, 3, 4, 5].map(level => (
                  <StrengthBar
                    key={level}
                    active={passwordStrength >= level}
                    strength={getStrengthLabel(passwordStrength)}
                  />
                ))}
              </PasswordStrength>
            )}
            {errors.password && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.password}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>{t('confirmPassword')}</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('confirmPasswordPlaceholder')}
              hasError={!!errors.confirmPassword}
              required
            />
            {errors.confirmPassword && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.confirmPassword}
              </ErrorMessage>
            )}
          </FormGroup>

          {errors.general && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errors.general}
            </ErrorMessage>
          )}

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? t('creatingAccount') : t('createAccount')}
          </SubmitButton>
        </Form>

        <Divider>
          <span>{t('or')}</span>
        </Divider>

        <LoginLink>
          {t('alreadyHaveAccount')} <Link to="/login">{t('signIn')}</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterForm;
