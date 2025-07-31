import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart } from '../features/cart/cartSlice';
import { fetchProductById } from '../features/products/productSlice';

const ProductPageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const ProductContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  position: relative;
  background: #f8f9fa;
  min-height: 500px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  cursor: pointer;
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  overflow-x: auto;
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#3498db' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductHeader = styled.div`
  margin-bottom: 30px;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const CurrentPrice = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #e74c3c;
`;

const OriginalPrice = styled.span`
  font-size: 1.5rem;
  color: #95a5a6;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #e74c3c;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ProductDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const ProductDetails = styled.div`
  margin-bottom: 30px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ecf0f1;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const DetailValue = styled.span`
  color: #7f8c8d;
`;

const SizeSection = styled.div`
  margin-bottom: 30px;
`;

const SizeTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 15px;
`;

const SizeGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SizeButton = styled.button`
  padding: 12px 20px;
  border: 2px solid ${props => props.selected ? '#3498db' : '#ecf0f1'};
  background: ${props => props.selected ? '#3498db' : 'white'};
  color: ${props => props.selected ? 'white' : '#2c3e50'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3498db;
    background: #3498db;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const QuantityLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  padding: 12px 16px;
  border: none;
  background: #f8f9fa;
  color: #2c3e50;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e9ecef;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  border: none;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  background: white;

  &:focus {
    outline: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 15px 30px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const WishlistButton = styled.button`
  padding: 15px 20px;
  background: white;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e74c3c;
    color: white;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: white;
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #e74c3c;
  font-size: 1.1rem;
  text-align: center;
  padding: 20px;
`;

const SingleProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    dispatch(addToCart({
      id: selectedProduct.id,
      title: selectedProduct.title,
      price: selectedProduct.price,
      image: selectedProduct.imageUrls?.[0] || '',
      size: selectedSize,
      quantity: quantity
    }));

    alert('Product added to cart!');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  if (loading) {
    return (
      <ProductPageContainer>
        <LoadingContainer>Loading product...</LoadingContainer>
      </ProductPageContainer>
    );
  }

  if (error || !selectedProduct) {
    return (
      <ProductPageContainer>
        <ErrorContainer>
          <div>Error loading product: {error || 'Product not found'}</div>
        </ErrorContainer>
      </ProductPageContainer>
    );
  }

  return (
    <ProductPageContainer>
      <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
      
      <ProductContent>
        <ProductGrid>
          <ImageSection>
            <MainImage 
              src={selectedProduct.imageUrls?.[selectedImage] || selectedProduct.imageUrls?.[0]} 
              alt={selectedProduct.title}
            />
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
              <ThumbnailGrid>
                {selectedProduct.imageUrls.map((image, index) => (
                  <Thumbnail
                    key={index}
                    src={image}
                    alt={`${selectedProduct.title} ${index + 1}`}
                    active={index === selectedImage}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </ThumbnailGrid>
            )}
          </ImageSection>

          <ProductInfo>
            <div>
              <ProductHeader>
                <ProductTitle>{selectedProduct.title}</ProductTitle>
                <ProductPrice>
                  <CurrentPrice>
                    ${selectedProduct.discount 
                      ? (selectedProduct.price * (1 - selectedProduct.discount / 100)).toFixed(2)
                      : selectedProduct.price.toFixed(2)
                    }
                  </CurrentPrice>
                  {selectedProduct.discount && (
                    <>
                      <OriginalPrice>${selectedProduct.price.toFixed(2)}</OriginalPrice>
                      <DiscountBadge>-{selectedProduct.discount}%</DiscountBadge>
                    </>
                  )}
                </ProductPrice>
                <ProductDescription>{selectedProduct.description}</ProductDescription>
              </ProductHeader>

              <ProductDetails>
                <DetailRow>
                  <DetailLabel>Category:</DetailLabel>
                  <DetailValue>{selectedProduct.category}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Subcategory:</DetailLabel>
                  <DetailValue>{selectedProduct.subcategory}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Gender:</DetailLabel>
                  <DetailValue>{selectedProduct.gender}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Availability:</DetailLabel>
                  <DetailValue>{selectedProduct.available ? 'In Stock' : 'Out of Stock'}</DetailValue>
                </DetailRow>
              </ProductDetails>

              <SizeSection>
                <SizeTitle>Select Size</SizeTitle>
                <SizeGrid>
                  {availableSizes.map((size) => (
                    <SizeButton
                      key={size}
                      selected={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </SizeButton>
                  ))}
                </SizeGrid>
              </SizeSection>

              <QuantitySection>
                <QuantityLabel>Quantity:</QuantityLabel>
                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </QuantityButton>
                </QuantityControls>
              </QuantitySection>
            </div>

            <ActionButtons>
              <AddToCartButton
                onClick={handleAddToCart}
                disabled={!selectedProduct.available}
              >
                Add to Cart
              </AddToCartButton>
              <WishlistButton>❤</WishlistButton>
            </ActionButtons>
          </ProductInfo>
        </ProductGrid>
      </ProductContent>
    </ProductPageContainer>
  );
};

export default SingleProductPage; 