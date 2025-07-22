import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './SummerCollection.module.css';
// import flower1 from '../../../assets/images/summer_flower1.png';
import dress1 from '../../../assets/images/summer_dress1.jpg';
import dress2 from '../../../assets/images/mans_clothing1.jpg';

const SummerCollection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgColor = useTransform(scrollYProgress, [0, 1], ['#fefae0', '#ffe9d6']);
  const headingOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const imageXLeft = useTransform(scrollYProgress, [0.2, 0.4], ['-100%', '0%']);
  const imageXRight = useTransform(scrollYProgress, [0.2, 0.4], ['100%', '0%']);
  const textXLeft = useTransform(scrollYProgress, [0.3, 0.5], ['100%', '0%']);
  const textXRight = useTransform(scrollYProgress, [0.3, 0.5], ['-100%', '0%']);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <motion.section
      ref={ref}
      className={styles.summerSection}
      style={{ backgroundColor: bgColor }}
    >
      <motion.h2 className={styles.heading} style={{ opacity: headingOpacity }}>
        Summer 2025 Collection
      </motion.h2>

      <div className={styles.contentWrapper}>
        <motion.img
          src={dress1}
          alt="Summer dress"
          className={styles.image}
          style={{ x: imageXLeft, opacity: contentOpacity }}
        />

        <motion.div className={styles.textBlock} style={{ x: textXLeft, opacity: contentOpacity }}>
          <h3>Light, Bright, Effortlessly You</h3>
          <p>
            Embrace summer in style with flowing silhouettes, earthy tones, and breathable fabrics designed for warm days and cool nights.
          </p>
          <button>Discover</button>
        </motion.div>
      </div>
      <div className={styles.contentWrapper} style={{ marginTop: '6rem' }}>
        <motion.div className={styles.textBlock} style={{ x: textXRight, opacity: contentOpacity }}>
          <h3>Light, Bright, Effortlessly You</h3>
          <p>
            Embrace summer in style with flowing silhouettes, earthy tones, and breathable fabrics designed for warm days and cool nights.
          </p>
          <button>Discover</button>
        </motion.div>
        <motion.img
          src={dress2}
          alt="Summer dress"
          className={styles.image}
          style={{ x: imageXRight, opacity: contentOpacity }}
        />
      </div>
    </motion.section>
  );
};

export default SummerCollection;
