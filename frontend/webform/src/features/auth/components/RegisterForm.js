import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { registerUser } from '../AuthService';
import { validateEmail, validatePasswordLength } from '../../../utils/validation';
import styles from '../components/AuthForm.module.css';

const RegisterForm = () => {

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: DOMPurify.sanitize(value)
    }));

    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    setErrors({
      name: '',
      surname: '',
      dob: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });

    setSuccessMessage('');
    setLoading(true);

    const { name, surname, dob, email, phone, password, confirmPassword } = formData;
    let formIsValid = true;

    if (!name.trim()) {
      setErrors((prevState) => ({ ...prevState, name: 'Name is required!' }));
      formIsValid = false;
    }

    if (!surname.trim()) {
      setErrors((prevState) => ({ ...prevState, surname: 'Surname is required!' }));
      formIsValid = false;
    }

    if (!validateEmail(email)) {
      setErrors((prevState) => ({ ...prevState, email: 'Incorrect email!' }));
      formIsValid = false;
    }

    if (!validatePasswordLength(password)) {
      setErrors((prevState) => ({ ...prevState, password: 'Password should contain at least 8 characters!' }));
      formIsValid = false;
    }

    if (password !== confirmPassword) {
      setErrors((prevState) => ({ ...prevState, confirmPassword: 'Passwords don\'t match!' }));
      formIsValid = false;
    }

    if (!formIsValid) {
      setLoading(false);
      return;
    }

    try {

      await registerUser({ name, surname, dob, email, phone, password });

      setSuccessMessage('Success!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      setFormData({
        name: '',
        surname: '',
        dob: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setErrors({ email: err.message });
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (

      <main className={`${styles.authForm} ${styles.registerForm}`}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>

          <fieldset className={styles.formGroup}>
            <legend className="visually-hidden">Name</legend>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              aria-label='Name'
              value={formData.name}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.name && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.name && isSubmitted && <p className={styles.errorMessage}>{errors.name}</p>}
          </fieldset>

          <fieldset className={styles.formGroup}>
            <legend className="visually-hidden">Last name</legend>
            <input
              type="text"
              id="surname"
              placeholder="Your last name"
              aria-label='surname'
              value={formData.surname}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.surname && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.surname && isSubmitted && <p className={styles.errorMessage}>{errors.surname}</p>}
          </fieldset>

          <fieldset className={styles.formGroup}>
            <legend className="visually-hidden">Date of Birth</legend>
            <input
              type="date"
              id="dob"
              aria-label='Date of Birth'
              value={formData.dob}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.dob && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.dob && isSubmitted && <p className={styles.errorMessage}>{errors.dob}</p>}
          </fieldset>

          <fieldset className={styles.formGroup}>
            <legend className="visually-hidden">Email</legend>
            <input
              type="email"
              id="email"
              placeholder="Your email"
              aria-label='Email'
              value={formData.email}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.email && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.email && isSubmitted && <p className={styles.errorMessage}>{errors.email}</p>}
          </fieldset>

          <fieldset className={styles.formGroup}>
            <legend className="visually-hidden">Phone</legend>
            <input
              type="text"
              id="phone"
              placeholder="Your phone number"
              aria-label='Phone'
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.phone && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.phone && isSubmitted && <p className={styles.errorMessage}>{errors.phone}</p>}
          </fieldset>

          <fieldset className={styles.formGroup}>
            <legend className="visually-hidden">Password</legend>
            <input
              type="password"
              id="password"
              placeholder="Choose your password"
              aria-label='Password'
              value={formData.password}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.email && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.password && isSubmitted && <p className={styles.errorMessage}>{errors.password}</p>}
          </fieldset>

          <fieldset className={styles.formGroup}>
            <legend className="visually-hidden">Confirm password</legend>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repeat your password"
              aria-label='Confirm password'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.confirmPassword && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.confirmPassword && isSubmitted && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
          </fieldset>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>

        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <p className={styles.registerLink}>
          Already have account? <Link to="/login">Sign In</Link>
        </p>
      </main>
  );
};

export default RegisterForm;
