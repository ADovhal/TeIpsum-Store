import React, { useEffect } from 'react';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';
import ProductCard from '../features/products/components/ProductCard';

const HomePage = () => {

  useEffect(() => {
    document.title = "My Store Home Page";
  }, []);

  console.log( 'API = ', process.env.REACT_APP_API_URL_TEST);

  const popularProducts = [
    {
      id: 1,
      name: "Apple iPhone 13",
      brand: "Apple",
      price: 999.99,
      imageUrl: "https://via.placeholder.com/200",
      description: "Флагманский смартфон с передовыми функциями.",
    },
    {
      id: 2,
      name: "Sony WH-1000XM4",
      brand: "Sony",
      price: 349.99,
      imageUrl: "https://via.placeholder.com/200",
      description: "Лучшие в классе беспроводные наушники с шумоподавлением.",
    },
    {
      id: 3,
      name: "Levi's 501 Jeans",
      brand: "Levi's",
      price: 89.99,
      imageUrl: "https://via.placeholder.com/200",
      description: "Классические джинсы с отличной посадкой.",
    },
    {
      id: 4,
      name: "Samsung Galaxy Tab S7",
      brand: "Samsung",
      price: 649.99,
      imageUrl: "https://via.placeholder.com/200",
      description: "Мощный планшет для работы и развлечений.",
    },
  ];
  
  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Welcome to MyStore!</h1>
          <p>The best products at competitive prices!</p>
          <Link to="/store" className={styles.shopNowButton}>Discover products</Link>
        </div>
      </section>
      <section className={styles.aboutStore}>
        <h2>About our shop</h2>
        <p>
        We offer a wide range of products, from electronics to fashion accessories.
        Our store guarantees quality service and fast delivery.
        </p>
      </section>
      <section className={styles.popularProducts}>
        <h2>Popular products</h2>
        <div className={styles.productList}>
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
