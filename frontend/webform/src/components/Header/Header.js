// Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';  // Импортируем настроенный axios
import { useSelector } from 'react-redux';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';
// import { loadProfile } from '../../features/profile/profileSlice';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  // Функция для проверки профиля пользователя
  const checkProfile = async () => {
    if (!accessToken) {
      // Если нет токена, перенаправляем на страницу логина
      navigate('/login');
      return;
    }else{
      navigate('/profile')
    }

    try {
      // Пытаемся получить данные профиля
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        // Если токен действителен, перенаправляем в профиль
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Здесь перехватывает автоматический механизм обновления токена в api.js
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      {/* Контейнер для гамбургера и лого */}
      <div className={styles.logoContainer}>
        <button className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* Навигационное меню */}
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <Link to="/" className={styles.navItem} onClick={closeMenu}>
          Home
        </Link>
        <Link to="/store" className={styles.navItem} onClick={closeMenu}>
          Store
        </Link>
        <Link to="/about" className={styles.navItem} onClick={closeMenu}>
          About Us
        </Link>
        <Link to="/contact" className={styles.navItem} onClick={closeMenu}>
          Contact Us
        </Link>
      </nav>

      {/* Блок действий */}
      <div className={styles.actions}>
        <Link to="/cart" className={styles.iconButton}>
          <i className="fa fa-shopping-cart"></i>
        </Link>
        <button onClick={checkProfile} className={styles.iconButton}>
          <i className="fa fa-user"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
