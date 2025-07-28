import apiProduct from '../../services/apiProduct';

export const getProductsFiltered = async ({ name, category, subcategory, gender, minPrice, maxPrice, minDiscount, maxDiscount, available, page, size, sort }) => {
    try {
      const response = await apiProduct.get('/products', {
        params: {
          name,
          category,
          subcategory,
          gender,
          minPrice,
          maxPrice,
          minDiscount,
          maxDiscount,
          available,
          page,
          size,
          sort
        }
      });
  
      const products = response.data._embedded?.productList || [];
      const totalPages = response.data.page?.totalPages || 0;
  
      return { products, totalPages };
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  };

export const getProductById = async (productId) => {
    try {
      const response = await apiProduct.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  };
