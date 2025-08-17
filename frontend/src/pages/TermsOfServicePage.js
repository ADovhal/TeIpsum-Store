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
  const { t } = useLanguage();
  
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
          {t('terms.title')}
        </Title>
        
        <LastUpdated>
          {t('lastUpdated')}: January 1, 2025
        </LastUpdated>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('terms.acceptanceOfTerms')}</SectionTitle>
          <Text>
            {t('terms.acceptanceDesc1')}
          </Text>
          <Text>
            {t('terms.acceptanceDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SectionTitle>{t('terms.useLicense')}</SectionTitle>
          <Text>
            {t('terms.useLicenseDesc1')}
          </Text>
          <Text>{t('terms.useLicenseDesc2')}</Text>
          <List>
            <ListItem>{t('terms.license1')}</ListItem>
            <ListItem>{t('terms.license2')}</ListItem>
            <ListItem>{t('terms.license3')}</ListItem>
            <ListItem>{t('terms.license4')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('terms.productInformation')}</SectionTitle>
          <Text>
            {t('terms.productInfoDesc1')}
          </Text>
          <Text>
            {t('terms.productInfoDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SectionTitle>{t('terms.pricingPayment')}</SectionTitle>
          <Text>
            {t('terms.pricingDesc1')}
          </Text>
          <Text>
            {t('terms.pricingDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>{t('terms.shippingDelivery')}</SectionTitle>
          <Text>
            {t('terms.shippingDesc1')}
          </Text>
          <Text>
            {t('terms.shippingDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <SectionTitle>{t('terms.returnsRefunds')}</SectionTitle>
          <Text>
            {t('terms.returnsDesc1')}
          </Text>
          <Text>
            {t('terms.returnsDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>{t('terms.userAccounts')}</SectionTitle>
          <Text>
            {t('terms.userAccountsDesc1')}
          </Text>
          <Text>
            {t('terms.userAccountsDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <SectionTitle>{t('terms.prohibitedUses')}</SectionTitle>
          <Text>{t('terms.prohibitedUsesDesc')}</Text>
          <List>
            <ListItem>{t('terms.prohibited1')}</ListItem>
            <ListItem>{t('terms.prohibited2')}</ListItem>
            <ListItem>{t('terms.prohibited3')}</ListItem>
            <ListItem>{t('terms.prohibited4')}</ListItem>
            <ListItem>{t('terms.prohibited5')}</ListItem>
            <ListItem>{t('terms.prohibited6')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>{t('terms.limitationLiability')}</SectionTitle>
          <Text>
            {t('terms.limitationDesc1')}
          </Text>
          <Text>
            {t('terms.limitationDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <SectionTitle>{t('terms.indemnification')}</SectionTitle>
          <Text>
            {t('terms.indemnificationDesc')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SectionTitle>{t('terms.governingLaw')}</SectionTitle>
          <Text>
            {t('terms.governingLawDesc')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <SectionTitle>{t('terms.changesToTerms')}</SectionTitle>
          <Text>
            {t('terms.changesToTermsDesc')}
          </Text>
        </Section>

        <ContactBox>
          <ContactTitle>{t('terms.questionsAboutTerms')}</ContactTitle>
          <ContactText>
            {t('terms.questionsDesc')}
          </ContactText>
          <ContactText>{t('terms.legalEmail')}</ContactText>
          <ContactText>{t('terms.legalPhone')}</ContactText>
          <ContactText>{t('terms.legalAddress')}</ContactText>
        </ContactBox>
      </ContentWrapper>
    </TermsContainer>
  );
};

export default TermsOfServicePage; 