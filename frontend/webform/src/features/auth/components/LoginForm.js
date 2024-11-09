import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { authLoginUser } from '../AuthService';
import DOMPurify from 'dompurify';
import { validateEmail, validatePasswordLength } from '../../../utils/validation';
import styles from './AuthForm.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {

    const sanitizedValue = DOMPurify.sanitize(e.target.value);
    setFormData({ ...formData, [e.target.id]: sanitizedValue });

    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
  
    const { email: userEmail, password } = formData;
    let formIsValid = true;

    if (!validateEmail(userEmail)) {
      setErrors((prevState) => ({ ...prevState, email: 'Некорректный email.' }));
      formIsValid = false;
    }

    if (!validatePasswordLength(password)) {
      setErrors((prevState) => ({ ...prevState, password: 'Пароль должен содержать минимум 8 символов.' }));
      formIsValid = false;
    }

    if (!formIsValid) return;
  
    try {
      const response = await authLoginUser({ email: userEmail, password });
  
      const { id, email, token } = response;

      if (!token || !id || !email) {
        throw new Error('Invalid response from server');
      }
  
      login({ id, email }, token);
      setFormData({ email: '', password: '' });
      navigate('/profile');
    } catch (err) {
      setErrors({ email: err.message, password: '' });
      console.error('Login error:', err);
    }
  };

  return (
      <div className={`${styles.authForm} ${styles.loginForm}`}>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.email ? styles.errorInput : ''}`}
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              // required
              className={`${styles.inputField} ${errors.password ? styles.errorInput : ''}`}
            />
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>
          <button type="submit" className={styles.submitButton}>Sign In</button>
        </form>
        <p className={styles.registerLink}>
          Don't have account? <Link to="/register">Create</Link>
        </p>
      </div>
  );
};

export default LoginForm;
