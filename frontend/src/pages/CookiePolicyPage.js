import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const CookieContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
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
  background: linear-gradient(45deg, #f39c12, #e67e22);
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
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #f39c12;
  padding-bottom: 8px;
`;

const Text = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 1rem;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    /* Hide table on mobile and show cards instead */
    display: none;
  }
`;

const CookieTable = styled.table`
  width: 100%;
  min-width: 600px; /* Ensure minimum width for proper layout */
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
  vertical-align: top;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 2px solid #f39c12;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
`;

const HighlightText = styled.p`
  color: #856404;
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
`;

const MobileCardsContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const CookieCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #f39c12;
`;

const CardHeader = styled.div`
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-align: center;
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ecf0f1;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const CardLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.span`
  color: #5a6c7d;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CookiePolicyPage = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    document.title = "Cookie Policy - TeIpsum";
  }, []);

  const cookieTypes = [
    {
      type: t('cookies.essentialCookies'),
      purpose: t('cookies.essentialPurpose'),
      duration: t('cookies.essentialDuration'),
      examples: t('cookies.essentialExamples')
    },
    {
      type: t('cookies.analyticsCookies'),
      purpose: t('cookies.analyticsPurpose'),
      duration: t('cookies.analyticsDuration'),
      examples: t('cookies.analyticsExamples')
    },
    {
      type: t('cookies.marketingCookies'),
      purpose: t('cookies.marketingPurpose'),
      duration: t('cookies.marketingDuration'),
      examples: t('cookies.marketingExamples')
    },
    {
      type: t('cookies.preferenceCookies'),
      purpose: t('cookies.preferencePurpose'),
      duration: t('cookies.preferenceDuration'),
      examples: t('cookies.preferenceExamples')
    }
  ];

  return (
    <CookieContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('cookies.title')}
        </Title>
        
        <Subtitle>
          {t('cookies.description')}
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('cookies.whatAreCookies')}</SectionTitle>
          <Text>
            {t('cookies.whatAreCookiesDesc1')}
          </Text>
          <Text>
            {t('cookies.whatAreCookiesDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SectionTitle>{t('cookies.howWeUseCookies')}</SectionTitle>
          <Text>
            {t('cookies.howWeUseCookiesDesc1')}
          </Text>
          <Text>
            {t('cookies.howWeUseCookiesDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('cookies.typesOfCookies')}</SectionTitle>
          
          {/* Desktop Table */}
          <TableContainer>
            <CookieTable>
              <thead>
                <tr>
                  <TableHeader>{t('cookies.cookieType')}</TableHeader>
                  <TableHeader>{t('cookies.purpose')}</TableHeader>
                  <TableHeader>{t('cookies.duration')}</TableHeader>
                  <TableHeader>{t('cookies.examples')}</TableHeader>
                </tr>
              </thead>
              <tbody>
                {cookieTypes.map((cookie, index) => (
                  <TableRow key={index}>
                    <TableCell><strong>{cookie.type}</strong></TableCell>
                    <TableCell>{cookie.purpose}</TableCell>
                    <TableCell>{cookie.duration}</TableCell>
                    <TableCell>{cookie.examples}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </CookieTable>
          </TableContainer>

          {/* Mobile Cards */}
          <MobileCardsContainer>
            {cookieTypes.map((cookie, index) => (
              <CookieCard key={index}>
                <CardHeader>{cookie.type}</CardHeader>
                <CardRow>
                  <CardLabel>{t('cookies.purpose')}</CardLabel>
                  <CardValue>{cookie.purpose}</CardValue>
                </CardRow>
                <CardRow>
                  <CardLabel>{t('cookies.duration')}</CardLabel>
                  <CardValue>{cookie.duration}</CardValue>
                </CardRow>
                <CardRow>
                  <CardLabel>{t('cookies.examples')}</CardLabel>
                  <CardValue>{cookie.examples}</CardValue>
                </CardRow>
              </CookieCard>
            ))}
          </MobileCardsContainer>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SectionTitle>{t('cookies.thirdPartyCookies')}</SectionTitle>
          <Text>
            {t('cookies.thirdPartyDesc1')}
          </Text>
          <Text>
            {t('cookies.thirdPartyDesc2')}
          </Text>
          <Text>
            {t('cookies.thirdPartyDesc3')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>{t('cookies.managingPreferences')}</SectionTitle>
          <Text>
            {t('cookies.managingDesc1')}
          </Text>
          
          <Text>
            {t('cookies.browserSettings')}
          </Text>
          <Text>
            {t('cookies.browserSettingsDesc')}
          </Text>

          <Text>
            {t('cookies.consentBanner')}
          </Text>

          <Text>
            {t('cookies.optOutTools')}
          </Text>
          <Text>
            {t('cookies.optOutToolsDesc')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <SectionTitle>{t('cookies.impactDisabling')}</SectionTitle>
          <Text>
            {t('cookies.impactDisablingDesc1')}
          </Text>
          <Text>
            {t('cookies.impactDisablingDesc2')}
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>{t('cookies.policyUpdates')}</SectionTitle>
          <Text>
            {t('cookies.policyUpdatesDesc')}
          </Text>
        </Section>

        <HighlightBox>
          <HighlightText>
            {t('cookies.needMoreInfo')}
          </HighlightText>
        </HighlightBox>
      </ContentWrapper>
    </CookieContainer>
  );
};

export default CookiePolicyPage; 