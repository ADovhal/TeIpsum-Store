import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './FeaturedCollection.module.css';

const FeaturedCollection = () => {
  const ref = useRef(null);
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
      title: "Minimalist Essentials",
      description: "Clean lines and timeless designs that speak to your inner aesthetic. Each piece crafted with intention and purpose.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
      price: "From $45",
      category: "ESSENTIALS"
    },
    {
      id: 2,
      title: "Urban Sophistication",
      description: "Modern silhouettes for the contemporary soul. Versatile pieces that transition seamlessly from day to night.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
      price: "From $85",
      category: "URBAN"
    },
    {
      id: 3,
      title: "Artisan Collection",
      description: "Handcrafted details and unique textures. Limited pieces that celebrate individual expression and artistry.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500",
      price: "From $125",
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
        Featured Collections
      </motion.h2>

      <motion.p 
        className={styles.subtitle}
        style={{ opacity: headingOpacity, y: textY }}
      >
        Curated pieces that define modern elegance and timeless style
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
                  <span className={styles.viewCollection}>View Collection</span>
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
                  Explore
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
        <h3 className={styles.ctaTitle}>Discover Your Style</h3>
        <p className={styles.ctaText}>
          Explore our complete range of thoughtfully designed pieces
        </p>
        <Link to="/pre-store" className={styles.ctaButton}>
          Shop All Collections
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default FeaturedCollection; 