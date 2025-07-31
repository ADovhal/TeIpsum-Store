import React from 'react';
import styles from './StorePageComponents.module.css';
import { useLanguage } from '../../context/LanguageContext';

const SearchBar = ({ searchQuery, onSearchChange }) => {

    const { t } = useLanguage();

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={styles.inputField}
            />
        </div>
    );
};

export default SearchBar;
