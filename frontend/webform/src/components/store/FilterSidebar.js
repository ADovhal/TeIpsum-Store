// src/components/FilterSidebar/FilterSidebar.js
import React from 'react';
import styles from './StorePageComponents.module.css'; // Импортируем стили из CSS модуля

const FilterSidebar = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rating' && (value > 5 || value < 0)) return;
        if (name === 'minPrice' && value < 0) return;
        if (name === 'maxPrice' && value < 0) return;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className={styles.filterSidebar}>
            <h3>Filters</h3>

            <div className={styles.filterItem}>
                <label>Category:</label>
                <select name="category" value={filters.category} onChange={handleChange} className={styles.select}>
                    <option value="">All</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                </select>
            </div>

            <div className={styles.filterItem}>
                <label>Min Price:</label>
                <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    className={styles.input}
                    min="0" // Минимальное значение для цены - 0
                />
            </div>

            <div className={styles.filterItem}>
                <label>Max Price:</label>
                <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    className={styles.input}
                    min="0" // Минимальное значение для цены - 0
                />
            </div>

            <div className={styles.filterItem}>
                <label>Min Rating:</label>
                <input
                    type="number"
                    name="rating"
                    value={filters.rating}
                    onChange={handleChange}
                    className={styles.input}
                    max="5" // Максимальное значение рейтинга - 5
                />
            </div>
        </div>
    );
};

export default FilterSidebar;
