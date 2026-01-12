import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

const ParamRow = styled.div`
  margin-bottom: 16px;
`;

const ParamLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme?.textSecondary || '#7f8c8d'};
`;

const ParamRange = styled.span`
  font-size: 12px;
  color: #95a5a6;
  font-weight: 400;
`;

const ParamInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid ${props => props.theme?.border || '#ecf0f1'};
  border-radius: 8px;
  font-size: 14px;
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

  &:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  }
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

const SizeBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
`;

const SizeLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  opacity: 0.95;
`;

const SizeValue = styled.span`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1px;
`;

// const SizeFit = styled.span`
//   font-size: 12px;
//   padding: 4px 10px;
//   background: rgba(255, 255, 255, 0.2);
//   border-radius: 20px;
//   margin-left: 4px;
// `;

const ColorDot = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ddd;
`;

const ColorName = styled.span`
  font-weight: 500;
`;

// Body parameter ranges
const BODY_PARAM_RANGES = {
  height: { min: 160, max: 200 },
  chest: { min: 80, max: 120 },
  waist: { min: 60, max: 100 },
  hips: { min: 80, max: 120 },
  shoulderWidth: { min: 40, max: 60 }
};

// Currency conversion rates (base: GBP)
const CURRENCY_RATES = {
  GBP: 1,
  EUR: 1.17,
  PLN: 5.05,
  UAH: 46.5
};

// Comprehensive size chart for t-shirts (all measurements in cm)
const TSHIRT_SIZE_CHART = {
  'XS': { 
    chest: { min: 80, max: 88 }, 
    waist: { min: 60, max: 68 }, 
    hips: { min: 80, max: 88 },
    shoulders: { min: 40, max: 43 }
  },
  'S': { 
    chest: { min: 88, max: 96 }, 
    waist: { min: 68, max: 76 }, 
    hips: { min: 88, max: 96 },
    shoulders: { min: 43, max: 46 }
  },
  'M': { 
    chest: { min: 96, max: 104 }, 
    waist: { min: 76, max: 84 }, 
    hips: { min: 96, max: 104 },
    shoulders: { min: 46, max: 49 }
  },
  'L': { 
    chest: { min: 104, max: 112 }, 
    waist: { min: 84, max: 92 }, 
    hips: { min: 104, max: 112 },
    shoulders: { min: 49, max: 52 }
  },
  'XL': { 
    chest: { min: 112, max: 120 }, 
    waist: { min: 92, max: 100 }, 
    hips: { min: 112, max: 120 },
    shoulders: { min: 52, max: 60 }
  },
};

/**
 * Calculate suggested size based on ALL body parameters
 * Weights: chest (40%), shoulders (25%), waist (20%), hips (15%)
 */
function getSuggestedSize(bodyParams) {
  const { chest, waist, hips, shoulderWidth } = bodyParams;
  const sizes = Object.entries(TSHIRT_SIZE_CHART);
  let bestMatch = 'M';
  let bestScore = Infinity;
  
  for (const [size, ranges] of sizes) {
    // Calculate midpoints for each measurement
    const chestMid = (ranges.chest.min + ranges.chest.max) / 2;
    const waistMid = (ranges.waist.min + ranges.waist.max) / 2;
    const hipsMid = (ranges.hips.min + ranges.hips.max) / 2;
    const shouldersMid = (ranges.shoulders.min + ranges.shoulders.max) / 2;
    
    // Weighted score - chest and shoulders are most important for t-shirt fit
    const score = 
      Math.abs(chest - chestMid) * 4 +           // 40% weight
      Math.abs(shoulderWidth - shouldersMid) * 2.5 +  // 25% weight
      Math.abs(waist - waistMid) * 2 +           // 20% weight
      Math.abs(hips - hipsMid) * 1.5;            // 15% weight
    
    if (score < bestScore) {
      bestScore = score;
      bestMatch = size;
    }
  }
  
  return { size: bestMatch };
}

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
  const [inputValues, setInputValues] = useState(initialBodyParams);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Get currency symbol and code from translations
  const currencySymbol = t('fitService.currency', '£');
  const currencyCode = t('fitService.currencyCode', 'GBP');

  // Format price based on current language/currency
  const formatPrice = useCallback((basePrice) => {
    if (!basePrice) return null;
    const rate = CURRENCY_RATES[currencyCode] || 1;
    const convertedPrice = basePrice * rate;
    
    // Format based on currency
    if (currencyCode === 'PLN') {
      return `${convertedPrice.toFixed(2)} ${currencySymbol}`;
    } else if (currencyCode === 'UAH') {
      return `${convertedPrice.toFixed(2)} ${currencySymbol}`;
    } else {
      return `${currencySymbol}${convertedPrice.toFixed(2)}`;
    }
  }, [currencyCode, currencySymbol]);

  // Get translated product name
  const getProductName = useCallback((product) => {
    if (product.nameKey) {
      return t(product.nameKey, product.name || product.id);
    }
    return product.name || product.id;
  }, [t]);

  // Get translated color name
  const getColorName = useCallback((product) => {
    if (product.colorKey) {
      return t(`fitService.colors.${product.colorKey}`, product.colorKey);
    }
    return null;
  }, [t]);

  // Memoize selected product to avoid creating new object references
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return availableProducts.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId, availableProducts]);

  // Products array for ThreeMannequinCanvas - memoized
  const productsForCanvas = useMemo(() => {
    return selectedProduct ? [selectedProduct] : [];
  }, [selectedProduct]);

  // Calculate suggested size based on ALL body parameters
  const sizeSuggestion = useMemo(() => {
    return getSuggestedSize(bodyParams);
  }, [bodyParams]);

  // Notify parent - use callback with proper deps
  const notifyParent = useCallback(() => {
    if (onProductsChange) {
      onProductsChange(productsForCanvas);
    }
  }, [onProductsChange, productsForCanvas]);

  useEffect(() => {
    notifyParent();
  }, [notifyParent]);

  // Handle input change - allow free typing
  const handleInputChange = useCallback((param, value) => {
    setInputValues(prev => ({ ...prev, [param]: value }));
  }, []);

  // Handle input blur - clamp and apply
  const handleInputBlur = useCallback((param) => {
    const range = BODY_PARAM_RANGES[param];
    if (!range) return;

    const rawValue = inputValues[param];
    let numValue = parseFloat(rawValue);

    if (isNaN(numValue) || rawValue === '') {
      setInputValues(prev => ({ ...prev, [param]: bodyParams[param] }));
      return;
    }

    const clampedValue = Math.max(range.min, Math.min(range.max, numValue));
    setInputValues(prev => ({ ...prev, [param]: clampedValue }));
    setBodyParams(prev => ({ ...prev, [param]: clampedValue }));
  }, [inputValues, bodyParams]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }, []);

  // Select product (single selection - replaces previous)
  const handleSelectProduct = useCallback((productId) => {
    setSelectedProductId(prev => prev === productId ? null : productId);
  }, []);

  // Remove selected product
  const handleRemoveProduct = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  // Get fit description
  // const getFitText = (fit) => {
  //   switch (fit) {
  //     case 'tight': return t('fitService.fitTight', 'в обтяжку');
  //     case 'loose': return t('fitService.fitLoose', 'свободно');
  //     default: return t('fitService.fitRegular', 'идеально');
  //   }
  // };

  // Filter available products (exclude selected)
  const filteredProducts = useMemo(() => {
    return availableProducts.filter(product => {
      const type = (product.type || '').toLowerCase();
      const isClothing = type.includes('shirt') || type.includes('t-shirt') || 
                         type.includes('tshirt') || type.includes('baselayer');
      const isNotSelected = product.id !== selectedProductId;
      return isClothing && isNotSelected;
    });
  }, [availableProducts, selectedProductId]);

  return (
    <FitServiceContainer>
      <MannequinViewerSection>
        <ThreeMannequinCanvas
          bodyParams={bodyParams}
          products={productsForCanvas}
        />
      </MannequinViewerSection>

      <ProductsPanel>
        <BodyParamsSection>
          <SectionTitle>{t('fitService.bodyParams')}</SectionTitle>
          
          <ParamRow>
            <ParamLabel>
              {t('fitService.height')}
              <ParamRange>({BODY_PARAM_RANGES.height.min}-{BODY_PARAM_RANGES.height.max} см)</ParamRange>
            </ParamLabel>
            <ParamInput
              type="number"
              value={inputValues.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              onBlur={() => handleInputBlur('height')}
              onKeyDown={handleKeyDown}
            />
          </ParamRow>

          <ParamRow>
            <ParamLabel>
              {t('fitService.chest')}
              <ParamRange>({BODY_PARAM_RANGES.chest.min}-{BODY_PARAM_RANGES.chest.max} см)</ParamRange>
            </ParamLabel>
            <ParamInput
              type="number"
              value={inputValues.chest}
              onChange={(e) => handleInputChange('chest', e.target.value)}
              onBlur={() => handleInputBlur('chest')}
              onKeyDown={handleKeyDown}
            />
          </ParamRow>

          <ParamRow>
            <ParamLabel>
              {t('fitService.waist')}
              <ParamRange>({BODY_PARAM_RANGES.waist.min}-{BODY_PARAM_RANGES.waist.max} см)</ParamRange>
            </ParamLabel>
            <ParamInput
              type="number"
              value={inputValues.waist}
              onChange={(e) => handleInputChange('waist', e.target.value)}
              onBlur={() => handleInputBlur('waist')}
              onKeyDown={handleKeyDown}
            />
          </ParamRow>

          <ParamRow>
            <ParamLabel>
              {t('fitService.hips')}
              <ParamRange>({BODY_PARAM_RANGES.hips.min}-{BODY_PARAM_RANGES.hips.max} см)</ParamRange>
            </ParamLabel>
            <ParamInput
              type="number"
              value={inputValues.hips}
              onChange={(e) => handleInputChange('hips', e.target.value)}
              onBlur={() => handleInputBlur('hips')}
              onKeyDown={handleKeyDown}
            />
          </ParamRow>

          <ParamRow>
            <ParamLabel>
              {t('fitService.shoulderWidth')}
              <ParamRange>({BODY_PARAM_RANGES.shoulderWidth.min}-{BODY_PARAM_RANGES.shoulderWidth.max} см)</ParamRange>
            </ParamLabel>
            <ParamInput
              type="number"
              value={inputValues.shoulderWidth}
              onChange={(e) => handleInputChange('shoulderWidth', e.target.value)}
              onBlur={() => handleInputBlur('shoulderWidth')}
              onKeyDown={handleKeyDown}
            />
          </ParamRow>
        </BodyParamsSection>

        <div>
          <SectionTitle>{t('fitService.selectedProducts')}</SectionTitle>
          
          {!selectedProduct ? (
            <EmptyState>
              <p>{t('fitService.noProductsSelected')}</p>
            </EmptyState>
          ) : (
            <ProductsList>
              <ProductCard selected>
                <ProductContent>
                  {/* Size recommendation at the top - most important info */}
                  <SizeBadge>
                    <SizeLabel>{t('fitService.recommendedSize', 'Рекомендуемый размер')}:</SizeLabel>
                    <SizeValue>{sizeSuggestion.size}</SizeValue>
                    {/* <SizeFit>{getFitText(sizeSuggestion.fit)}</SizeFit> */}
                  </SizeBadge>
                  
                  <ProductTitle>{getProductName(selectedProduct)}</ProductTitle>
                  <ProductInfo>{t('fitService.type')}: {selectedProduct.type}</ProductInfo>
                  {selectedProduct.color && (
                    <ProductInfo style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {t('fitService.color')}: 
                      <ColorDot style={{ backgroundColor: selectedProduct.color }} />
                      {getColorName(selectedProduct) && (
                        <ColorName>{getColorName(selectedProduct)}</ColorName>
                      )}
                    </ProductInfo>
                  )}
                  {(selectedProduct.basePrice || selectedProduct.price) && (
                    <ProductInfo>
                      {t('fitService.price')}: {formatPrice(selectedProduct.basePrice || selectedProduct.price)}
                    </ProductInfo>
                  )}
                  
                  <RemoveButton onClick={handleRemoveProduct}>
                    {t('fitService.remove')}
                  </RemoveButton>
                </ProductContent>
              </ProductCard>
            </ProductsList>
          )}
        </div>

        {filteredProducts.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <SectionTitle>{t('fitService.availableProducts')}</SectionTitle>
            <ProductsList>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                >
                  <ProductContent>
                    <ProductTitle>{getProductName(product)}</ProductTitle>
                    <ProductInfo>{t('fitService.type')}: {product.type}</ProductInfo>
                    {product.color && (
                      <ProductInfo style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {t('fitService.color')}: 
                        <ColorDot style={{ backgroundColor: product.color }} />
                        {getColorName(product) && (
                          <ColorName>{getColorName(product)}</ColorName>
                        )}
                      </ProductInfo>
                    )}
                    {(product.basePrice || product.price) && (
                      <ProductInfo>
                        {t('fitService.price')}: {formatPrice(product.basePrice || product.price)}
                      </ProductInfo>
                    )}
                  </ProductContent>
                </ProductCard>
              ))}
            </ProductsList>
          </div>
        )}
      </ProductsPanel>
    </FitServiceContainer>
  );
};

export default MannequinViewer;
