import { useRef, useState, useEffect, useContext } from 'react';
import styles from './AboutPage.module.css';
import { motion } from 'framer-motion';
import { HeaderHeightContext } from '../../context/HeaderHeightContext';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';
import lavresLeft from '../../assets/images/lavres_left.png';
import lavresRight from '../../assets/images/lavres_right.png';

const AboutPage = () => {
  const aboutRef = useRef(null);
  const stickyHeaderRef = useRef(null);
  const productsRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const { headerHeight } = useContext(HeaderHeightContext);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);

  const { t } = useLanguage();

  useEffect(() => {
      document.title = `${t('about')} - TeIpsum`;
    }, [t]);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current || !stickyHeaderRef.current || !productsRef.current || !headerHeight) return;

      const aboutRect = aboutRef.current.getBoundingClientRect();
      const stickyRect = stickyHeaderRef.current.getBoundingClientRect();
      
      const shouldStick = aboutRect.top <= headerHeight && 
                        aboutRect.bottom > headerHeight + stickyRect.height;


      setIsSticky(shouldStick);
    //   setShouldHide(shouldHideSticky); 
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  const aboutPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About TeIpsum",
    "description": "Learn about TeIpsum's commitment to sustainable fashion, our brand philosophy, and our journey in creating eco-friendly clothing.",
    "mainEntity": {
      "@type": "Organization",
      "name": "TeIpsum",
      "foundingDate": "2020",
      "description": "Sustainable fashion brand creating eco-friendly clothing with timeless designs and ethical production practices."
    }
  };

  return (
    <main className={styles.homePage}>
      <SEO
        title="About Us - Our Sustainable Fashion Story"
        description="Learn about TeIpsum's commitment to sustainable fashion, our brand philosophy, and our journey in creating eco-friendly clothing with ethical production practices."
        keywords="about TeIpsum, sustainable fashion brand, eco-friendly clothing company, ethical fashion, brand story, sustainable clothing philosophy"
        canonicalUrl="/about"
        image="/images/teipsum-about.jpg"
        imageAlt="About TeIpsum - Sustainable Fashion Brand Story"
        structuredData={aboutPageStructuredData}
      />
      
      <section ref={aboutRef} className={styles.aboutStore}>
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
          <h2>{t('aboutOurShopTitle')}</h2>
          <p>{t('thoughtfulClothing')}</p>
          <p>{t('minimalSymbolic')}</p>
        </motion.div>

        <div className={styles.aboutContent}>
          <div className={styles.brandHistory}>
            <motion.div 
              className={styles.historySection}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3>{t('ourStory')}</h3>
              <p>{t('foundingStory')}</p>
            </motion.div>

            <motion.div 
              className={styles.historySection}
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>{t('thePhilosophy')}</h3>
              <p>{t('philosophyText')}</p>
            </motion.div>

            <motion.div 
              className={styles.historySection}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3>{t('sustainability')}</h3>
              <p>{t('sustainabilityText')}</p>
            </motion.div>

            <motion.div 
              className={styles.historySection}
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>{t('community')}</h3>
              <p>{t('communityText')}</p>
            </motion.div>

            <motion.div 
              className={styles.historySection}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <h3>{t('futureVision')}</h3>
              <p>{t('futureVisionText')}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;