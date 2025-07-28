import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { registerUser } from '../AuthService';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
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

const RegisterForm = () => {
  useEffect(() => {
    document.title = "Sign Up - TeIpsum";
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
      setErrors({ general: 'Too many registration attempts. Please try again later.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Define validation rules
    const validationRules = {
      firstName: { required: true, validator: validateName },
      lastName: { required: true, validator: validateName },
      email: { required: true, validator: validateEmail },
      phone: { required: true, validator: validatePhone },
      password: { required: true, validator: validatePassword },
      confirmPassword: { required: true, validator: (value) => {
        if (value !== formData.password) {
          return { isValid: false, message: 'Passwords do not match' };
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
        setErrors({ email: 'A user with this email already exists' });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
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
            <h2>Welcome to TeIpsum!</h2>
            <p>Your account has been created successfully. You can now sign in to access your profile.</p>
            <SubmitButton
              onClick={handleRedirectToLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '20px' }}
            >
              Sign In Now
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
        <Title>Create Account</Title>
        <Subtitle>Join TeIpsum and discover your style</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
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
              <Label>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
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
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
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
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
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
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <LoginLink>
          Already have an account? <Link to="/login">Sign In</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterForm;
