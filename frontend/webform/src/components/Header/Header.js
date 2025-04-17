import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
      <section className={styles.logoContainer}>
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle navigation menu">
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
        <Link to="/" className={styles.logo} aria-label="Home">
          <img src={logo} alt="Website Logo" />
        </Link>
      </section>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`} aria-label="Primary navigation">
        <ul className={styles.navList}>
          <li>
            <Link to="/" className={styles.navItem} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/store" className={styles.navItem} onClick={closeMenu}>
              Store
            </Link>
          </li>
          <li>
            <Link to="/about" className={styles.navItem} onClick={closeMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className={styles.navItem} onClick={closeMenu}>
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>

      <section className={styles.actions}>
        <Link to="/cart" className={styles.iconButton} aria-label="Cart">
          <i className="fa fa-shopping-cart"></i>
        </Link>
        <button onClick={checkProfile} className={styles.iconButton} aria-label="Profile">
          <i className="fa fa-user"></i>
        </button>
      </section>
    </header>
  );
};

export default Header;
