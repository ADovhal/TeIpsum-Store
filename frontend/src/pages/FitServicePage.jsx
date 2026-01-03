import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MannequinViewer from '../components/FitService/MannequinViewer';
import BodyParamsDialog from '../components/FitService/BodyParamsDialog';
import productApi from '../services/apiProduct';
import apiUser from '../services/apiUser';

/**
 * Page for virtual fitting room service with 3D mannequin
 * Uses fitservice microservice for rendering
 */
const FitServicePage = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
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

  // Load available products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts({ size: 50 });
        
        // Transform products to format expected by MannequinViewer
        const formattedProducts = response.products.map(product => ({
          id: product.id?.toString() || product.productId?.toString(),
          name: product.name || product.title,
          type: mapProductCategoryToClothingType(product.category),
          color: product.color || '#3498db',
          price: product.price,
          modelUrl: product.model3dUrl || product.modelUrl, // URL к 3D модели если есть
        }));

        setAvailableProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Не удалось загрузить продукты. Попробуйте позже.');
        
        // Fallback: демо продукты с доступными моделями одежды
        setAvailableProducts([
          {
            id: 'demo-1',
            name: 'Футболка (Shirt for Men)',
            type: 'shirt',
            color: '#3498db',
            price: 1500,
          },
          {
            id: 'demo-2',
            name: 'Базовая футболка (Basic T-Shirt)',
            type: 't-shirt',
            color: '#2c3e50',
            price: 1200,
          },
          {
            id: 'demo-3',
            name: 'Футболка (T-Shirt)',
            type: 't_shirt',
            color: '#e74c3c',
            price: 1100,
          },
          {
            id: 'demo-4',
            name: 'Базовый слой (Baselayer)',
            type: 'baselayer',
            color: '#95a5a6',
            price: 1800,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Map product category to clothing type for ThreeJS
  const mapProductCategoryToClothingType = (category) => {
    if (!category) return 'shirt';
    
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('shirt') || categoryLower.includes('футболк') || categoryLower.includes('рубашк')) {
      return 'shirt';
    }
    if (categoryLower.includes('pants') || categoryLower.includes('брюк') || categoryLower.includes('джинс')) {
      return 'pants';
    }
    if (categoryLower.includes('dress') || categoryLower.includes('плать')) {
      return 'dress';
    }
    if (categoryLower.includes('jacket') || categoryLower.includes('куртк') || categoryLower.includes('пиджак')) {
      return 'jacket';
    }
    
    return 'shirt'; // По умолчанию
  };

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

  if (error && availableProducts.length === 0) {
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

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      {showBodyParamsDialog && (
        <BodyParamsDialog
          onSave={handleSaveBodyParams}
          onCancel={() => {
            // Don't allow canceling - user must set parameters
            if (isAuthenticated) {
              // Redirect to profile or home
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

