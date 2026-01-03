import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ThreeMannequinCanvas from './ThreeMannequinCanvas';

const FitServiceContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  gap: 20px;
  padding: 20px;
  background: ${props => props.theme?.background || '#f5f5f5'};

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const MannequinViewerSection = styled.div`
  flex: 1;
  min-width: 50%;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    min-height: 500px;
  }
`;

const ProductsPanel = styled.div`
  flex: 1;
  min-width: 350px;
  max-width: 500px;
  background: ${props => props.theme?.cardBackground || 'white'};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  @media (max-width: 768px) {
    max-width: 100%;
    min-width: 100%;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#2c3e50'};
  border-bottom: 2px solid ${props => props.theme?.border || '#ecf0f1'};
  padding-bottom: 12px;
`;

const BodyParamsSection = styled.div`
  margin-bottom: 32px;
`;

const ParamLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme?.textSecondary || '#7f8c8d'};
`;

const ParamInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid ${props => props.theme?.border || '#ecf0f1'};
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProductCard = styled.div`
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#3498db' : props.theme?.border || '#ecf0f1'};
  border-radius: 8px;
  background: ${props => props.selected ? '#ebf5fb' : props.theme?.cardBackground || 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2px;
  flex-shrink: 0;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3498db;
`;

const ProductContent = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#2c3e50'};
`;

const ProductInfo = styled.p`
  margin: 4px 0;
  font-size: 14px;
  color: ${props => props.theme?.textSecondary || '#7f8c8d'};
`;

const RemoveButton = styled.button`
  margin-top: 12px;
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background: #c0392b;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme?.textSecondary || '#7f8c8d'};
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  font-size: 18px;
`;

/**
 * 
 * 
 * @param {Object} props
 * @param {string} props.fitserviceUrl - (deprecated, no longer used; kept for backward compatibility)
 * @param {Array} props.availableProducts
 * @param {Object} props.initialBodyParams
 * @param {Function} props.onProductsChange
 */
const MannequinViewer = ({
  availableProducts = [],
  initialBodyParams = {
    height: 175,
    chest: 100,
    waist: 85,
    hips: 95,
    shoulderWidth: 45,
  },
  onProductsChange,
}) => {
  const { t } = useTranslation();
  const [bodyParams, setBodyParams] = useState(initialBodyParams);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (onProductsChange) {
      onProductsChange(selectedProducts);
    }
  }, [selectedProducts, onProductsChange]);

  const handleParamChange = (param, value) => {
    setBodyParams(prev => ({
      ...prev,
      [param]: parseFloat(value) || 0,
    }));
  };

  const handleProductSelect = (product, isChecked) => {
    if (isChecked) {
      // Add product if not already selected
      const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
      if (existingIndex < 0) {
        setSelectedProducts([...selectedProducts, product]);
      }
    } else {
      // Remove product
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    }
  };

  const isProductSelected = (productId) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const handleProductRemove = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <FitServiceContainer>
      <MannequinViewerSection>
        <ThreeMannequinCanvas
          bodyParams={bodyParams}
          products={selectedProducts}
        />
      </MannequinViewerSection>

      <ProductsPanel>
        <BodyParamsSection>
          <SectionTitle>{t('fitService.bodyParams')}</SectionTitle>
          
          <ParamLabel>{t('fitService.height')}</ParamLabel>
          <ParamInput
            type="number"
            min="150"
            max="220"
            value={bodyParams.height}
            onChange={(e) => handleParamChange('height', e.target.value)}
          />

          <ParamLabel>{t('fitService.chest')}</ParamLabel>
          <ParamInput
            type="number"
            min="80"
            max="150"
            value={bodyParams.chest}
            onChange={(e) => handleParamChange('chest', e.target.value)}
          />

          <ParamLabel>{t('fitService.waist')}</ParamLabel>
          <ParamInput
            type="number"
            min="60"
            max="130"
            value={bodyParams.waist}
            onChange={(e) => handleParamChange('waist', e.target.value)}
          />

          <ParamLabel>{t('fitService.hips')}</ParamLabel>
          <ParamInput
            type="number"
            min="80"
            max="150"
            value={bodyParams.hips}
            onChange={(e) => handleParamChange('hips', e.target.value)}
          />

          <ParamLabel>{t('fitService.shoulderWidth')}</ParamLabel>
          <ParamInput
            type="number"
            min="35"
            max="60"
            value={bodyParams.shoulderWidth}
            onChange={(e) => handleParamChange('shoulderWidth', e.target.value)}
          />
        </BodyParamsSection>

        <div>
          <SectionTitle>{t('fitService.selectedProducts')}</SectionTitle>
          
          {selectedProducts.length === 0 ? (
            <EmptyState>
              <p>{t('fitService.noProductsSelected')}</p>
            </EmptyState>
          ) : (
            <ProductsList>
              {selectedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  selected
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox' && e.target.tagName !== 'BUTTON') {
                      handleProductSelect(product, false);
                    }
                  }}
                >
                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      checked={true}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleProductSelect(product, false);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </CheckboxContainer>
                  <ProductContent>
                    <ProductTitle>{product.name || product.title}</ProductTitle>
                    <ProductInfo>{t('fitService.type')}: {product.type}</ProductInfo>
                    {product.color && (
                      <ProductInfo>
                        {t('fitService.color')}: <span style={{ color: product.color }}>●</span>
                      </ProductInfo>
                    )}
                    <RemoveButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductRemove(product.id);
                      }}
                    >
                      {t('fitService.remove')}
                    </RemoveButton>
                  </ProductContent>
                </ProductCard>
              ))}
            </ProductsList>
          )}
        </div>

        {availableProducts.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <SectionTitle>{t('fitService.availableProducts')}</SectionTitle>
            <ProductsList>
              {availableProducts.map((product) => {
                const isSelected = isProductSelected(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    selected={isSelected}
                    onClick={(e) => {
                      // Prevent double toggle when clicking checkbox
                      if (e.target.type !== 'checkbox') {
                        handleProductSelect(product, !isSelected);
                      }
                    }}
                  >
                    <CheckboxContainer>
                      <Checkbox
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleProductSelect(product, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </CheckboxContainer>
                    <ProductContent>
                      <ProductTitle>{product.name || product.title}</ProductTitle>
                      <ProductInfo>{t('fitService.type')}: {product.type}</ProductInfo>
                      {product.price && (
                        <ProductInfo>{t('fitService.price')}: {product.price} ₽</ProductInfo>
                      )}
                    </ProductContent>
                  </ProductCard>
                );
              })}
            </ProductsList>
          </div>
        )}
      </ProductsPanel>
    </FitServiceContainer>
  );
};

export default MannequinViewer;

