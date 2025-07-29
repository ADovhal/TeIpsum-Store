import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart, closeCart } from '../../features/cart/cartSlice';
import { logoutAsync } from '../../features/auth/authSlice';
import { HeaderHeightContext } from '../../context/HeaderHeightContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import CartSidebar from '../../features/cart/components/CartSidebar';
import FireButton from '../../styles/FireButton';
import styles from './Header.module.css';
import logo from '../../assets/images/ActualLogo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setHeaderHeight } = useContext(HeaderHeightContext);
  const { t } = useLanguage();
  const { theme } = useTheme();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);


  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    document.body.classList.toggle('menu-open', isMenuOpen);
  }, [isMenuOpen]);

  const handleToggleCart = () => {
    dispatch(toggleCart());
  };
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [setHeaderHeight]);

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/store', { 
        state: { searchQuery: searchQuery.trim() } 
      });
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header 
        ref={headerRef} 
        className={styles.header}
        style={{
          backgroundColor: theme.header,
          borderBottom: `1px solid ${theme.border}`,
          boxShadow: theme.shadow
        }}
      >
        <section className={styles.headerLeft}>
          <button 
            className={styles.hamburger} 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
              <span className={`${styles.icon} ${isMenuOpen ? styles.close : ''}`}>
                {isMenuOpen ? '✕' : '☰'}
              </span>
          </button>
        </section>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <img src={logo} alt="TeIpsum Logo" />
        </Link>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li><FireButton><Link to="/" className={styles.navItem} onClick={closeMenu}>{t('home')}</Link></FireButton></li>
            <li><FireButton><Link to="/pre-store" className={styles.navItem} onClick={closeMenu}>{t('store')}</Link></FireButton></li>
            <li><FireButton><Link to="/about" className={styles.navItem} onClick={closeMenu}>{t('about')}</Link></FireButton></li>
            <li><FireButton><Link to="/contact" className={styles.navItem} onClick={closeMenu}>{t('contact')}</Link></FireButton></li>
            <li><FireButton><Link to="/discounts" className={styles.navItem} onClick={closeMenu}>{t('discounts')}</Link></FireButton></li>
            <li><FireButton><Link to="/new-collection" className={styles.navItem} onClick={closeMenu}>{t('newCollection')}</Link></FireButton></li>
          </ul>
        </nav>

        <section className={styles.headerRight}>
          <form onSubmit={handleSearch} className={styles.searchContainer}>
            <input
              name="search"
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              style={{
                backgroundColor: theme.input,
                color: theme.textPrimary,
                borderColor: theme.inputBorder
              }}
            />
            <span className={styles.searchIcon}>🔍</span>
          </form>

          <div className={styles.actions}>
            <button
              onClick={handleToggleCart}
              className={styles.iconButton}
              aria-label={`Shopping cart (${cartItemsCount} items)`}
            >
              <i className="fa fa-shopping-cart" style={{ color: theme.textPrimary }}></i>
              {cartItemsCount > 0 && (
                <span 
                  className={styles.cartBadge}
                  style={{
                    backgroundColor: theme.accent,
                    color: 'white'
                  }}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <Link to="/profile" className={styles.iconButton} onClick={closeMenu}>
                  <i className="fa fa-user" style={{ color: theme.textPrimary }}></i>
                </Link>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link to="/login" className={styles.iconButton} onClick={closeMenu}>
                <i className="fa fa-user" style={{ color: theme.textPrimary }}></i>
              </Link>
            )}
          </div>
        </section>
      </header>

      <CartSidebar onClose={() => dispatch(closeCart())} />
    </>
  );
};

export default Header;
