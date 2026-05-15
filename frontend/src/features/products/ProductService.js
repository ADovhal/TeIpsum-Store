import productApi from '../../services/apiProduct';

export const getProductsFiltered = async (params) => {
  try {
    const result = await productApi.getProducts(params);

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
