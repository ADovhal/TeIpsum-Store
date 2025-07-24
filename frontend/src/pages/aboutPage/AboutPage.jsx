import { useRef, useState, useEffect, useContext } from 'react';
import styles from './AboutPage.module.css';
import { motion } from 'framer-motion';
import { HeaderHeightContext } from '../../context/HeaderHeightContext';
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

  return (
    <main className={styles.homePage}>
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
      </section>
    </main>
  );
};

export default AboutPage;