// src/features/products/ProductService.js
import api from '../../services/api';

export const getProductsFiltered = async ({ name, category, minPrice, maxPrice, rating, page, size }) => {
    try {
      const response = await api.get('/products', {
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
  
      const products = response.data._embedded?.productList; // || []
      const totalPages = response.data.page?.totalPages || 0;
  
      return { products, totalPages };
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  };;
