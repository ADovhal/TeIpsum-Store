import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './SummerCollection.module.css';
import dress1 from '../../../assets/images/summer_dress1.jpg';
import dress2 from '../../../assets/images/mans_clothing1.jpg';

const SummerCollection = () => {
  const sectionRef = useRef(null);
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
        <h2 className={styles.mainHeading}>Summer 2025 Collection</h2>
        <p className={styles.mainSubtext}>Discover our latest sustainable fashion pieces</p>
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
              <span className={styles.imageLabel}>Women's Collection</span>
            </div>
          </motion.div>

          <motion.div 
            className={styles.textContainer}
            style={{ x: firstTextX, opacity: firstTextOpacity }}
          >
            <div className={styles.textContent}>
              <span className={styles.categoryTag}>New Arrivals</span>
              <h3 className={styles.blockHeading}>Light, Bright, Effortlessly You</h3>
              <p className={styles.description}>
                Embrace summer in style with flowing silhouettes, earthy tones, and breathable fabrics 
                designed for warm days and cool nights. Our sustainable approach ensures every piece 
                is both beautiful and environmentally conscious.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🌱</span>
                  <span>Eco-Friendly Materials</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✨</span>
                  <span>Breathable Fabrics</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>💫</span>
                  <span>Timeless Design</span>
                </div>
              </div>
              <Link to="/new-collection" className={styles.discoverButton}>
                <span>Discover Collection</span>
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
              <span className={styles.categoryTag}>Premium Line</span>
              <h3 className={styles.blockHeading}>Timeless Elegance, Modern Comfort</h3>
              <p className={styles.description}>
                Discover our signature pieces that blend classic sophistication with contemporary comfort, 
                perfect for any occasion. Each garment is meticulously crafted with attention to detail 
                and sustainable practices.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>👔</span>
                  <span>Premium Quality</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🎯</span>
                  <span>Perfect Fit</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🌟</span>
                  <span>Versatile Style</span>
                </div>
              </div>
              <Link to="/new-collection" className={styles.discoverButton}>
                <span>Discover Collection</span>
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
              <span className={styles.imageLabel}>Men's Collection</span>
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
        <h3 className={styles.ctaHeading}>Ready to Refresh Your Wardrobe?</h3>
        <p className={styles.ctaText}>Explore our complete collection and find your perfect style</p>
        <Link to="/store" className={styles.ctaButton}>
          Shop All Collections
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default SummerCollection;
