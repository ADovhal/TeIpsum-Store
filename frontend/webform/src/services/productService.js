// src/services/productService.js
import axios from 'axios';

export const getProductsFiltered = async ({ name, category, minPrice, maxPrice, rating, page, size }) => {
    try {
        const response = await axios.get('http://localhost:9092/api/products', {
            params: {
                name,
                category,
                minPrice,
                maxPrice,
                rating,
                page, // передаём номер страницы
                size  // передаём размер страницы
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
};
