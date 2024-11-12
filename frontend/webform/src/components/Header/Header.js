import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useDispatch } from 'react-redux';
import { refreshToken } from '../../features/auth/authSlice';  // Импортируем refreshToken
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';


const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const navigate = useNavigate()
	const dispatch = useDispatch();
  // Функция для проверки действительности токена и обновления токена
  	const validateToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      // Если есть accessToken, пробуем выполнить запрос с ним.
      // Если запрос не удался, пытаемся обновить токен с помощью refreshToken.
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Если запрос успешен, перенаправляем на профиль
      if (response.status === 200) {
        navigate('/profile');
      }
    } catch (error) {
      if (refreshTokenValue) {
        // Попытка обновить токен с помощью refreshToken
        try {
          const refreshResponse = await dispatch(refreshToken(refreshTokenValue)).unwrap();
          const newAccessToken = refreshResponse.accessToken;
          localStorage.setItem('accessToken', newAccessToken);  // Сохраняем новый accessToken

          // После обновления токена, повторно вызываем функцию для загрузки данных профиля
          const retryResponse = await api.get('/users/profile', {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          if (retryResponse.status === 200) {
            navigate('/profile');
          }
        } catch (refreshError) {
          // Если не удалось обновить токен, перенаправляем на логин
          console.error('Token refresh failed:', refreshError);
          navigate('/login');
        }
      } else {
        // Если нет refreshToken, сразу перенаправляем на логин
        navigate('/login');
      }
    }
};


const toggleMenu = () => {
	setMenuOpen(prevState => !prevState) // Переключаем состояние меню
}
const closeMenu = () => {
	setMenuOpen(false) // Закрываем меню при клике на ссылку
}
return (
	<header className={styles.header}>
		{/* Контейнер для гамбургера и лого */}
		<div className={styles.logoContainer}>
			<button className={styles.hamburger} onClick={toggleMenu}>
				<span className={styles.bar}></span>
				<span className={styles.bar}></span>
				<span className={styles.bar}></span>
			</button>
			<Link to='/' className={styles.logo}>
				<img src={logo} alt='Logo' />
			</Link>
		</div>
		<nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
			<Link to='/' className={styles.navItem} onClick={closeMenu}>
				Home
			</Link>
			<Link to='/store' className={styles.navItem} onClick={closeMenu}>
				Store
			</Link>
			<Link to='/about' className={styles.navItem} onClick={closeMenu}>
				About Us
			</Link>
			<Link to='/contact' className={styles.navItem} onClick={closeMenu}>
				Contact Us
			</Link>
		</nav>
		<div className={styles.actions}>
			<Link to='/cart' className={styles.iconButton}>
				<i className='fa fa-shopping-cart'></i>
			</Link>
			<button onClick={validateToken} className={styles.iconButton}>
				<i className='fa fa-user'></i>
			</button>
		</div>
	</header>
)}

export default Header
