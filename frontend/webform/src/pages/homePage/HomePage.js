import React, { useRef, useState, useEffect, useContext } from 'react';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from '../../features/products/components/ProductCard';
import SummerCollection from './components/SummerCollection';
import bgLeft from '../../assets/images/mainBg_left_part.png';
import bgCenter from '../../assets/images/mainBg_middle_part.png';
import bgRight from '../../assets/images/mainBg_right_part.png';
import { HeaderHeightContext } from '../../context/HeaderHeightContext';
import lavresLeft from '../../assets/images/lavres_left.png';
import lavresRight from '../../assets/images/lavres_right.png';

const HomePage = () => {
  const aboutRef = useRef(null);
  const stickyHeaderRef = useRef(null);
  const productsRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const { headerHeight } = useContext(HeaderHeightContext);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, window.innerHeight * 0.8], [1, 0]);

  // Обновляем высоты элементов
  useEffect(() => {
    const updateStickyHeight = () => {
      if (stickyHeaderRef.current) {
        setStickyHeaderHeight(stickyHeaderRef.current.offsetHeight);
      }
    };

    updateStickyHeight();
    const resizeObserver = new ResizeObserver(updateStickyHeight);
    if (stickyHeaderRef.current) {
      resizeObserver.observe(stickyHeaderRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Логика для sticky и скрытия
  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current || !stickyHeaderRef.current || !productsRef.current || !headerHeight) return;

      const aboutRect = aboutRef.current.getBoundingClientRect();
      const stickyRect = stickyHeaderRef.current.getBoundingClientRect();
      const productsRect = productsRef.current.getBoundingClientRect();
      
      const shouldStick = aboutRect.top <= headerHeight && 
                        aboutRect.bottom > headerHeight + stickyRect.height;
      
      const shouldHideSticky = productsRect.top <= headerHeight + stickyRect.height;

      setIsSticky(shouldStick);
      setShouldHide(shouldHideSticky);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  const popularProducts = [
    // ... ваш массив продуктов ...
  ];

  return (
    <main className={styles.homePage}>
      {/* Hero Section */}
      <motion.div style={{ opacity: heroOpacity }} className={styles.heroSection}>
        <div className={styles.heroContent}>
          <aside><img src={bgLeft} alt="left" className={styles.bgleft} /></aside>
          <div><img src={bgCenter} alt="center" className={styles.bgcenter} /></div>
          <aside><img src={bgRight} alt="right" className={styles.bgright} /></aside>
          <div className={styles.heroText}>
            <h1>Te Ipsum</h1>
            <p>Vestments for the Inner Dialogue</p>
            <Link to="/store" className={styles.shopNowButton}>Discover products</Link>
          </div>
        </div>
      </motion.div>

      {/* <section ref={aboutRef} className={styles.aboutStore}>
        {isSticky && !shouldHide && <div style={{ height: stickyHeaderHeight}} />}

        <motion.div
          ref={stickyHeaderRef}
          className={`${styles.aboutStickyHeader}`}
          style={{
            position: isSticky && !shouldHide ? 'fixed' : 'relative',
            top: isSticky && !shouldHide ? `${headerHeight}px` : 'auto',
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 10,
            background: '#E6E6E4',
            padding: '1vh 0',
            // opacity: 0.8,
            // backdropFilter: 'blur(10px)',
            // opacity: shouldHide ? 0 : 1,
            transform: shouldHide ? 'translateY(-20px)' : 'translateY(0)',
            boxShadow: isSticky && !shouldHide ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
          }}
        >
          <aside><img src={lavresLeft} alt="left" className={styles.lavresLeft} /></aside>
          <aside><img src={lavresRight} alt="right" className={styles.lavresRight} /></aside>
          <h2>About our shop</h2>
          <p>Thoughtful clothing for the inner dialogue.</p>
          <p>Minimal, symbolic, and made for self-expression.</p>
        </motion.div>

        <div className={styles.aboutContent}>
          <p>More details about the store below...</p>
          {[...Array(20)].map((_, i) => (
            <p key={i}>Additional content line {i + 1}</p>
          ))}
        </div>
      </section> */}
      <SummerCollection />    
      <section 
        ref={productsRef} 
        className={styles.popularProducts} 
        aria-label="Popular Products"
        style={{ paddingTop: shouldHide ? 0 : stickyHeaderHeight }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: shouldHide ? 1 : 0,
            y: shouldHide ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
        >
          Popular products
        </motion.h2>
        <div className={styles.productList}>
          {popularProducts.map(product => (
            <article key={product.id}>
              <ProductCard product={product} />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;