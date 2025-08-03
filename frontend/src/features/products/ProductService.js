import productApi from '../../services/apiProduct';

export const getProductsFiltered = async (params) => {
    try {
      const {
        title,
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
      } = params;

      const result = await productApi.getProducts({
        title,
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
      });
  
      return {
        products: result.products,
        totalPages: result.totalPages
      };
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  };

export const getProductById = async (productId) => {
    try {
      return await productApi.getProductById(productId);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
};
