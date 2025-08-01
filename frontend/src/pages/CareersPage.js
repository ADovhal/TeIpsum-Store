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
      title: "Innovation",
      description: "We embrace creativity and fresh ideas. Every team member is encouraged to think outside the box and contribute to our innovative culture."
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description: "We believe in the power of teamwork. Open communication and mutual support drive our success as a fashion-forward company."
    },
    {
      icon: "🌱",
      title: "Growth",
      description: "Personal and professional development is at our core. We provide opportunities for learning, advancement, and skill building."
    },
    {
      icon: "🎯",
      title: "Excellence",
      description: "We strive for quality in everything we do, from our products to our customer service and workplace culture."
    },
    {
      icon: "🌍",
      title: "Sustainability",
      description: "Environmental responsibility guides our decisions. We're committed to sustainable fashion and business practices."
    },
    {
      icon: "❤️",
      title: "Passion",
      description: "We love what we do and it shows. Our passion for fashion and customer satisfaction drives everything we create."
    }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Technology",
      type: "Full-time",
      location: "Remote",
      description: "Join our tech team to build amazing user experiences for our e-commerce platform. Work with React, TypeScript, and modern web technologies.",
      requirements: [
        "5+ years of React development experience",
        "Strong TypeScript and JavaScript skills",
        "Experience with e-commerce platforms",
        "Knowledge of responsive design and accessibility",
        "Familiarity with Redux and modern state management"
      ]
    },
    {
      id: 2,
      title: "Fashion Designer",
      department: "Design",
      type: "Full-time",
      location: "Łódź, Poland",
      description: "Create innovative and sustainable fashion designs that align with our brand vision. Lead seasonal collections and trend research.",
      requirements: [
        "Bachelor's degree in Fashion Design",
        "3+ years of fashion design experience",
        "Proficiency in design software (Illustrator, Photoshop)",
        "Understanding of sustainable fashion practices",
        "Strong portfolio demonstrating creativity and technical skills"
      ]
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      type: "Full-time",
      location: "Hybrid",
      description: "Drive our digital marketing initiatives across social media, email, and paid advertising channels. Focus on brand awareness and customer acquisition.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "2+ years of digital marketing experience",
        "Experience with Google Ads, Facebook Ads, and analytics tools",
        "Strong content creation and copywriting skills",
        "Knowledge of fashion industry trends"
      ]
    },
    {
      id: 4,
      title: "Customer Service Representative",
      department: "Customer Service",
      type: "Part-time",
      location: "Remote",
      description: "Provide exceptional customer support through various channels. Help customers with orders, returns, and product inquiries.",
      requirements: [
        "Excellent communication skills in English and Polish",
        "Previous customer service experience preferred",
        "Strong problem-solving abilities",
        "Familiarity with e-commerce platforms",
        "Flexible schedule availability"
      ]
    },
    {
      id: 5,
      title: "Supply Chain Coordinator",
      department: "Operations",
      type: "Full-time",
      location: "Łódź, Poland",
      description: "Manage supplier relationships and optimize our supply chain processes. Ensure timely delivery and quality standards.",
      requirements: [
        "Bachelor's degree in Supply Chain Management or related field",
        "2+ years of supply chain experience",
        "Strong analytical and organizational skills",
        "Experience with inventory management systems",
        "Knowledge of sustainable sourcing practices"
      ]
    }
  ];

  const benefits = [
    { icon: "💰", text: "Competitive salary and bonuses" },
    { icon: "🏥", text: "Comprehensive health insurance" },
    { icon: "🏖️", text: "25 days paid vacation" },
    { icon: "🏠", text: "Remote work flexibility" },
    { icon: "📚", text: "Learning and development budget" },
    { icon: "👕", text: "Employee clothing discount" },
    { icon: "☕", text: "Free coffee and snacks" },
    { icon: "🎉", text: "Team events and celebrations" }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = departmentFilter === 'all' || job.department.toLowerCase() === departmentFilter;
    const matchesType = typeFilter === 'all' || job.type.toLowerCase() === typeFilter;
    return matchesDepartment && matchesType;
  });

  const handleApply = (jobTitle) => {
    // In a real application, this would redirect to an application form or email
    alert(`Thank you for your interest in the ${jobTitle} position! Please send your resume to careers@teipsum.com`);
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
            Build your career with TeIpsum and help shape the future of sustainable fashion. 
            We're looking for passionate individuals who share our values and vision.
          </Subtitle>
        </HeroSection>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>Our Values</SectionTitle>
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
          <SectionTitle>Benefits & Perks</SectionTitle>
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
          <SectionTitle>Open Positions</SectionTitle>
          
          <JobFilters>
            <FilterSelect
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="customer service">Customer Service</option>
              <option value="operations">Operations</option>
            </FilterSelect>

            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
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
                
                <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Requirements:</h4>
                <JobRequirements>
                  {job.requirements.map((req, reqIndex) => (
                    <JobRequirement key={reqIndex}>{req}</JobRequirement>
                  ))}
                </JobRequirements>
                
                <ApplyButton onClick={() => handleApply(job.title)}>
                  Apply Now
                </ApplyButton>
              </JobCard>
            ))}
          </JobsSection>

          {filteredJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
              <h3>No positions found</h3>
              <p>Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          )}
        </Section>
      </ContentWrapper>
    </CareersContainer>
  );
};

export default CareersPage; 