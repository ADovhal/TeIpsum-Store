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
  const { t } = useLanguage();
  
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
          {t('privacy.title')}
        </Title>
        
        <LastUpdated>
          {t('lastUpdated')}: January 1, 2025
        </LastUpdated>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('privacy.introduction')}</SectionTitle>
          <Text>
            {t('privacy.introductionDesc1')}
          </Text>
          <Text>
            {t('privacy.introductionDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SectionTitle>{t('privacy.informationWeCollect')}</SectionTitle>
          
          <SubTitle>{t('privacy.personalInformation')}</SubTitle>
          <Text>{t('privacy.personalInformationDesc')}</Text>
          <List>
            <ListItem>{t('privacy.personalInfo1')}</ListItem>
            <ListItem>{t('privacy.personalInfo2')}</ListItem>
            <ListItem>{t('privacy.personalInfo3')}</ListItem>
            <ListItem>{t('privacy.personalInfo4')}</ListItem>
            <ListItem>{t('privacy.personalInfo5')}</ListItem>
          </List>

          <SubTitle>{t('privacy.automaticallyCollected')}</SubTitle>
          <Text>{t('privacy.automaticallyCollectedDesc')}</Text>
          <List>
            <ListItem>{t('privacy.autoInfo1')}</ListItem>
            <ListItem>{t('privacy.autoInfo2')}</ListItem>
            <ListItem>{t('privacy.autoInfo3')}</ListItem>
            <ListItem>{t('privacy.autoInfo4')}</ListItem>
            <ListItem>{t('privacy.autoInfo5')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('privacy.howWeUseInfo')}</SectionTitle>
          <Text>{t('privacy.howWeUseInfoDesc')}</Text>
          <List>
            <ListItem>{t('privacy.useInfo1')}</ListItem>
            <ListItem>{t('privacy.useInfo2')}</ListItem>
            <ListItem>{t('privacy.useInfo3')}</ListItem>
            <ListItem>{t('privacy.useInfo4')}</ListItem>
            <ListItem>{t('privacy.useInfo5')}</ListItem>
            <ListItem>{t('privacy.useInfo6')}</ListItem>
            <ListItem>{t('privacy.useInfo7')}</ListItem>
            <ListItem>{t('privacy.useInfo8')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SectionTitle>{t('privacy.informationSharing')}</SectionTitle>
          <Text>{t('privacy.informationSharingDesc')}</Text>
          <List>
            <ListItem>{t('privacy.shareInfo1')}</ListItem>
            <ListItem>{t('privacy.shareInfo2')}</ListItem>
            <ListItem>{t('privacy.shareInfo3')}</ListItem>
            <ListItem>{t('privacy.shareInfo4')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>{t('privacy.cookiesAndTracking')}</SectionTitle>
          <Text>
            {t('privacy.cookiesDesc1')}
          </Text>
          
          <SubTitle>{t('privacy.cookiesDesc2')}</SubTitle>
          <List>
            <ListItem>{t('privacy.cookieType1')}</ListItem>
            <ListItem>{t('privacy.cookieType2')}</ListItem>
            <ListItem>{t('privacy.cookieType3')}</ListItem>
            <ListItem>{t('privacy.cookieType4')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <SectionTitle>{t('privacy.dataSecurity')}</SectionTitle>
          <Text>
            {t('privacy.dataSecurityDesc1')}
          </Text>
          
          <SubTitle>{t('privacy.dataSecurityDesc2')}</SubTitle>
          <List>
            <ListItem>{t('privacy.securityMeasure1')}</ListItem>
            <ListItem>{t('privacy.securityMeasure2')}</ListItem>
            <ListItem>{t('privacy.securityMeasure3')}</ListItem>
            <ListItem>{t('privacy.securityMeasure4')}</ListItem>
            <ListItem>{t('privacy.securityMeasure5')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>{t('privacy.yourRights')}</SectionTitle>
          <Text>{t('privacy.yourRightsDesc')}</Text>
          <List>
            <ListItem>{t('privacy.right1')}</ListItem>
            <ListItem>{t('privacy.right2')}</ListItem>
            <ListItem>{t('privacy.right3')}</ListItem>
            <ListItem>{t('privacy.right4')}</ListItem>
            <ListItem>{t('privacy.right5')}</ListItem>
            <ListItem>{t('privacy.right6')}</ListItem>
            <ListItem>{t('privacy.right7')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <SectionTitle>{t('privacy.dataRetention')}</SectionTitle>
          <Text>
            {t('privacy.dataRetentionDesc1')}
          </Text>
          <Text>
            {t('privacy.dataRetentionDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>{t('privacy.internationalTransfers')}</SectionTitle>
          <Text>
            {t('privacy.internationalTransfersDesc')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <SectionTitle>{t('privacy.policyChanges')}</SectionTitle>
          <Text>
            {t('privacy.policyChangesDesc')}
          </Text>
        </Section>

        <ContactBox>
          <ContactTitle>{t('privacy.contactTitle')}</ContactTitle>
          <ContactText>
            {t('privacy.contactDesc')}
          </ContactText>
          <ContactText>{t('privacy.contactEmail')}</ContactText>
          <ContactText>{t('privacy.contactPhone')}</ContactText>
          <ContactText>{t('privacy.contactAddress')}</ContactText>
        </ContactBox>
      </ContentWrapper>
    </PrivacyContainer>
  );
};

export default PrivacyPolicyPage; 