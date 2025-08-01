import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useIsAdmin from '../../admin/useIsAdmin';
import { addToCart } from '../../cart/cartSlice';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  Card, 
  CardImage, 
  CardContent, 
  CardTitle, 
  CardDescription,
  CardPrice, 
  PriceLabel,
  AddToCartButton,
  ProductBadge,
  RatingContainer,
  Star,
  RatingText,
  EditIcon,
  ImageContainer,
  ImageNavigation,
  NavButton,
  ImageIndicators,
  Indicator,
  ProductAttributes,
  AttributeTag,
  AdminInfo,
  AdminInfoRow,
  AdminLabel,
  AdminValue
} from './ProductCardStyles';

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = product.imageUrls || ["https://via.placeholder.com/280x200?text=Product+Image"];

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price,
      image: images[currentImageIndex],
      quantity: 1
    }));
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} filled={i <= rating}>
          ★
        </Star>
      );
    }
    return stars;
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = isOnSale 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card>
      {product.discount > 0 && (
        <ProductBadge type="sale">
          -{product.discount}%
        </ProductBadge>
      )}
      {product.isNew && (
        <ProductBadge type="new">
          NEW
        </ProductBadge>
      )}

      {isAdmin && (
        <EditIcon
          onClick={(e) => {
            e.preventDefault();
            navigate(`/admin/products/${product.id}/edit`);
          }}
          title="Edit product"
        >
          ✏️
        </EditIcon>
      )}
      
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ImageContainer>
          <CardImage 
            src={images[currentImageIndex]} 
            alt={product.title} 
          />
          
          {images.length > 1 && (
            <>
              <ImageNavigation direction="left">
                <NavButton onClick={prevImage}>
                  ‹
                </NavButton>
              </ImageNavigation>
              
              <ImageNavigation direction="right">
                <NavButton onClick={nextImage}>
                  ›
                </NavButton>
              </ImageNavigation>
              
              <ImageIndicators>
                {images.map((_, index) => (
                  <Indicator
                    key={index}
                    active={index === currentImageIndex}
                    onClick={(e) => goToImage(index, e)}
                  />
                ))}
              </ImageIndicators>
            </>
          )}
        </ImageContainer>
      </Link>
      
      <CardContent>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>{product.title}</CardTitle>
        </Link>
        
        {product.description && (
          <CardDescription>{product.description}</CardDescription>
        )}

        {/* Product Attributes */}
        <ProductAttributes>
          {product.category && (
            <AttributeTag type="category">
              {product.category}
            </AttributeTag>
          )}
          {product.gender && (
            <AttributeTag type="gender">
              {product.gender}
            </AttributeTag>
          )}
          <AttributeTag type="availability" available={product.available}>
            {product.available ? t('inStock') : t('outOfStock')}
          </AttributeTag>
        </ProductAttributes>

        {/* Admin Information */}
        {isAdmin && (
          <AdminInfo>
            <AdminInfoRow>
              <AdminLabel>ID:</AdminLabel>
              <AdminValue>{product.id}</AdminValue>
            </AdminInfoRow>
            {product.createdAt && (
              <AdminInfoRow>
                <AdminLabel>Created:</AdminLabel>
                <AdminValue>{formatDate(product.createdAt)}</AdminValue>
              </AdminInfoRow>
            )}
            {product.updatedAt && (
              <AdminInfoRow>
                <AdminLabel>Updated:</AdminLabel>
                <AdminValue>{formatDate(product.updatedAt)}</AdminValue>
              </AdminInfoRow>
            )}
            {product.subcategory && (
              <AdminInfoRow>
                <AdminLabel>Subcategory:</AdminLabel>
                <AdminValue>{product.subcategory}</AdminValue>
              </AdminInfoRow>
            )}
          </AdminInfo>
        )}
        
        {product.rating && (
          <RatingContainer>
            {renderStars(product.rating)}
            <RatingText>({product.rating})</RatingText>
          </RatingContainer>
        )}
        
        <CardPrice>
          <PriceLabel>{t('price') || 'Price'}:</PriceLabel>
          ${product.discount 
            ? (product.price * (1 - product.discount / 100)).toFixed(2)
            : product.price.toFixed(2)
          }
          {product.discount > 0 && (
            <span style={{ 
              textDecoration: 'line-through', 
              color: '#95a5a6', 
              fontSize: '16px',
              marginLeft: '8px'
            }}>
              ${product.price.toFixed(2)}
            </span>
          )}
        </CardPrice>
        
        <AddToCartButton onClick={handleAddToCart} disabled={!product.available}>
          {t('addToCart') || 'Add to Cart'}
        </AddToCartButton>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
