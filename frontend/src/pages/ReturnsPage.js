import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ReturnsContainer = styled.div`
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
  border-bottom: 3px solid #e74c3c;
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
  border-left: 5px solid #e74c3c;
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

const StepsList = styled.ol`
  color: #2c3e50;
  line-height: 1.8;
  margin: 20px 0;
  padding-left: 20px;
`;

const StepItem = styled.li`
  margin-bottom: 15px;
  font-size: 1.1rem;

  strong {
    color: #e74c3c;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 2px solid #f39c12;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
`;

const HighlightText = styled.p`
  color: #856404;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const WarningBox = styled.div`
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 2px solid #e74c3c;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
`;

const WarningText = styled.p`
  color: #721c24;
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
`;

const ProcessSteps = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin: 30px 0;
`;

const ContactInfo = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px solid #2196f3;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
`;

const ContactText = styled.p`
  color: #0d47a1;
  font-size: 1.1rem;
  margin: 10px 0;
  line-height: 1.6;

  &:first-child {
    font-weight: 600;
    font-size: 1.2rem;
  }
`;

const ReturnsPage = () => {
  useEffect(() => {
    document.title = "Returns & Exchanges - TeIpsum";
  }, []);

  return (
    <ReturnsContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Returns & Exchanges
        </Title>
        
        <Subtitle>
          We want you to love your TeIpsum pieces. If you're not completely satisfied, we're here to help.
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>Return Policy Overview</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>⏰ 30-Day Return Window</InfoTitle>
              <InfoText>
                You have 30 days from the delivery date to return items for a full refund or exchange.
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>💯 Original Condition</InfoTitle>
              <InfoText>
                Items must be unworn, unwashed, and in original condition with all tags attached.
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>📦 Free Return Shipping</InfoTitle>
              <InfoText>
                We provide prepaid return labels for all domestic returns. International returns may incur shipping costs.
              </InfoText>
            </InfoCard>
          </InfoGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>How to Return Items</SectionTitle>
          <ProcessSteps>
            <StepsList>
              <StepItem>
                <strong>Contact Us:</strong> Email returns@teipsum.com or use our online return portal with your order number.
              </StepItem>
              <StepItem>
                <strong>Receive Return Label:</strong> We'll send you a prepaid return shipping label within 24 hours.
              </StepItem>
              <StepItem>
                <strong>Package Items:</strong> Place items in original packaging (if available) or any secure packaging.
              </StepItem>
              <StepItem>
                <strong>Attach Label:</strong> Attach the prepaid return label to your package.
              </StepItem>
              <StepItem>
                <strong>Drop Off:</strong> Drop off at any post office or schedule a pickup.
              </StepItem>
              <StepItem>
                <strong>Get Refund:</strong> Refunds are processed within 5-7 business days after we receive your return.
              </StepItem>
            </StepsList>
          </ProcessSteps>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Exchange Process</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>🔄 Size Exchanges</InfoTitle>
              <InfoText>
                Need a different size? We'll expedite your exchange to get you the right fit as quickly as possible.
              </InfoText>
              <InfoText><strong>Processing time:</strong> 3-5 business days</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>🎨 Color/Style Exchanges</InfoTitle>
              <InfoText>
                Want a different color or style? Exchanges are subject to availability and price differences may apply.
              </InfoText>
              <InfoText><strong>Processing time:</strong> 5-7 business days</InfoText>
            </InfoCard>
          </InfoGrid>

          <HighlightBox>
            <HighlightText>
              💡 Pro Tip: For faster exchanges, you can order the new item and return the original separately.
            </HighlightText>
          </HighlightBox>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>What Cannot Be Returned</SectionTitle>
          <WarningBox>
            <WarningText>
              <strong>The following items cannot be returned for hygiene and safety reasons:</strong>
            </WarningText>
            <InfoText>
              • Underwear and intimate apparel<br/>
              • Swimwear (unless tags are still attached)<br/>
              • Earrings and pierced jewelry<br/>
              • Items marked as "Final Sale"<br/>
              • Gift cards<br/>
              • Items damaged by normal wear and tear
            </InfoText>
          </WarningBox>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Refund Information</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>💳 Refund Method</InfoTitle>
              <InfoText>
                Refunds are issued to the original payment method used for the purchase.
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>⏱️ Processing Time</InfoTitle>
              <InfoText>
                Refunds typically appear on your statement within 5-10 business days after processing.
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>🎁 Gift Returns</InfoTitle>
              <InfoText>
                Items purchased as gifts can be returned for store credit if no receipt is provided.
              </InfoText>
            </InfoCard>
          </InfoGrid>
        </Section>

        <ContactInfo>
          <ContactText>Need Help with Your Return?</ContactText>
          <ContactText>📧 Email: returns@teipsum.com</ContactText>
          <ContactText>📞 Phone: +48 123 456 789</ContactText>
          <ContactText>🕒 Monday - Friday: 9 AM - 6 PM CET</ContactText>
        </ContactInfo>
      </ContentWrapper>
    </ReturnsContainer>
  );
};

export default ReturnsPage; 