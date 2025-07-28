import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectCartItems, 
  selectCartIsOpen, 
  selectCartTotal, 
  selectCartItemCount,
  closeCart, 
  clearCart 
} from '../cartSlice';
import CartItem from './CartItem';
import styled from 'styled-components';

const CartOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const CartSidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: 100%;
    right: ${props => props.$isOpen ? '0' : '-100%'};
  }
`;

const CartHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
`;

const CartTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CartItemCount = styled.span`
  background: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #e74c3c;
  }
`;

const CartItemsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const EmptyCartMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #7f8c8d;
  text-align: center;
  padding: 20px;
`;

const EmptyCartIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const CartFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #ecf0f1;
  background: #f8f9fa;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #229954 0%, #27ae60 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(39, 174, 96, 0.3);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ClearCartButton = styled.button`
  width: 100%;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: #c0392b;
  }
`;

const CartSidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const isOpen = useSelector(selectCartIsOpen);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);

  // const handleClose = () => {
  //   dispatch(closeCart());
  // };

  const handleClose = () => {
    onClose();
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <>
      <CartOverlay $isOpen={isOpen} onClick={handleClose} />
      <CartSidebarContainer $isOpen={isOpen}>
        <CartHeader>
          <CartTitle>
            Shopping Cart
            {itemCount > 0 && <CartItemCount>{itemCount}</CartItemCount>}
          </CartTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </CartHeader>

        <CartItemsContainer>
          {items.length === 0 ? (
            <EmptyCartMessage>
              <EmptyCartIcon>🛒</EmptyCartIcon>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </EmptyCartMessage>
          ) : (
            items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </CartItemsContainer>

        {items.length > 0 && (
          <CartFooter>
            <CartTotal>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </CartTotal>
            <CheckoutButton onClick={handleCheckout}>
              Proceed to Checkout
            </CheckoutButton>
            <ClearCartButton onClick={handleClearCart}>
              Clear Cart
            </ClearCartButton>
          </CartFooter>
        )}
      </CartSidebarContainer>
    </>
  );
};

export default CartSidebar; 