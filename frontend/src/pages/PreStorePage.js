import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { useGender } from '../context/GenderContext';

const PreStoreContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  color: white;
  margin-bottom: 1rem;
  font-family: 'Sacramento', cursive;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  font-weight: 300;
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const GenderCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const GenderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const GenderTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const GenderDescription = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const PreStorePage = () => {
  const navigate = useNavigate();
  const { setSelectedGender } = useGender();
  
  const { t } = useLanguage();
  
  const genderOptions = [
    {
      id: 'MEN',
      title: "Men's Collection",
      description: "Discover sophisticated styles for the modern gentleman",
      icon: "👔",
      color: "#3498db"
    },
    {
      id: 'WOMEN',
      title: "Women's Collection", 
      description: "Explore elegant designs for the contemporary woman",
      icon: "👗",
      color: "#e74c3c"
    },
    {
      id: 'KIDS_CLOTHING',
      title: "Kids' Collection",
      description: "Adorable and comfortable clothing for little ones",
      icon: "👶",
      color: "#f39c12"
    }
  ];

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    navigate('/store', { 
      state: { 
        selectedGender: gender,
        filters: { gender: gender }
      }
    });
  };

  return (
    <PreStoreContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Choose Your Style
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Select your preferred collection to explore our curated fashion items
        </Subtitle>

        <GenderGrid>
          {genderOptions.map((gender, index) => (
            <GenderCard
              key={gender.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenderSelect(gender.id)}
            >
              <GenderIcon>{gender.icon}</GenderIcon>
              <GenderTitle>{gender.title}</GenderTitle>
              <GenderDescription>{gender.description}</GenderDescription>
            </GenderCard>
          ))}
        </GenderGrid>
      </ContentWrapper>
    </PreStoreContainer>
  );
};

export default PreStorePage; 