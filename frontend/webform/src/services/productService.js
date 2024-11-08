import axios from 'axios';

// Функция для получения продуктов с фильтрацией и пагинацией
export const getProductsFiltered = async ({ name, category, minPrice, maxPrice, rating, page, size }) => {
    try {
        const response = await axios.get('http://localhost:9092/api/products', {
            params: {
                name,
                category,
                minPrice,
                maxPrice,
                rating,
                page,
                size
            }
        });

        // Извлекаем список продуктов из _embedded.productList
        const products = response.data._embedded?.productList || [];

        // Получаем общее количество страниц из поля page
        const totalPages = response.data.page?.totalPages || 0;

        // Возвращаем продукты и пагинацию
        return {
            products,
            totalPages
        };
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
};
