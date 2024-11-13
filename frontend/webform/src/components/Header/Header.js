import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  const checkProfile = async () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }else{
      navigate('/profile')
    }

    try {
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
