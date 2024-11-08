import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { registerUser } from '../../../services/authService';
import { validateEmail, validatePasswordLength } from '../../../utils/validation';
import styles from '../AuthForm.module.css';

const RegisterForm = () => {
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
  const [isSubmitted, setIsSubmitted] = useState(false); // Флаг отправки формы

  const navigate = useNavigate();

  // Обработчик изменений формы
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: DOMPurify.sanitize(value)
    }));

    // Сбрасываем ошибку для текущего поля при изменении
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Устанавливаем флаг, чтобы показывать ошибки после отправки формы

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

    // Валидация имени
    if (!name.trim()) {
      setErrors((prevState) => ({ ...prevState, name: 'Имя обязательно' }));
      formIsValid = false;
    }

    // Валидация фамилии
    if (!surname.trim()) {
      setErrors((prevState) => ({ ...prevState, surname: 'Фамилия обязательна' }));
      formIsValid = false;
    }

    // Валидация email
    if (!validateEmail(email)) {
      setErrors((prevState) => ({ ...prevState, email: 'Некорректный email.' }));
      formIsValid = false;
    }

    // Валидация пароля
    if (!validatePasswordLength(password)) {
      setErrors((prevState) => ({ ...prevState, password: 'Пароль должен содержать минимум 8 символов.' }));
      formIsValid = false;
    }

    // Проверка совпадения пароля и подтверждения
    if (password !== confirmPassword) {
      setErrors((prevState) => ({ ...prevState, confirmPassword: 'Пароли не совпадают' }));
      formIsValid = false;
    }

    // Если форма не валидна, выходим
    if (!formIsValid) {
      setLoading(false);
      return;
    }

    try {
      // Регистрируем пользователя
      await registerUser({ name, surname, dob, email, phone, password });

      setSuccessMessage('Регистрация прошла успешно!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      // Сбрасываем форму
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
      setErrors({ email: err.message }); // Показ ошибки регистрации
      console.error('Ошибка регистрации:', err);
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className={`${styles.authForm} ${styles.registerForm}`}>
        <h2>Создать аккаунт</h2>
        <form onSubmit={handleSubmit}>

          <div className={styles.formGroup}>
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              placeholder="Введите ваше имя"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.name && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.name && isSubmitted && <p className={styles.errorMessage}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="surname">Фамилия</label>
            <input
              type="text"
              id="surname"
              placeholder="Введите вашу фамилию"
              value={formData.surname}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.surname && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.surname && isSubmitted && <p className={styles.errorMessage}>{errors.surname}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dob">Дата рождения</label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.dob && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.dob && isSubmitted && <p className={styles.errorMessage}>{errors.dob}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              id="email"
              placeholder="Введите вашу почту"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.email && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.email && isSubmitted && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Телефон</label>
            <input
              type="text"
              id="phone"
              placeholder="Введите ваш телефон"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.phone && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.phone && isSubmitted && <p className={styles.errorMessage}>{errors.phone}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Введите ваш пароль"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.email && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.password && isSubmitted && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>

          {/* Поле для подтверждения пароля */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Подтвердите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.inputField} ${errors.confirmPassword && isSubmitted ? styles.errorInput : ''}`}
            />
            {errors.confirmPassword && isSubmitted && <p className={styles.errorMessage}>{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <p className={styles.registerLink}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
  );
};

export default RegisterForm;
