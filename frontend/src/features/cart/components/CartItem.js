import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity } from '../cartSlice';
import styled from 'styled-components';

const CartItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ecf0f1;
  background: white;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
`;

const ItemPrice = styled.span`
  font-size: 14px;
  color: #e74c3c;
  font-weight: 600;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #bdc3c7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background: #c0392b;
  }
`;

const TotalPrice = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-left: 16px;
  text-align: right;
  min-width: 80px;
`;

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(incrementQuantity(item.id));
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity(item.id));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <CartItemContainer>
      <ItemImage 
        src={item.imageUrl || "https://via.placeholder.com/60x60?text=Product"} 
        alt={item.name} 
      />
      
      <ItemDetails>
        <ItemName>{item.name}</ItemName>
        <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
        
        <QuantityControls>
          <QuantityButton onClick={handleDecrement}>
            -
          </QuantityButton>
          <QuantityDisplay>{item.quantity}</QuantityDisplay>
          <QuantityButton onClick={handleIncrement}>
            +
          </QuantityButton>
        </QuantityControls>
      </ItemDetails>
      
      <TotalPrice>
        ${(item.price * item.quantity).toFixed(2)}
      </TotalPrice>
      
      <RemoveButton onClick={handleRemove}>
        Remove
      </RemoveButton>
    </CartItemContainer>
  );
};

export default CartItem;
