import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const SuccessContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SuccessCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  color: #27ae60;
`;

const SuccessTitle = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const SuccessMessage = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const OrderNumber = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 30px;
  border: 2px solid #e9ecef;
`;

const OrderNumberLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const OrderNumberValue = styled.div`
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: monospace;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(motion(Link))`
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;

  &:hover {
    background: #3498db;
    color: white;
    transform: translateY(-2px);
  }
`;

const OrderSuccessPage = () => {
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <SuccessContainer>
      <SuccessCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <SuccessIcon>✅</SuccessIcon>
        <SuccessTitle>Order Confirmed!</SuccessTitle>
        <SuccessMessage>
          Thank you for your order! We've received your request and will begin processing it right away.
          You'll receive an email confirmation with tracking details shortly.
        </SuccessMessage>
        
        <OrderNumber>
          <OrderNumberLabel>Order Number</OrderNumberLabel>
          <OrderNumberValue>#{orderNumber}</OrderNumberValue>
        </OrderNumber>

        <ButtonGroup>
          <PrimaryButton
            to="/store"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </PrimaryButton>
          <SecondaryButton
            to="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </SecondaryButton>
        </ButtonGroup>
      </SuccessCard>
    </SuccessContainer>
  );
};

export default OrderSuccessPage; 