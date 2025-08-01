import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const SustainabilityContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
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
  background: linear-gradient(45deg, #27ae60, #2ecc71);
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
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 3px solid #27ae60;
  padding-bottom: 10px;
`;

const InitiativeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 30px 0;
`;

const InitiativeCard = styled(motion.div)`
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
  padding: 30px;
  border-radius: 15px;
  border-left: 5px solid #27ae60;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const InitiativeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  text-align: center;
`;

const InitiativeTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
`;

const InitiativeText = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
`;

const GoalsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 30px 0;
`;

const GoalItem = styled(motion.li)`
  background: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  border-left: 4px solid #27ae60;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const GoalIcon = styled.span`
  font-size: 1.5rem;
  color: #27ae60;
`;

const GoalText = styled.span`
  color: #2c3e50;
  font-size: 1rem;
  line-height: 1.6;
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  border: 2px solid #27ae60;
  border-radius: 15px;
  padding: 30px;
  margin: 40px 0;
  text-align: center;
`;

const HighlightTitle = styled.h3`
  color: #155724;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const HighlightText = styled.p`
  color: #155724;
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
`;

const SustainabilityPage = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    document.title = t('sustainabilityPageTitle');
  }, [t]);

  const initiatives = [
    {
      icon: "🌱",
      title: t('organicMaterials'),
      description: t('organicMaterialsDesc')
    },
    {
      icon: "♻️",
      title: t('circularFashion'),
      description: t('circularFashionDesc')
    },
    {
      icon: "💧",
      title: t('waterConservation'),
      description: t('waterConservationDesc')
    },
    {
      icon: "⚡",
      title: t('renewableEnergy'),
      description: t('renewableEnergyDesc')
    },
    {
      icon: "📦",
      title: t('sustainablePackaging'),
      description: t('sustainablePackagingDesc')
    },
    {
      icon: "🤝",
      title: t('fairLabor'),
      description: t('fairLaborDesc')
    }
  ];

  const stats = [
    { number: "80%", label: t('sustainableMaterials') },
    { number: "40%", label: t('waterReduction') },
    { number: "100%", label: t('renewableEnergyLabel') },
    { number: "0%", label: t('textileWaste') }
  ];

  const goals = [
    { icon: "🎯", text: t('carbonNeutrality2030') },
    { icon: "🌿", text: t('sustainableMaterials2028') },
    { icon: "💚", text: t('zeroWasteManufacturing') },
    { icon: "🔄", text: t('globalRecyclingNetwork') },
    { icon: "📈", text: t('supplyChainEmissions') },
    { icon: "🌍", text: t('reforestationProjects') }
  ];

  return (
    <SustainabilityContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Commitment to Sustainability
        </Title>
        
        <Subtitle>
          Fashion that cares for our planet. We're dedicated to creating beautiful clothing 
          while protecting the environment for future generations.
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>Our Impact Today</SectionTitle>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Sustainability Initiatives</SectionTitle>
          <InitiativeGrid>
            {initiatives.map((initiative, index) => (
              <InitiativeCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <InitiativeIcon>{initiative.icon}</InitiativeIcon>
                <InitiativeTitle>{initiative.title}</InitiativeTitle>
                <InitiativeText>{initiative.description}</InitiativeText>
              </InitiativeCard>
            ))}
          </InitiativeGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Our 2030 Goals</SectionTitle>
          <GoalsList>
            {goals.map((goal, index) => (
              <GoalItem
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GoalIcon>{goal.icon}</GoalIcon>
                <GoalText>{goal.text}</GoalText>
              </GoalItem>
            ))}
          </GoalsList>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <HighlightBox>
            <HighlightTitle>Join Our Mission</HighlightTitle>
            <HighlightText>
              Every purchase you make supports sustainable fashion. Together, we can create a more 
              sustainable future for fashion and our planet. Thank you for choosing conscious style.
            </HighlightText>
          </HighlightBox>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Transparency & Certifications</SectionTitle>
          <InitiativeGrid>
            <InitiativeCard>
              <InitiativeIcon>📋</InitiativeIcon>
              <InitiativeTitle>Supply Chain Transparency</InitiativeTitle>
              <InitiativeText>
                We maintain complete transparency about our suppliers and manufacturing processes. 
                Annual sustainability reports detail our progress and challenges.
              </InitiativeText>
            </InitiativeCard>

            <InitiativeCard>
              <InitiativeIcon>🏆</InitiativeIcon>
              <InitiativeTitle>Global Certifications</InitiativeTitle>
              <InitiativeText>
                Certified by GOTS (Global Organic Textile Standard), OEKO-TEX, and B-Corp. 
                These certifications ensure our commitment to environmental and social responsibility.
              </InitiativeText>
            </InitiativeCard>

            <InitiativeCard>
              <InitiativeIcon>📊</InitiativeIcon>
              <InitiativeTitle>Impact Measurement</InitiativeTitle>
              <InitiativeText>
                We continuously measure and report our environmental impact, from carbon emissions 
                to water usage, ensuring accountability in our sustainability journey.
              </InitiativeText>
            </InitiativeCard>
          </InitiativeGrid>
        </Section>
      </ContentWrapper>
    </SustainabilityContainer>
  );
};

export default SustainabilityPage; 