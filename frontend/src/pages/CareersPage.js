import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const CareersContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`;

const Title = styled(motion.h1)`
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled(motion.section)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 15px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  border-bottom: 3px solid #e74c3c;
  padding-bottom: 10px;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 30px 0;
`;

const ValueCard = styled(motion.div)`
  background: linear-gradient(135deg, #fdf2f2 0%, #fce4ec 100%);
  padding: 30px;
  border-radius: 15px;
  border-left: 5px solid #e74c3c;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ValueIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const ValueTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const ValueText = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin: 0;
`;

const JobsSection = styled.div`
  margin-top: 40px;
`;

const JobFilters = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 1rem;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const JobCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #e74c3c;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const JobTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
`;

const JobMeta = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const JobTag = styled.span`
  background: ${props => props.type === 'department' ? '#e8f5e8' : 
                        props.type === 'type' ? '#e3f2fd' : '#fff3cd'};
  color: ${props => props.type === 'department' ? '#27ae60' : 
                   props.type === 'type' ? '#1976d2' : '#f39c12'};
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const JobDescription = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const JobRequirements = styled.ul`
  color: #5a6c7d;
  margin: 15px 0;
  padding-left: 20px;
`;

const JobRequirement = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const ApplyButton = styled.button`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
`;

const BenefitIcon = styled.span`
  font-size: 1.5rem;
  color: #e74c3c;
`;

const BenefitText = styled.span`
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 500;
`;

const CareersPage = () => {
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t('careers')} - TeIpsum`;
  }, [t]);

  const companyValues = [
    {
      icon: "💡",
      title: t('careers.innovation'),
      description: t('careers.innovationDesc')
    },
    {
      icon: "🤝",
      title: t('careers.collaboration'),
      description: t('careers.collaborationDesc')
    },
    {
      icon: "🌱",
      title: t('careers.growth'),
      description: t('careers.growthDesc')
    },
    {
      icon: "🎯",
      title: t('careers.excellence'),
      description: t('careers.excellenceDesc')
    },
    {
      icon: "🌍",
      title: t('careers.sustainabilityValue'),
      description: t('careers.sustainabilityValueDesc')
    },
    {
      icon: "❤️",
      title: t('careers.passion'),
      description: t('careers.passionDesc')
    }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: t('careers.seniorFrontendDev'),
      department: t('careers.technology'),
      type: t('careers.fullTime'),
      location: t('careers.remote'),
      description: t('careers.frontendDevDesc'),
      requirements: [
        t('careers.req1'),
        t('careers.req2'),
        t('careers.req3'),
        t('careers.req4'),
        t('careers.req5')
      ]
    },
    {
      id: 2,
      title: t('careers.fashionDesigner'),
      department: t('careers.design'),
      type: t('careers.fullTime'),
      location: "Łódź, Poland",
      description: t('careers.fashionDesignerDesc'),
      requirements: [
        t('careers.req6'),
        t('careers.req7'),
        t('careers.req8'),
        t('careers.req9'),
        t('careers.req10')
      ]
    },
    {
      id: 3,
      title: t('careers.digitalMarketing'),
      department: t('careers.marketing'),
      type: t('careers.fullTime'),
      location: t('careers.hybrid'),
      description: t('careers.digitalMarketingDesc'),
      requirements: [
        t('careers.req11'),
        t('careers.req12'),
        t('careers.req13'),
        t('careers.req14'),
        t('careers.req15')
      ]
    },
    {
      id: 4,
      title: t('careers.customerServiceRep'),
      department: t('careers.customerServiceDept'),
      type: t('careers.partTime'),
      location: t('careers.remote'),
      description: t('careers.customerServiceDesc'),
      requirements: [
        t('careers.req16'),
        t('careers.req17'),
        t('careers.req18'),
        t('careers.req19'),
        t('careers.req20')
      ]
    },
    {
      id: 5,
      title: t('careers.supplyChainCoord'),
      department: t('careers.operations'),
      type: t('careers.fullTime'),
      location: "Łódź, Poland",
      description: t('careers.supplyChainDesc'),
      requirements: [
        t('careers.req21'),
        t('careers.req22'),
        t('careers.req24'),
        t('careers.req22'),
        t('careers.req23')
      ]
    }
  ];

  const benefits = [
    { icon: "💰", text: t('careers.competitiveSalary') },
    { icon: "🏥", text: t('careers.healthInsurance') },
    { icon: "🏖️", text: t('careers.paidTimeOff') },
    { icon: "🏠", text: t('careers.workFromHome') },
    { icon: "📚", text: t('careers.learningBudget') },
    { icon: "👕", text: t('careers.employeeDiscount') },
    { icon: "☕", text: t('careers.freeSnacks') },
    { icon: "🎉", text: t('careers.teamEvents') }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = departmentFilter === 'all' || job.department.toLowerCase() === departmentFilter;
    const matchesType = typeFilter === 'all' || job.type.toLowerCase() === typeFilter;
    return matchesDepartment && matchesType;
  });

  const handleApply = (jobTitle) => {
    // In a real application, this would redirect to an application form or email
    alert(`${t('careers.applyThankYou')} ${jobTitle} ${t('careers.applyInstructions')}`);
  };

  return (
    <CareersContainer>
      <ContentWrapper>
        <HeroSection>
          <Title
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('careersTitle')}
          </Title>
          <Subtitle>
            {t('careers.subtitle')}
          </Subtitle>
        </HeroSection>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('careers.ourValues')}</SectionTitle>
          <ValuesGrid>
            {companyValues.map((value, index) => (
              <ValueCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ValueIcon>{value.icon}</ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueText>{value.description}</ValueText>
              </ValueCard>
            ))}
          </ValuesGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('careers.benefits')}</SectionTitle>
          <BenefitsGrid>
            {benefits.map((benefit, index) => (
              <BenefitItem key={index}>
                <BenefitIcon>{benefit.icon}</BenefitIcon>
                <BenefitText>{benefit.text}</BenefitText>
              </BenefitItem>
            ))}
          </BenefitsGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>{t('careers.openPositions')}</SectionTitle>
          
          <JobFilters>
            <FilterSelect
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">{t('careers.allDepartments')}</option>
              <option value="technology">{t('careers.technology')}</option>
              <option value="design">{t('careers.design')}</option>
              <option value="marketing">{t('careers.marketing')}</option>
              <option value="customer service">{t('careers.customerServiceDept')}</option>
              <option value="operations">{t('careers.operations')}</option>
            </FilterSelect>

            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">{t('careers.allTypes')}</option>
              <option value="full-time">{t('careers.fullTime')}</option>
              <option value="part-time">{t('careers.partTime')}</option>
              <option value="contract">{t('careers.contract')}</option>
              <option value="internship">{t('careers.internship')}</option>
            </FilterSelect>
          </JobFilters>

          <JobsSection>
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <JobHeader>
                  <div>
                    <JobTitle>{job.title}</JobTitle>
                    <JobMeta>
                      <JobTag type="department">{job.department}</JobTag>
                      <JobTag type="type">{job.type}</JobTag>
                      <JobTag type="location">📍 {job.location}</JobTag>
                    </JobMeta>
                  </div>
                </JobHeader>
                
                <JobDescription>{job.description}</JobDescription>
                
                <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>{t('careers.requirements')}:</h4>
                <JobRequirements>
                  {job.requirements.map((req, reqIndex) => (
                    <JobRequirement key={reqIndex}>{req}</JobRequirement>
                  ))}
                </JobRequirements>
                
                <ApplyButton onClick={() => handleApply(job.title)}>
                  {t('careers.applyNow')}
                </ApplyButton>
              </JobCard>
            ))}
          </JobsSection>

          {filteredJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
              <h3>{t('careers.noPositionsFound')}</h3>
              <p>{t('careers.tryAdjustingFiltersCareers')}</p>
            </div>
          )}
        </Section>
      </ContentWrapper>
    </CareersContainer>
  );
};

export default CareersPage; 