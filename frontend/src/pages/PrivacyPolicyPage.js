import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const PrivacyContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(45deg, #667eea, #764ba2);
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
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
`;

const SubTitle = styled.h3`
  color: #34495e;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 25px;
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

const PrivacyPolicyPage = () => {
  useEffect(() => {
    document.title = "Privacy Policy - TeIpsum";
  }, []);

  return (
    <PrivacyContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Privacy Policy
        </Title>
        
        <LastUpdated>
          Last updated: January 1, 2025
        </LastUpdated>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>1. Introduction</SectionTitle>
          <Text>
            TeIpsum ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and share information about you when you use our 
            website and services.
          </Text>
          <Text>
            This policy applies to all information collected or submitted on the TeIpsum website and mobile applications.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SectionTitle>2. Information We Collect</SectionTitle>
          
          <SubTitle>Personal Information</SubTitle>
          <Text>We may collect the following personal information:</Text>
          <List>
            <ListItem>Name and contact information (email, phone number, address)</ListItem>
            <ListItem>Payment information (credit card details, billing address)</ListItem>
            <ListItem>Account credentials (username, password)</ListItem>
            <ListItem>Purchase history and preferences</ListItem>
            <ListItem>Communication preferences</ListItem>
          </List>

          <SubTitle>Automatically Collected Information</SubTitle>
          <Text>We automatically collect certain information when you visit our website:</Text>
          <List>
            <ListItem>IP address and device information</ListItem>
            <ListItem>Browser type and version</ListItem>
            <ListItem>Pages visited and time spent on our site</ListItem>
            <ListItem>Referring website</ListItem>
            <ListItem>Cookies and similar tracking technologies</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>3. How We Use Your Information</SectionTitle>
          <Text>We use your information for the following purposes:</Text>
          <List>
            <ListItem>Processing orders and transactions</ListItem>
            <ListItem>Providing customer service and support</ListItem>
            <ListItem>Sending order confirmations and shipping updates</ListItem>
            <ListItem>Personalizing your shopping experience</ListItem>
            <ListItem>Marketing communications (with your consent)</ListItem>
            <ListItem>Improving our website and services</ListItem>
            <ListItem>Preventing fraud and ensuring security</ListItem>
            <ListItem>Complying with legal obligations</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SectionTitle>4. Information Sharing</SectionTitle>
          <Text>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</Text>
          <List>
            <ListItem><strong>Service Providers:</strong> Third-party vendors who help us operate our business (payment processors, shipping companies, email services)</ListItem>
            <ListItem><strong>Legal Requirements:</strong> When required by law or to protect our rights</ListItem>
            <ListItem><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</ListItem>
            <ListItem><strong>Consent:</strong> When you give us explicit permission to share your information</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>5. Cookies and Tracking</SectionTitle>
          <Text>
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
            and personalize content. You can control cookie preferences through your browser settings.
          </Text>
          
          <SubTitle>Types of Cookies We Use:</SubTitle>
          <List>
            <ListItem><strong>Essential Cookies:</strong> Necessary for website functionality</ListItem>
            <ListItem><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</ListItem>
            <ListItem><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</ListItem>
            <ListItem><strong>Preference Cookies:</strong> Remember your settings and preferences</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <SectionTitle>6. Data Security</SectionTitle>
          <Text>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission 
            is completely secure, and we cannot guarantee absolute security.
          </Text>
          
          <SubTitle>Security Measures Include:</SubTitle>
          <List>
            <ListItem>SSL encryption for data transmission</ListItem>
            <ListItem>Secure payment processing</ListItem>
            <ListItem>Regular security audits</ListItem>
            <ListItem>Limited access to personal data</ListItem>
            <ListItem>Employee training on data protection</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>7. Your Rights</SectionTitle>
          <Text>Depending on your location, you may have the following rights:</Text>
          <List>
            <ListItem><strong>Access:</strong> Request a copy of your personal data</ListItem>
            <ListItem><strong>Correction:</strong> Update or correct inaccurate information</ListItem>
            <ListItem><strong>Deletion:</strong> Request deletion of your personal data</ListItem>
            <ListItem><strong>Portability:</strong> Receive your data in a structured format</ListItem>
            <ListItem><strong>Objection:</strong> Object to certain processing of your data</ListItem>
            <ListItem><strong>Restriction:</strong> Limit how we use your data</ListItem>
            <ListItem><strong>Withdrawal:</strong> Withdraw consent at any time</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <SectionTitle>8. Data Retention</SectionTitle>
          <Text>
            We retain your personal information only as long as necessary to fulfill the purposes outlined in this 
            privacy policy, comply with legal obligations, resolve disputes, and enforce our agreements.
          </Text>
          <Text>
            Account information is retained for as long as your account is active. Transaction data is kept for 
            7 years for accounting and legal purposes. Marketing data is retained until you unsubscribe.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>9. International Transfers</SectionTitle>
          <Text>
            Your information may be transferred to and processed in countries other than your own. We ensure 
            appropriate safeguards are in place to protect your data during international transfers.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <SectionTitle>10. Changes to This Policy</SectionTitle>
          <Text>
            We may update this privacy policy from time to time. We will notify you of any significant changes 
            by posting the new policy on our website and updating the "Last updated" date.
          </Text>
        </Section>

        <ContactBox>
          <ContactTitle>Contact Us About Privacy</ContactTitle>
          <ContactText>
            If you have questions about this privacy policy or how we handle your personal data, please contact us:
          </ContactText>
          <ContactText>📧 privacy@teipsum.com</ContactText>
          <ContactText>📞 +48 123 456 789</ContactText>
          <ContactText>📍 TeIpsum Privacy Officer, ul. Fashion 123, 90-001 Łódź, Poland</ContactText>
        </ContactBox>
      </ContentWrapper>
    </PrivacyContainer>
  );
};

export default PrivacyPolicyPage; 