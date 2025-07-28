import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { clearCart } from '../features/cart/cartSlice';

const CheckoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const CheckoutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const OrderFormSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const AccountIncentiveSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  height: fit-content;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;

const IncentiveSectionTitle = styled.h2`
  color: white;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  padding: 15px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 18px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const IncentiveCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const IncentiveTitle = styled.h3`
  color: white;
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: 600;
`;

const IncentiveText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 15px;
`;

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
  padding-left: 25px;
  position: relative;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #2ecc71;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const CreateAccountButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const OrderSummary = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
`;

const SummaryTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
`;

const SummaryLabel = styled.span`
  color: #7f8c8d;
  font-weight: 500;
`;

const SummaryValue = styled.span`
  color: #2c3e50;
  font-weight: 600;
`;

const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #3498db;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
`;

const StatusMessage = styled(motion.div)`
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  background: ${props => props.type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.type === 'success' ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#f5c6cb'};
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    notes: ''
  });
  const [status, setStatus] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/store');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the order to your backend
      const orderData = {
        customer: formData,
        items: cartItems,
        total: total,
        orderDate: new Date().toISOString()
      };

      console.log('Order submitted:', orderData);
      
      setStatus('success');
      dispatch(clearCart());
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/order-success');
      }, 2000);
      
    } catch (error) {
      setStatus('error');
    }
  };

  const handleCreateAccount = () => {
    navigate('/register', { 
      state: { 
        prefillData: formData,
        fromCheckout: true 
      }
    });
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <CheckoutContainer>
      <CheckoutContent>
        <OrderFormSection>
          <SectionTitle>Complete Your Order</SectionTitle>
          
          <OrderSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            <SummaryItem>
              <SummaryLabel>Items ({cartItems.length})</SummaryLabel>
              <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Shipping</SummaryLabel>
              <SummaryValue>${shipping.toFixed(2)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Tax</SummaryLabel>
              <SummaryValue>${tax.toFixed(2)}</SummaryValue>
            </SummaryItem>
            <TotalAmount>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </TotalAmount>
          </OrderSummary>

          <Form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormGroup>
                <Label>First Name *</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Name *</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormGroup>
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Phone *</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>

            <FormGroup>
              <Label>Address *</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <FormGroup>
                <Label>City *</Label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Postal Code *</Label>
                <Input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Country *</Label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>

            <FormGroup>
              <Label>Order Notes</Label>
              <TextArea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions or requests..."
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? 'Processing Order...' : 'Place Order'}
            </SubmitButton>
          </Form>

          {status && status !== 'loading' && (
            <StatusMessage
              type={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {status === 'success' 
                ? 'Order placed successfully! Redirecting to confirmation...' 
                : 'Something went wrong. Please try again.'
              }
            </StatusMessage>
          )}
        </OrderFormSection>

        <AccountIncentiveSection>
          <IncentiveSectionTitle>Create an Account</IncentiveSectionTitle>
          
          <IncentiveCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <IncentiveTitle>🎁 Welcome Bonus</IncentiveTitle>
            <IncentiveText>
              Join our community and enjoy exclusive benefits with your first order!
            </IncentiveText>
            <BenefitList>
              <BenefitItem>10% off your first order</BenefitItem>
              <BenefitItem>Exclusive vouchers and discounts</BenefitItem>
              <BenefitItem>Order history and tracking</BenefitItem>
              <BenefitItem>Early access to new collections</BenefitItem>
              <BenefitItem>Personalized recommendations</BenefitItem>
              <BenefitItem>Free shipping on orders over $100</BenefitItem>
            </BenefitList>
          </IncentiveCard>

          <CreateAccountButton
            onClick={handleCreateAccount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account & Save 10%
          </CreateAccountButton>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem'
          }}>
            You can still complete your order without creating an account
          </p>
        </AccountIncentiveSection>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default CheckoutPage; 