import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { validateEmail, rateLimiter } from '../../../utils/inputValidation';
import { login } from '../authSlice';

const LoginContainer = styled.div`
  min-height: 95vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 100%;
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

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #3498db, #2980b9);
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
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ForgotPassword = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
  display: block;
  
  &:hover {
    text-decoration: underline;
  }
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

const RegisterLink = styled.p`
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

const LoginForm = () => {
  useEffect(() => {
    document.title = "Sign In - TeIpsum";
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rateLimiter.isAllowed('login_attempt', 5, 300000)) {
      setErrors({ general: 'Too many login attempts. Please try again later.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setErrors(prev => ({ ...prev, email: emailValidation.message }));
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(login({ 
        email: emailValidation.value, 
        password: formData.password 
      })).unwrap();
      
      setFormData({ email: '', password: '' });
      navigate('/profile');
    } catch (err) {
      setErrors({ general: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    alert('Password reset functionality would be implemented here. Please contact support for now.');
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account to continue</Subtitle>

        <Form onSubmit={handleSubmit}>
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
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              hasError={!!errors.password}
              required
            />
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <ForgotPassword onClick={handleForgotPassword}>
          Forgot your password?
        </ForgotPassword>

        <Divider>
          <span>or</span>
        </Divider>

        <RegisterLink>
          Don't have an account? <Link to="/register">Create one</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginForm;