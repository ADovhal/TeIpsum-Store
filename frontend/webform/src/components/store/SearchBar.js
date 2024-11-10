// src/components/SearchBar/SearchBar.js
import React from 'react';
import styles from './StorePageComponents.module.css'; // Импортируем стили из CSS модуля

const SearchBar = ({ searchQuery, onSearchChange }) => {
    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className={styles.inputField}
            />
        </div>
    );
};

export default SearchBar;
