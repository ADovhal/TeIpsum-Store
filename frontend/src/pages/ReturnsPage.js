import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();
  
  useEffect(() => {
    document.title = `${t('returns.title')} - TeIpsum`;
  }, [t]);

  return (
    <ReturnsContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('returns.title')}
        </Title>
        
        <Subtitle>
          {t('returns.subtitle')}
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('returns.policyOverview')}</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>{t('returns.returnWindow')}</InfoTitle>
              <InfoText>
                {t('returns.returnWindowDesc')}
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>{t('returns.originalCondition')}</InfoTitle>
              <InfoText>
                {t('returns.originalConditionDesc')}
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>{t('returns.freeShipping')}</InfoTitle>
              <InfoText>
                {t('returns.freeShippingDesc')}
              </InfoText>
            </InfoCard>
          </InfoGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('returns.howToReturn')}</SectionTitle>
          <ProcessSteps>
            <StepsList>
              <StepItem>
                {t('returns.step1')}
              </StepItem>
              <StepItem>
                {t('returns.step2')}
              </StepItem>
              <StepItem>
                {t('returns.step3')}
              </StepItem>
              <StepItem>
                {t('returns.step4')}
              </StepItem>
              <StepItem>
                {t('returns.step5')}
              </StepItem>
              <StepItem>
                {t('returns.step6')}
              </StepItem>
            </StepsList>
          </ProcessSteps>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>{t('returns.exchangeProcess')}</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>{t('returns.sizeExchanges')}</InfoTitle>
              <InfoText>
                {t('returns.sizeExchangesDesc')}
              </InfoText>
              <InfoText>{t('returns.processingTime1')}</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>{t('returns.colorExchanges')}</InfoTitle>
              <InfoText>
                {t('returns.colorExchangesDesc')}
              </InfoText>
              <InfoText>{t('returns.processingTime2')}</InfoText>
            </InfoCard>
          </InfoGrid>

          <HighlightBox>
            <HighlightText>
              {t('returns.proTip')}
            </HighlightText>
          </HighlightBox>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>{t('returns.cannotReturn')}</SectionTitle>
          <WarningBox>
            <WarningText>
              {t('returns.cannotReturnWarning')}
            </WarningText>
            <InfoText>
              {t('returns.cannotReturnList')}
            </InfoText>
          </WarningBox>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>{t('returns.refundInfo')}</SectionTitle>
          <InfoGrid>
            <InfoCard>
              <InfoTitle>{t('returns.refundMethod')}</InfoTitle>
              <InfoText>
                {t('returns.refundMethodDesc')}
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>{t('returns.refundProcessingTime')}</InfoTitle>
              <InfoText>
                {t('returns.refundProcessingDesc')}
              </InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>{t('returns.giftReturns')}</InfoTitle>
              <InfoText>
                {t('returns.giftReturnsDesc')}
              </InfoText>
            </InfoCard>
          </InfoGrid>
        </Section>

        <ContactInfo>
          <ContactText>{t('returns.needHelp')}</ContactText>
          <ContactText>{t('returns.contactEmail')}</ContactText>
          <ContactText>{t('returns.contactPhone')}</ContactText>
          <ContactText>{t('returns.contactHours')}</ContactText>
        </ContactInfo>
      </ContentWrapper>
    </ReturnsContainer>
  );
};

export default ReturnsPage; 