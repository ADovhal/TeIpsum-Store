import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MannequinViewer from '../components/FitService/MannequinViewer';
import BodyParamsDialog from '../components/FitService/BodyParamsDialog';
import productApi from '../services/apiProduct';
import apiUser from '../services/apiUser';

const SKIP_BODY_PARAMS = 'true';

/**
 * Page for virtual fitting room service with 3D mannequin
 * Uses fitservice microservice for rendering
 */
const FitServicePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setSelectedProducts] = useState([]);
  const [bodyParams, setBodyParams] = useState({
    height: 175,
    chest: 100,
    waist: 85,
    hips: 95,
    shoulderWidth: 45,
  });
  const [showBodyParamsDialog, setShowBodyParamsDialog] = useState(false);
  const [loadingBodyParams, setLoadingBodyParams] = useState(true);

  // Load user body parameters
  useEffect(() => {
    const loadBodyParams = async () => {
      if (!isAuthenticated) {
        setLoadingBodyParams(false);
        return;
      }

      try {
        const response = await apiUser.get('/api/users/body-parameters');
        if (response.status === 200 && response.data) {
          setBodyParams(response.data);
          setLoadingBodyParams(false);
        } else {
          // No body parameters set, show dialog
          setShowBodyParamsDialog(true);
          setLoadingBodyParams(false);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Body parameters not set, show dialog
          setShowBodyParamsDialog(true);
        }
        setLoadingBodyParams(false);
      }
    };

    loadBodyParams();
  }, [isAuthenticated]);

  // Default fallback products when API is unavailable or returns empty
  // Product IDs must match translation keys in fitService.products
  const getFallbackProducts = () => [
    {
      id: 'tshirt-white',
      nameKey: 'fitService.products.tshirt-white',
      type: 't-shirt',
      meshName: 'T-Shirt_White',
      color: '#ffffff',
      colorKey: 'white',
      basePrice: 29.99,
    },
    {
      id: 'tshirt-black',
      nameKey: 'fitService.products.tshirt-black',
      type: 't-shirt',
      meshName: 'T-Shirt_Black',
      color: '#1a1a1a',
      colorKey: 'black',
      basePrice: 29.99,
    },
    {
      id: 'tshirt-red',
      nameKey: 'fitService.products.tshirt-red',
      type: 't-shirt',
      meshName: 'T-Shirt_Red',
      color: '#e74c3c',
      colorKey: 'red',
      basePrice: 29.99,
    },
    {
      id: 'tshirt-blue',
      nameKey: 'fitService.products.tshirt-blue',
      type: 't-shirt',
      meshName: 'T-Shirt_Blue',
      color: '#3498db',
      colorKey: 'blue',
      basePrice: 29.99,
    },
    {
      id: 'tshirt-green',
      nameKey: 'fitService.products.tshirt-green',
      type: 't-shirt',
      meshName: 'T-Shirt_Green',
      color: '#27ae60',
      colorKey: 'green',
      basePrice: 29.99,
    },
    {
      id: 'tshirt-navy',
      nameKey: 'fitService.products.tshirt-navy',
      type: 't-shirt',
      meshName: 'T-Shirt_Navy',
      color: '#2c3e50',
      colorKey: 'navy',
      basePrice: 29.99,
    },
    {
      id: 'tshirt-gray',
      nameKey: 'fitService.products.tshirt-gray',
      type: 't-shirt',
      meshName: 'T-Shirt_Gray',
      color: '#7f8c8d',
      colorKey: 'gray',
      basePrice: 29.99,
    },
  ];

  // Load available products on mount
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create a timeout promise to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Request timeout'));
          }, 10000); // 10 second timeout
        });

        // Race between API call and timeout
        const response = await Promise.race([
          productApi.getProducts({ size: 50 }),
          timeoutPromise,
        ]);

        // Clear timeout if request succeeded
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!isMounted) return;

        // Check if response has products
        if (response && response.products && Array.isArray(response.products) && response.products.length > 0) {
          // Transform products to format expected by MannequinViewer
          const formattedProducts = response.products
                .map(product => {
                  // Extract product type from category or name
                  const category = (product.category || '').toLowerCase();
                  const name = (product.name || product.title || '').toLowerCase();
                  
                  let type = 'shirt'; // Default
                  let meshName = 'T-Shirt_Black'; // Default mesh name from GLB
                  
                  // Determine type and corresponding mesh name
                  if (category.includes('футболк') || name.includes('футболк') || 
                      category.includes('t-shirt') || name.includes('t-shirt')) {
                    type = 't-shirt';
                      
                    // Determine color from product
                    if (product.color) {
                      const colorLower = product.color.toLowerCase();
                      if (colorLower === '#ffffff' || colorLower === 'white' || colorLower.includes('бел')) {
                        meshName = 'T-Shirt_White';
                      } else if (colorLower === '#000000' || colorLower === 'black' || colorLower.includes('черн')) {
                        meshName = 'T-Shirt_Black';
                      // } else if (colorLower.includes('red') || colorLower.includes('красн')) {
                      //   meshName = 'TShirt_Red';
                      } else if (colorLower.includes('blue') || colorLower.includes('син')) {
                        meshName = 'T-Shirt_Sky';
                      }
                    }
                  } else if (category.includes('рубашк') || name.includes('рубашк') || 
                             category.includes('shirt') || name.includes('shirt')) {
                    type = 'shirt';
                    meshName = 'Shirt_White'; // Adjust based on your GLB
                  }
                  
                  return {
                    id: product.id?.toString() || product.productId?.toString(),
                    name: product.name || product.title,
                    type: type,
                    meshName: meshName, // ← НОВОЕ ПОЛЕ!
                    color: product.color || '#3498db',
                    price: product.price,
                  };
                })
                .filter(product => {
                  // Only include clothing items that we have meshes for
                  return product.type.includes('shirt') || product.type.includes('tshirt');
                });

          setAvailableProducts(formattedProducts);
        } else {
          // Empty response - use fallback
          console.warn('No products received from API, using fallback products');
          setAvailableProducts(getFallbackProducts());
        }
      } catch (err) {
        // Clear timeout if it was set
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!isMounted) return;

        console.error('Error loading products:', err);
        
        // Always set fallback products on error
        setAvailableProducts(getFallbackProducts());
        
        // Only show error message if it's not a timeout (timeout is expected behavior)
        if (err.message !== 'Request timeout') {
          setError('Не удалось загрузить продукты. Используются демо-продукты.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Map product category to clothing type for ThreeJS
  // const mapProductCategoryToClothingType = (category) => {
  //   if (!category) return 'shirt';
    
  //   const categoryLower = category.toLowerCase();
    
  //   if (categoryLower.includes('shirt') || categoryLower.includes('футболк') || categoryLower.includes('рубашк')) {
  //     return 'shirt';
  //   }
  //   if (categoryLower.includes('pants') || categoryLower.includes('брюк') || categoryLower.includes('джинс')) {
  //     return 'pants';
  //   }
  //   if (categoryLower.includes('dress') || categoryLower.includes('плать')) {
  //     return 'dress';
  //   }
  //   if (categoryLower.includes('jacket') || categoryLower.includes('куртк') || categoryLower.includes('пиджак')) {
  //     return 'jacket';
  //   }
    
  //   return 'shirt'; // Default to shirt
  // };

  // Handle body parameters save
  const handleSaveBodyParams = async (params) => {
    try {
      await apiUser.post('/api/users/body-parameters', params);
      setBodyParams(params);
      setShowBodyParamsDialog(false);
    } catch (error) {
      console.error('Error saving body parameters:', error);
      alert('Failed to save body parameters. Please try again.');
    }
  };

  // Handle products change
  const handleProductsChange = (products) => {
    setSelectedProducts(products);
    console.log('Selected products:', products);
  };

  if (loading || loadingBodyParams) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 80px)' 
      }}>
        <div>{t('fitService.loading')}</div>
      </div>
    );
  }

  // Don't block rendering if we have fallback products
  // Only show error screen if we truly have no products and an error
  if (error && availableProducts.length === 0 && !loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 80px)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ color: 'red' }}>{error}</div>
        <button onClick={() => window.location.reload()}>{t('fitService.tryAgain')}</button>
      </div>
    );
  }

  // return (
  //   <div style={{ minHeight: 'calc(100vh - 80px)' }}>
  //     {showBodyParamsDialog && (
  //       <BodyParamsDialog
  //         onSave={handleSaveBodyParams}
  //         onCancel={() => {
  //           // Don't allow canceling - user must set parameters
  //           if (isAuthenticated) {
  //             // Redirect to profile or home
  //             window.location.href = '/profile';
  //           } else {
  //             window.location.href = '/';
  //           }
  //         }}
  //       />
  //     )}
  //     <MannequinViewer
  //       fitserviceUrl={process.env.REACT_APP_FITSERVICE_URL || 'http://localhost:8087'}
  //       availableProducts={availableProducts}
  //       initialBodyParams={bodyParams}
  //       onProductsChange={handleProductsChange}
  //     />
  //   </div>
  // );
  return (
  <div style={{ minHeight: 'calc(100vh - 80px)' }}>
    {/* Показываем диалог только если НЕ стоит флаг скипа */}
    {showBodyParamsDialog && !SKIP_BODY_PARAMS && (
      <BodyParamsDialog
        onSave={handleSaveBodyParams}
        onCancel={() => {
          if (isAuthenticated) {
            window.location.href = '/profile';
          } else {
            window.location.href = '/';
          }
        }}
      />
    )}

    <MannequinViewer
      fitserviceUrl={process.env.REACT_APP_FITSERVICE_URL || 'http://localhost:8087'}
      availableProducts={availableProducts}
      initialBodyParams={bodyParams}
      onProductsChange={handleProductsChange}
    />
  </div>
);
};

export default FitServicePage;

