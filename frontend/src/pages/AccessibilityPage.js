import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const AccessibilityContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #16a085 0%, #1abc9c 100%);
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
    padding: 40px 15px;
  }
`;

const Title = styled(motion.h1)`
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #16a085, #1abc9c);
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
  text-align: center;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 3px solid #16a085;
  padding-bottom: 10px;
`;

const Text = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 1rem;
  text-align: left;
  padding: 0 15px;

  
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 30px 0;
`;

const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, #e8f8f5 0%, #d5f4e6 100%);
  padding: 30px;
  border-radius: 15px;
  border-left: 5px solid #16a085;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #16a085;
`;

const FeatureTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const FeatureText = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin: 0;
`;

const List = styled.ul`
  color: #5a6c7d;
  line-height: 1.6;
  margin: 15px 0;
  padding: 0 35px;

  @media (min-width: 1050px){
    padding: 0 60px;
  }

`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const ContactBox = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px solid #2196f3;
  border-radius: 15px;
  padding: 30px;
  margin: 40px 0;
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
  text-align: left;
`;

const StandardsBox = styled.div`
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 2px solid #f39c12;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
`;

const StandardsTitle = styled.h4`
  color: #856404;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const StandardsText = styled.p`
  color: #856404;
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
`;

const AccessibilityPage = () => {
  const  { t } = useLanguage();
  useEffect(() => {
    document.title = `${t('accessibilityPage')} - TeIpsum`;
  }, [t]);

  const accessibilityFeatures = [
    {
      icon: "♿",
      title: t('accessibility.screenReaderSupport'),
      description: t('accessibility.screenReaderDesc')
    },
    {
      icon: "🎯",
      title: t('accessibility.keyboardNavigation'),
      description: t('accessibility.keyboardDesc')
    },
    {
      icon: "🔍",
      title: t('accessibility.textScaling'),
      description: t('accessibility.textScalingDesc')
    },
    {
      icon: "🎨",
      title: t('accessibility.highContrastMode'),
      description: t('accessibility.highContrastDesc')
    },
    {
      icon: "⏱️",
      title: t('accessibility.noTimeLimits'),
      description: t('accessibility.noTimeLimitsDesc')
    },
    {
      icon: "🚫",
      title: t('accessibility.seizureSafe'),
      description: t('accessibility.seizureSafeDesc')
    }
  ];

  return (
    <AccessibilityContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('accessibilityTitle')}
        </Title>
        
        <Subtitle>
          {t('accessibility.subtitle')}
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('accessibility.ourCommitment')}</SectionTitle>
          <Text>
            {t('accessibility.commitmentDesc1')}
          </Text>
          <Text>
            {t('accessibility.commitmentDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('accessibility.features')}</SectionTitle>
          <FeatureGrid>
            {accessibilityFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureText>{feature.description}</FeatureText>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>{t('accessibility.implemented')}</SectionTitle>
          <List>
            <ListItem><strong>{t('accessibility.semanticHTML')}:</strong> {t('accessibility.semanticHTMLDesc')}</ListItem>
            <ListItem><strong>{t('accessibility.altText')}:</strong> {t('accessibility.altTextDesc')}</ListItem>
            <ListItem><strong>{t('accessibility.formLabels')}:</strong> {t('accessibility.formLabelsDesc')}</ListItem>
            <ListItem><strong>{t('accessibility.colorContrast')}:</strong> {t('accessibility.colorContrastDesc')}</ListItem>
            <ListItem><strong>{t('accessibility.focusManagement')}:</strong> {t('accessibility.focusManagementDesc')}</ListItem>
            <ListItem><strong>{t('accessibility.ariaLabels')}:</strong> {t('accessibility.ariaLabelsDesc')}</ListItem>
            <ListItem><strong>{t('accessibility.responsiveDesign')}:</strong> {t('accessibility.responsiveDesignDesc')}</ListItem>
            <ListItem><strong>{t('accessibility.errorHandling')}:</strong> {t('accessibility.errorHandlingDesc')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>{t('accessibility.assistiveTechSupport')}</SectionTitle>
          <Text style={{textAlign:'left'}}>
            {t('accessibility.assistiveTechDesc')}
          </Text>
          <List>
            <ListItem><strong>{t('accessibility.screenReadersLabel')}:</strong> {t('accessibility.screenReadersList')}</ListItem>
            <ListItem><strong>{t('accessibility.voiceControl')}:</strong> {t('accessibility.voiceControlList')}</ListItem>
            <ListItem><strong>{t('accessibility.switchNavigation')}:</strong> {t('accessibility.switchNavigationList')}</ListItem>
            <ListItem><strong>{t('accessibility.magnification')}:</strong> {t('accessibility.magnificationList')}</ListItem>
          </List>
        </Section>

        <StandardsBox>
          <StandardsTitle>🏆 {t('accessibility.complianceStandards')}</StandardsTitle>
          <StandardsText>
            {t('accessibility.complianceDesc')}
          </StandardsText>
        </StandardsBox>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>{t('accessibility.ongoingImprovements')}</SectionTitle>
          <Text style={{textAlign:'left'}}>
            {t('accessibility.ongoingDesc')}
          </Text>
          <List>
            <ListItem>{t('accessibility.improvement1')}</ListItem>
            <ListItem>{t('accessibility.improvement2')}</ListItem>
            <ListItem>{t('accessibility.improvement3')}</ListItem>
            <ListItem>{t('accessibility.improvement4')}</ListItem>
            <ListItem>{t('accessibility.improvement5')}</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SectionTitle>{t('accessibility.browserRecommendations')}</SectionTitle>
          <Text style={{textAlign:'left'}}>
            {t('accessibility.recommendationsDesc')}
          </Text>
          <List>
            <ListItem>{t('accessibility.recommendation1')}</ListItem>
            <ListItem>{t('accessibility.recommendation2')}</ListItem>
            <ListItem>{t('accessibility.recommendation3')}</ListItem>
            <ListItem>{t('accessibility.recommendation4')}</ListItem>
          </List>
        </Section>

        <ContactBox>
          <ContactTitle>{t('accessibility.feedback')}</ContactTitle>
          <ContactText>
            {t('accessibility.feedbackDesc')}
          </ContactText>
          <ContactText>{t('accessibility.contactEmail')}</ContactText>
          <ContactText>{t('accessibility.contactPhone')}</ContactText>
          <ContactText>{t('accessibility.contactAddress')}</ContactText>
          <ContactText style={{ marginTop: '20px', fontWeight: '600' }}>
            {t('accessibility.responseTime')}
          </ContactText>
        </ContactBox>
      </ContentWrapper>
    </AccessibilityContainer>
  );
};

export default AccessibilityPage; 