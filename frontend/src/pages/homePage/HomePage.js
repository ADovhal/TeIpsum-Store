import React, { useRef, useState, useEffect, useContext } from 'react';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from '../../features/products/components/ProductCard';
import SummerCollection from './components/SummerCollection';
import FeaturedCollection from './components/FeaturedCollection';
import SEO from '../../components/SEO';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import bgLeft from '../../assets/images/mainBg_left_part.png';
import bgCenter from '../../assets/images/mainBg_middle_part.png';
import bgRight from '../../assets/images/mainBg_right_part.png';
import { HeaderHeightContext } from '../../context/HeaderHeightContext';

const HomePage = () => {
  const aboutRef = useRef(null);
  const stickyHeaderRef = useRef(null);
  const productsRef = useRef(null);
  const [setIsSticky] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const { headerHeight } = useContext(HeaderHeightContext);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  const { t } = useLanguage();
  const { theme } = useTheme();

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
  }, [headerHeight, setIsSticky]);

  const popularProducts = [
    {
      id: 1,
      title: "Classic White T-Shirt",
      price: 29.99,
      discount: 15,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      category: "MENS_CLOTHING",
      subcategory: "T_SHIRTS",
      gender: "MEN",
      available: true
    },
    {
      id: 2,
      title: "Elegant Summer Dress",
      price: 89.99,
      discount: 0,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
      category: "WOMENS_CLOTHING",
      subcategory: "SHIRTS",
      gender: "WOMEN",
      available: true
    },
    {
      id: 3,
      title: "Premium Denim Jeans",
      price: 129.99,
      discount: 25,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      category: "MENS_CLOTHING",
      subcategory: "JEANS",
      gender: "MEN",
      available: true
    },
    {
      id: 4,
      title: "Casual Sneakers",
      price: 79.99,
      discount: 10,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      category: "SHOES",
      subcategory: "SNEAKERS",
      gender: "UNISEX",
      available: true
    }
  ];

  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TeIpsum",
    "url": "https://teipsum.com",
    "description": "Sustainable fashion brand creating eco-friendly clothing with timeless designs and ethical production practices.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://teipsum.com/store?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main 
      className={styles.homePage}
      style={{
        backgroundColor: theme.primary,
        color: theme.textPrimary
      }}
    >
      <SEO
        title={t('heroTitle')}
        description="Discover sustainable fashion at TeIpsum. Shop our eco-friendly clothing collection featuring timeless designs, ethical production, and premium quality materials for men, women, and kids."
        keywords="sustainable fashion, eco-friendly clothing, ethical fashion, sustainable clothing, organic fashion, TeIpsum, women's clothing, men's clothing, kids clothing, summer collection"
        canonicalUrl="/"
        image="/images/teipsum-homepage.jpg"
        imageAlt="TeIpsum Sustainable Fashion Collection - Homepage"
        structuredData={homePageStructuredData}
      />
      
      {/* Hero Section */}
      <motion.div 
        style={{ opacity: heroOpacity }} 
        className={styles.heroSection}
        data-theme-bg={theme.gradient}
      >
        <div className={styles.heroContent}>
          <aside><img src={bgLeft} alt="left" className={styles.bgleft} /></aside>
          <div><img src={bgCenter} alt="center" className={styles.bgcenter} /></div>
          <aside><img src={bgRight} alt="right" className={styles.bgright} /></aside>
          <div className={styles.heroText}>
            <h1 style={{ color: theme.textPrimary }}>{t('heroTitle')}</h1>
            <p style={{ color: theme.textSecondary }}>{t('heroSubtitle')}</p>
            <Link 
              to="/store" 
              className={styles.shopNowButton}
              style={{
                background: theme.buttonPrimary,
                color: 'white'
              }}
            >
              {t('discoverProducts')}
            </Link>
          </div>
        </div>
      </motion.div>

      <SummerCollection />    
      <FeaturedCollection />
    </main>
  );
};

export default HomePage;