// src/pages/HomePage.js
import React, { useEffect } from 'react';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';
import ProductCard from '../features/products/components/ProductCard'; // Допустим, у вас есть компонент для отображения товара

const HomePage = () => {

  useEffect(() => {
    document.title = "My Store Home Page";
  }, []);

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
      {/* Баннер с приветствием */}
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Добро пожаловать в MyStore!</h1>
          <p>Лучшие товары по выгодным ценам!</p>
          <Link to="/store" className={styles.shopNowButton}>Начать покупки</Link>
        </div>
      </section>

      {/* Описание магазина */}
      <section className={styles.aboutStore}>
        <h2>О нашем магазине</h2>
        <p>
          Мы предлагаем широкий ассортимент товаров, от электроники до модных аксессуаров.
          Наш магазин гарантирует качественное обслуживание и быструю доставку.
        </p>
      </section>

      {/* Популярные товары */}
      <section className={styles.popularProducts}>
        <h2>Популярные товары</h2>
        <div className={styles.productList}>
          {/* Рендеринг карточек популярных продуктов */}
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
