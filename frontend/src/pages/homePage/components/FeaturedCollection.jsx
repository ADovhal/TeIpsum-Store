import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './FeaturedCollection.module.css';
import fc_mE from '../../../assets/images/fc_minimalisticEssentials.jpg'
import fc_uS from '../../../assets/images/fc_urbanSophistication.jpg'
import fc_aC from '../../../assets/images/fc_artisanCollection.jpg'

const FeaturedCollection = () => {
  const ref = useRef(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgColor = useTransform(scrollYProgress, [0, 1], ['#2c3e50', '#34495e']);
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0.2, 0.6], [0.8, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 0.7, 0.9, 0.2], [100, 0, 0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.5, 0.8], [0, 1, 1, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const featuredItems = [
    {
      id: 1,
      title: `${ t('minimalistEssentialsTitle') }`,
      description: `${ t('minimalistEssentialsDesc') }`,
      image: fc_mE,
      price: `${ t('fromPrice') } $45`,
      category: "ESSENTIALS"
    },
    {
      id: 2,
      title: `${ t('urbanSophisticationTitle') }`,
      description: `${ t('urbanSophisticationDesc') }`,
      image: fc_uS,
      price: `${ t('fromPrice') } $85`,
      category: "URBAN"
    },
    {
      id: 3,
      title: `${ t('artisanCollectionTitle') }`,
      description: `${ t('artisanCollectionDesc') }`,
      image: fc_aC,
      price: `${ t('fromPrice') } $125`,
      category: "ARTISAN"
    }
  ];

  return (
    <motion.section
      ref={ref}
      className={styles.featuredSection}
      style={{ backgroundColor: bgColor }}
    >
      <motion.div 
        className={styles.backgroundPattern}
        style={{ y: parallaxY }}
      />
      
      <motion.h2 
        className={styles.heading} 
        style={{ opacity: headingOpacity }}
      >
        { t('featuredCollectionsTitle') }
      </motion.h2>

      <motion.p 
        className={styles.subtitle}
        style={{ opacity: headingOpacity, y: textY }}
      >
        { t('featuredCollectionsSubtitle') }
      </motion.p>

      <div className={styles.collectionsGrid}>
        {featuredItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.collectionCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className={styles.imageContainer}
              style={{ scale: imageScale }}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className={styles.collectionImage}
              />
              <div className={styles.imageOverlay}>
                <motion.div
                  className={styles.overlayContent}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={styles.viewCollection}>{ t('viewCollection') }</span>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.cardContent}
              style={{ opacity: contentOpacity }}
            >
              <span className={styles.category}>{item.category}</span>
              <h3 className={styles.collectionTitle}>{item.title}</h3>
              <p className={styles.collectionDescription}>{item.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.price}>{item.price}</span>
                <Link to="/new-collection" className={styles.exploreButton}>
                  { t('explore') }
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className={styles.ctaSection}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className={styles.ctaTitle}>{ t('discoverYourStyle') }</h3>
        <p className={styles.ctaText}>
          { t('exploreThoughtfulDesigns') }
        </p>
        <Link to="/pre-store" className={styles.ctaButton}>
          { t('shopAllCollections') }
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default FeaturedCollection; 