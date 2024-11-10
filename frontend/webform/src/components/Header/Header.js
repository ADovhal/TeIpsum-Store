import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../../services/api';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const navigate = useNavigate();

  // Функция для проверки действительности токена на сервере
  const validateToken = async () => {
    const token = localStorage.getItem('token');  // Извлекаем токен из localStorage

    // Если токена нет, сразу перенаправляем на страницу логина
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Отправляем запрос на сервер для валидации токена
      const response = await api.post(
        '/validate-token',
        {},  // Пустое тело, так как токен передается в заголовке
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Передаем токен в заголовке
          },
        }
      );
      // Если токен валиден (сервер вернул статус 200), перенаправляем на профиль
      if (response.status === 200) {
        navigate('/profile');
      } else {
        // Если токен не валиден, перенаправляем на страницу логина
        navigate('/login');
      }
    } catch (error) {
      // Если возникла ошибка при запросе (например, токен недействителен или запрос не удался)
      console.error('Token validation failed:', error);
      navigate('/login');  // Перенаправляем на логин
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}><img src={logo} alt="Logo" /></Link>

      <nav className={styles.nav}>
        <Link to="/" className={styles.navItem}>Home</Link>
        <Link to="/store" className={styles.navItem}>Store</Link>
        <Link to="/about" className={styles.navItem}>About Us</Link>
        <Link to="/contact" className={styles.navItem}>Contact Us</Link>
      </nav>
      <div className={styles.actions}>
        <Link to="/cart" className={styles.iconButton}>
            <i className="fa fa-shopping-cart"></i>
        </Link>
        {/* Используем кнопку для вызова функции проверки токена */}
        <button onClick={validateToken} className={styles.iconButton}>
            <i className="fa fa-user"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
