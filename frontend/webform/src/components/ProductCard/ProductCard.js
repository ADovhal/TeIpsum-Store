// src/components/ProductCard/ProductCard.js
import React from 'react';
import { Card, CardImage, CardContent, CardTitle, CardPrice, AddToCartButton } from './ProductCardStyles'; // Импортируем стилизованные компоненты

const ProductCard = ({ product }) => {
  return (
    <Card>
      <CardImage src={product.imageUrl || "https://via.placeholder.com/200"} alt={product.name} />
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardPrice>${product.price.toFixed(2)}</CardPrice>
        <AddToCartButton>Добавить в корзину</AddToCartButton>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
