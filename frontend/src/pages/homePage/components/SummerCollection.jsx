import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './SummerCollection.module.css';
import dress1 from '../../../assets/images/summer_dress1.jpg';
import dress2 from '../../../assets/images/mans_clothing1.jpg';

const SummerCollection = () => {
  const sectionRef = useRef(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Background and general animations
  // const bgOpacity        = useTransform(scrollYProgress, [0, 0.07, 0.50, 0.60], [0.8, 1, 1, 0.8]);
  const headingY         = useTransform(scrollYProgress, [0, 0.19], [100, 0]);
  const headingOpacity   = useTransform(scrollYProgress, [0, 0.19], [0, 1]);

  // First section animations
  const firstImageScale  = useTransform(scrollYProgress, [0.07, 0.19], [0.8, 1]);
  const firstImageOpacity= useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const firstTextX       = useTransform(scrollYProgress, [0.05, 0.25], [100, 0]);
  const firstTextOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

  // Second section animations
  const secondImageScale  = useTransform(scrollYProgress, [0.07, 0.19], [0.8, 1]);
  const secondImageOpacity= useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const secondTextX       = useTransform(scrollYProgress, [0.05, 0.25], [100, 0]);
  const secondTextOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);

  // Parallax effects
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, 20]);


  return (
    <motion.section
      ref={sectionRef}
      className={styles.summerSection}
      // style={{ opacity: bgOpacity }}
    >
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <motion.div 
          className={styles.bgShape1} 
          style={{ y: parallaxY1 }}
        />
        <motion.div 
          className={styles.bgShape2} 
          style={{ y: parallaxY2 }}
        />
      </div>

      {/* Main Heading */}
      <motion.div 
        className={styles.headingContainer}
        style={{ y: headingY, opacity: headingOpacity }}
      >
        <h2 className={styles.mainHeading}>{ t('summer2025Collection') }</h2>
        <p className={styles.mainSubtext}>{ t('discoverSustainableFashion') }</p>
      </motion.div>

      {/* First Collection Block */}
      <div className={styles.collectionBlock}>
        <div className={styles.contentGrid}>
          <motion.div 
            className={styles.imageContainer}
            style={{ 
              scale: firstImageScale, 
              opacity: firstImageOpacity,
              y: parallaxY1 
            }}
          >
            <img
              src={dress1}
              alt="Elegant Summer Collection - Women's Fashion"
              className={styles.collectionImage}
            />
            <div className={styles.imageOverlay}>
              <span className={styles.imageLabel}>{ t('womensCollection') }</span>
            </div>
          </motion.div>

          <motion.div 
            className={styles.textContainer}
            style={{ x: firstTextX, opacity: firstTextOpacity }}
          >
            <div className={styles.textContent}>
              <span className={styles.categoryTag}>{ t('newArrivals') }</span>
              <h3 className={styles.blockHeading}>{ t('lightBrightTitle') }</h3>
              <p className={styles.description}>
                { t('lightBrightDesc') }
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🌱</span>
                  <span>{ t('ecoFriendlyMaterials') }</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✨</span>
                  <span>{ t('breathableFabrics') }</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>💫</span>
                  <span>{ t('timelessDesign') }</span>
                </div>
              </div>
              <Link to="/new-collection" className={styles.discoverButton}>
                <span>{ t('discoverCollection') }</span>
                <span className={styles.buttonIcon}>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spacing Between Blocks */}
      <div className={styles.sectionDivider}>
        <motion.div 
          className={styles.dividerLine}
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* Second Collection Block */}
      <div className={styles.collectionBlock}>
        <div className={styles.contentGrid + ' ' + styles.reversed}>
          <motion.div 
            className={styles.textContainer}
            style={{ x: secondTextX, opacity: secondTextOpacity }}
          >
            <div className={styles.textContent}>
              <span className={styles.categoryTag}>{ t('premiumLine') }</span>
              <h3 className={styles.blockHeading}>{ t('timelessEleganceTitle') }</h3>
              <p className={styles.description}>
                { t('timelessEleganceDesc') }
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>👔</span>
                  <span>{ t('premiumQuality') }</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🎯</span>
                  <span>{ t('perfectFit') }</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🌟</span>
                  <span>{ t('versatileStyle') }</span>
                </div>
              </div>
              <Link to="/new-collection" className={styles.discoverButton}>
                <span>{ t('discoverCollection') }</span>
                <span className={styles.buttonIcon}>→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className={styles.imageContainer}
            style={{ 
              scale: secondImageScale, 
              opacity: secondImageOpacity,
              y: parallaxY2 
            }}
          >
            <img
              src={dress2}
              alt="Premium Men's Fashion Collection"
              className={styles.collectionImage}
            />
            <div className={styles.imageOverlay}>
              <span className={styles.imageLabel}>{ t('mensCollection') }</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action Section */}
      <motion.div 
        className={styles.ctaSection}
        style={{ 
          opacity: useTransform(scrollYProgress, [0.35, 0.9], [0, 1]),
          y: useTransform(scrollYProgress, [0.3, 0.9], [50, 0])
        }}
      >
        <h3 className={styles.ctaHeading}>{ t('readyToRefresh') }</h3>
        <p className={styles.ctaText}>{ t('exploreCompleteCollection') }</p>
        <Link to="/store" className={styles.ctaButton}>
          { t('shopAllCollections') }
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default SummerCollection;
