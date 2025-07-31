import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const ConfirmationContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConfirmationCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  color: #27ae60;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
`;

const Subtitle = styled.p`
  margin: 0 0 32px 0;
  font-size: 18px;
  color: #7f8c8d;
  line-height: 1.5;
`;

const OrderDetails = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  text-align: left;
`;

const OrderNumber = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #ecf0f1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  min-width: 140px;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;

  &:hover {
    background: linear-gradient(135deg, #2980b9 0%, #1f5f8b 100%);
    box-shadow: 0 8px 16px rgba(52, 152, 219, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #3498db;
  border: 2px solid #3498db;

  &:hover {
    background: #3498db;
    color: white;
    box-shadow: 0 8px 16px rgba(52, 152, 219, 0.3);
  }
`;

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order details from navigation state
  const orderNumber = location.state?.orderNumber || 'ORDER123456';
  const total = location.state?.total || 0;
  
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ConfirmationContainer>
      <ConfirmationCard>
        <SuccessIcon>✅</SuccessIcon>
        
        <Title>Order Confirmed!</Title>
        <Subtitle>
          Thank you for your purchase. Your order has been successfully placed and is being processed.
        </Subtitle>

        <OrderDetails>
          <OrderNumber>Order #{orderNumber}</OrderNumber>
          
          <OrderInfo>
            <InfoItem>
              <InfoLabel>Order Date</InfoLabel>
              <InfoValue>{orderDate}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Estimated Delivery</InfoLabel>
              <InfoValue>{estimatedDelivery}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Payment Method</InfoLabel>
              <InfoValue>Credit Card</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Order Status</InfoLabel>
              <InfoValue style={{ color: '#27ae60' }}>Processing</InfoValue>
            </InfoItem>
          </OrderInfo>

          <TotalAmount>
            Total: ${total.toFixed(2)}
          </TotalAmount>
        </OrderDetails>

        <p style={{ color: '#7f8c8d', lineHeight: 1.6 }}>
          You will receive an email confirmation with your order details shortly. 
          We'll also send you updates on your order status and tracking information.
        </p>

        <ActionButtons>
          <PrimaryButton onClick={() => navigate('/store')}>
            Continue Shopping
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/profile')}>
            View Orders
          </SecondaryButton>
        </ActionButtons>
      </ConfirmationCard>
    </ConfirmationContainer>
  );
};

export default OrderConfirmationPage; 