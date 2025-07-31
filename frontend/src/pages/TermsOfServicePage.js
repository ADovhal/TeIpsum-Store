import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const TermsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
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
  background: linear-gradient(45deg, #8e44ad, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LastUpdated = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-size: 1rem;
  margin-bottom: 50px;
  font-style: italic;
`;

const Section = styled(motion.section)`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #8e44ad;
  padding-bottom: 8px;
`;

const Text = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 1rem;
`;

const List = styled.ul`
  color: #5a6c7d;
  line-height: 1.6;
  margin: 15px 0;
  padding-left: 25px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const ContactBox = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px solid #2196f3;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
`;

const ContactTitle = styled.h3`
  color: #0d47a1;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const ContactText = styled.p`
  color: #1565c0;
  font-size: 1rem;
  margin: 10px 0;
  line-height: 1.6;
`;

const TermsOfServicePage = () => {
  useEffect(() => {
    document.title = "Terms of Service - TeIpsum";
  }, []);

  return (
    <TermsContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Terms of Service
        </Title>
        
        <LastUpdated>
          Last updated: January 1, 2025
        </LastUpdated>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>1. Acceptance of Terms</SectionTitle>
          <Text>
            By accessing and using the TeIpsum website and services, you accept and agree to be bound by the 
            terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
          </Text>
          <Text>
            These terms apply to all users of the site, including without limitation users who are browsers, 
            vendors, customers, merchants, and contributors of content.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SectionTitle>2. Use License</SectionTitle>
          <Text>
            Permission is granted to temporarily download one copy of the materials on TeIpsum's website for 
            personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </Text>
          <Text>Under this license you may not:</Text>
          <List>
            <ListItem>Modify or copy the materials</ListItem>
            <ListItem>Use the materials for any commercial purpose or for any public display</ListItem>
            <ListItem>Attempt to reverse engineer any software contained on the website</ListItem>
            <ListItem>Remove any copyright or other proprietary notations from the materials</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>3. Product Information</SectionTitle>
          <Text>
            We strive to provide accurate product descriptions, pricing, and availability information. However, 
            we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
          </Text>
          <Text>
            If a product offered by TeIpsum is not as described, your sole remedy is to return it in unused condition 
            according to our return policy.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SectionTitle>4. Pricing and Payment</SectionTitle>
          <Text>
            All prices are subject to change without notice. We reserve the right to modify or discontinue any 
            product at any time. Payment must be received by us before we process your order.
          </Text>
          <Text>
            We accept major credit cards and other payment methods as displayed during checkout. By providing 
            payment information, you authorize us to charge the specified amount for your order.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>5. Shipping and Delivery</SectionTitle>
          <Text>
            Shipping costs and delivery times vary by location and shipping method selected. We are not responsible 
            for delays caused by shipping carriers or customs procedures.
          </Text>
          <Text>
            Risk of loss and title for items purchased from TeIpsum pass to you upon delivery to the carrier.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <SectionTitle>6. Returns and Refunds</SectionTitle>
          <Text>
            Our return policy allows returns within 30 days of purchase for most items in original condition. 
            Please refer to our detailed return policy for complete terms and conditions.
          </Text>
          <Text>
            Refunds will be processed to the original payment method within 5-7 business days after we receive 
            and process your return.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>7. User Accounts</SectionTitle>
          <Text>
            When you create an account, you must provide accurate and complete information. You are responsible 
            for maintaining the confidentiality of your account credentials.
          </Text>
          <Text>
            You agree to notify us immediately of any unauthorized use of your account. We are not liable for 
            any loss or damage arising from your failure to protect your account information.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <SectionTitle>8. Prohibited Uses</SectionTitle>
          <Text>You may not use our service:</Text>
          <List>
            <ListItem>For any unlawful purpose or to solicit others to unlawful acts</ListItem>
            <ListItem>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</ListItem>
            <ListItem>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</ListItem>
            <ListItem>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</ListItem>
            <ListItem>To submit false or misleading information</ListItem>
            <ListItem>To upload or transmit viruses or any other type of malicious code</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>9. Limitation of Liability</SectionTitle>
          <Text>
            In no case shall TeIpsum, our directors, officers, employees, affiliates, agents, contractors, interns, 
            suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, 
            incidental, punitive, special, or consequential damages of any kind.
          </Text>
          <Text>
            Our maximum liability to you for any claims arising from your use of our services shall not exceed 
            the amount you paid for the products or services in question.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <SectionTitle>10. Indemnification</SectionTitle>
          <Text>
            You agree to indemnify, defend, and hold harmless TeIpsum and our parent, subsidiaries, affiliates, 
            partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, 
            suppliers, interns, and employees from any claim or demand made by any third party.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SectionTitle>11. Governing Law</SectionTitle>
          <Text>
            These terms and conditions are governed by and construed in accordance with the laws of Poland, 
            and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <SectionTitle>12. Changes to Terms</SectionTitle>
          <Text>
            We reserve the right to update or modify these terms of service at any time. Changes will be posted 
            on this page with an updated revision date. Your continued use of our services after any changes 
            constitutes acceptance of the new terms.
          </Text>
        </Section>

        <ContactBox>
          <ContactTitle>Questions About These Terms?</ContactTitle>
          <ContactText>
            If you have any questions about these Terms of Service, please contact us:
          </ContactText>
          <ContactText>📧 legal@teipsum.com</ContactText>
          <ContactText>📞 +48 123 456 789</ContactText>
          <ContactText>📍 TeIpsum Legal Department, ul. Fashion 123, 90-001 Łódź, Poland</ContactText>
        </ContactBox>
      </ContentWrapper>
    </TermsContainer>
  );
};

export default TermsOfServicePage; 