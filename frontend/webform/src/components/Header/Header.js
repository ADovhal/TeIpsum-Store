import React, { useState, useEffect, useRef} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeaderHeightContext } from '../../context/HeaderHeightContext';
import { useContext } from 'react';
import api from '../../services/api';
import styles from './Header.module.css';
import FireButton from '../../styles/FireButton';
import logo from '../../assets/images/ActualLogo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const { setHeaderHeight } = useContext(HeaderHeightContext);
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
      const updateHeight = () => {
          if (headerRef.current) {
              setHeaderHeight(headerRef.current.offsetHeight);
          }
      };
      updateHeight();
      const resizeObserver = new ResizeObserver(updateHeight);
      if (headerRef.current) {
          resizeObserver.observe(headerRef.current);
      }
      return () => resizeObserver.disconnect();
  }, [setHeaderHeight]);

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
    <header ref={headerRef} className={styles.header}>
      <section className={styles.headerLeft}>
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle navigation menu">
          <span className={styles.bar}/>
          <span className={styles.bar}/>
          <span className={styles.bar}/>
        </button>
        <Link to="/" className={styles.logo} aria-label="Home">
          <img src={logo} alt="Website Logo" />
        </Link>
      </section>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`} aria-label="Primary navigation">
        <ul className={styles.navList}>
          <li>
              <FireButton><Link to="/" className={styles.navItem} onClick={closeMenu}>Home</Link></FireButton>
          </li>
          <li>
              <FireButton><Link to="/store" className={styles.navItem} onClick={closeMenu}>Store</Link></FireButton>
          </li>
          <li>
              <FireButton><Link to="/about" className={styles.navItem} onClick={closeMenu}>About</Link></FireButton>
          </li>
          <li>
              <FireButton><Link to="/contact" className={styles.navItem} onClick={closeMenu}>Contact</Link></FireButton>
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
