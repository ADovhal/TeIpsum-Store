import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../cart/cartSlice';
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
  RatingText
} from './ProductCardStyles';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price,
      image: product.imageUrls?.[0] || '',
      quantity: 1
    }));
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
      
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardImage 
          src={product.imageUrls?.[0] || "https://via.placeholder.com/280x200?text=Product+Image"} 
          alt={product.title} 
        />
      </Link>
      
      <CardContent>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardTitle>{product.title}</CardTitle>
        </Link>
        
        {product.description && (
          <CardDescription>{product.description}</CardDescription>
        )}
        
        {product.rating && (
          <RatingContainer>
            {renderStars(product.rating)}
            <RatingText>({product.rating})</RatingText>
          </RatingContainer>
        )}
        
        <CardPrice>
          <PriceLabel>Price:</PriceLabel>
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
        
        <AddToCartButton onClick={handleAddToCart}>
          Add to Cart
        </AddToCartButton>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
