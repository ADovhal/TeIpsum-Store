import React, { useState, useEffect, useRef} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart, closeCart } from '../../features/cart/cartSlice';
import { HeaderHeightContext } from '../../context/HeaderHeightContext';
import { useContext } from 'react';
import apiUser from '../../services/apiUser';
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

  const dispatch = useDispatch();
  const { isOpen, items } = useSelector((state) => state.cart);
  const cartIconRef = useRef(null);
  const cartRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cartRef.current && cartRef.current.contains(e.target) ||
        cartIconRef.current && cartIconRef.current.contains(e.target)
      ) {
        return;
      }
      dispatch(closeCart());
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dispatch]);

  const checkProfile = async () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }else{
      navigate('/profile')
    }

    try {
      const response = await apiUser.get('/users/profile', {
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
        <button
          ref={cartIconRef}
          onClick={() => dispatch(toggleCart())}
          className={`${styles.iconButton} ${isOpen ? styles.active : ''}`}
          aria-label="Cart"
        >
        <i className="fa fa-shopping-cart"></i>
        </button>
        <button onClick={checkProfile} className={styles.iconButton} aria-label="Profile">
          <i className="fa fa-user"></i>
        </button>
      </section>
      {isOpen && (
        <div ref={cartRef} className={styles.cartDropdown}>
          {items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>{item.name} — {item.quantity}</li>
                ))}
              </ul>
              <Link to="/cart">
                <button onClick={() => dispatch(closeCart())}>Open full cart</button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
