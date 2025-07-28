import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ShippingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`;

const Title = styled(motion.h1)`
  color: #2c3e50;
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 50px;
  line-height: 1.6;
`;

const Section = styled(motion.section)`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 30px 0;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 30px;
  border-radius: 15px;
  border-left: 5px solid #3498db;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const InfoTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const InfoText = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PriceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const TableHeader = styled.th`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;

  &:last-child {
    font-weight: 600;
    color: #27ae60;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  border: 2px solid #27ae60;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
`;

const HighlightText = styled.p`
  color: #155724;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const ShippingPage = () => {
  useEffect(() => {
    document.title = "Shipping Information - TeIpsum";
  }, []);

  return (
    <ShippingContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Shipping Information
        </Title>
        
        <Subtitle>
          Fast, reliable delivery options to get your TeIpsum pieces to you safely and quickly.
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>Delivery Options</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>🚚 Standard Delivery</InfoTitle>
              <InfoText>
                <strong>3-5 business days</strong><br/>
                Perfect for regular orders with no rush. Your items will be carefully packaged and delivered to your doorstep.
              </InfoText>
              <InfoText><strong>Tracking:</strong> Full tracking provided</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>⚡ Express Delivery</InfoTitle>
              <InfoText>
                <strong>1-2 business days</strong><br/>
                When you need your TeIpsum pieces quickly. Priority handling and expedited shipping.
              </InfoText>
              <InfoText><strong>Tracking:</strong> Real-time tracking updates</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>🌍 International Shipping</InfoTitle>
              <InfoText>
                <strong>7-14 business days</strong><br/>
                We ship worldwide! Delivery times vary by destination. All customs fees are the customer's responsibility.
              </InfoText>
              <InfoText><strong>Tracking:</strong> International tracking included</InfoText>
            </InfoCard>
          </InfoGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Shipping Costs</SectionTitle>
          <PriceTable>
            <thead>
              <tr>
                <TableHeader>Delivery Type</TableHeader>
                <TableHeader>Order Value</TableHeader>
                <TableHeader>Cost</TableHeader>
              </tr>
            </thead>
            <tbody>
              <TableRow>
                <TableCell>Standard Delivery</TableCell>
                <TableCell>Under $75</TableCell>
                <TableCell>$8.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Standard Delivery</TableCell>
                <TableCell>$75 and above</TableCell>
                <TableCell>FREE</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Express Delivery</TableCell>
                <TableCell>Any value</TableCell>
                <TableCell>$15.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>International</TableCell>
                <TableCell>Any value</TableCell>
                <TableCell>$25.99+</TableCell>
              </TableRow>
            </tbody>
          </PriceTable>

          <HighlightBox>
            <HighlightText>
              🎉 FREE Standard Shipping on all orders over $75!
            </HighlightText>
          </HighlightBox>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Processing & Packaging</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>📦 Order Processing</InfoTitle>
              <InfoText>
                All orders are processed within 1-2 business days. Orders placed after 2 PM Friday will be processed the following Monday.
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>🎁 Sustainable Packaging</InfoTitle>
              <InfoText>
                We use eco-friendly packaging materials. Your items arrive in recyclable boxes with minimal environmental impact.
              </InfoText>
            </InfoCard>
          </InfoGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Important Notes</SectionTitle>
          <InfoText>
            • Delivery times are estimates and may be affected by weather or other unforeseen circumstances
          </InfoText>
          <InfoText>
            • P.O. Box addresses are not accepted for Express Delivery
          </InfoText>
          <InfoText>
            • Signature confirmation may be required for orders over $200
          </InfoText>
          <InfoText>
            • International customers are responsible for any customs duties or taxes
          </InfoText>
          <InfoText>
            • We ship Monday through Friday, excluding holidays
          </InfoText>
        </Section>
      </ContentWrapper>
    </ShippingContainer>
  );
};

export default ShippingPage; 