import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const SizeGuideContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button`
  padding: 12px 25px;
  border: 2px solid ${props => props.active ? '#3498db' : '#ecf0f1'};
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3498db;
    background: ${props => props.active ? '#2980b9' : '#f8f9fa'};
  }
`;

const Section = styled(motion.section)`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
`;

const MeasurementGuide = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const MeasurementCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 30px;
  border-radius: 15px;
  border-left: 5px solid #3498db;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const MeasurementTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MeasurementText = styled.p`
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SizeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 30px 0;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const TableHeader = styled.th`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  padding: 15px 10px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.8rem;
  }
`;

const TableCell = styled.td`
  padding: 12px 10px;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
  text-align: center;
  font-size: 0.9rem;

  &:first-child {
    font-weight: 600;
    background: #f8f9fa;
  }

  @media (max-width: 768px) {
    padding: 10px 8px;
    font-size: 0.8rem;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const InfoBox = styled.div`
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  border: 2px solid #27ae60;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
`;

const InfoTitle = styled.h4`
  color: #155724;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const InfoText = styled.p`
  color: #155724;
  font-size: 1rem;
  margin-bottom: 10px;
  line-height: 1.6;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TipsList = styled.ul`
  color: #155724;
  margin: 15px 0;
  padding-left: 20px;
`;

const TipItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.6;
`;

const SizeGuidePage = () => {
  const [activeCategory, setActiveCategory] = useState('womens');
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Size Guide - TeIpsum";
  }, []);

  const categories = [
    { id: 'womens', label: 'Women' },
    { id: 'mens', label: 'Men' },
    { id: 'kids', label: 'Kids' }
  ];

  const sizeTables = {
    womens: {
      clothing: [
        { size: 'XS', chest: '32', waist: '24', hips: '34', us: '0-2', eu: '32-34' },
        { size: 'S', chest: '34', waist: '26', hips: '36', us: '4-6', eu: '36-38' },
        { size: 'M', chest: '36', waist: '28', hips: '38', us: '8-10', eu: '40-42' },
        { size: 'L', chest: '38', waist: '30', hips: '40', us: '12-14', eu: '44-46' },
        { size: 'XL', chest: '40', waist: '32', hips: '42', us: '16-18', eu: '48-50' },
        { size: 'XXL', chest: '42', waist: '34', hips: '44', us: '20-22', eu: '52-54' }
      ],
      shoes: [
        { us: '5', eu: '35', uk: '2.5', cm: '22' },
        { us: '6', eu: '36', uk: '3.5', cm: '22.5' },
        { us: '7', eu: '37', uk: '4.5', cm: '23.5' },
        { us: '8', eu: '38', uk: '5.5', cm: '24' },
        { us: '9', eu: '39', uk: '6.5', cm: '25' },
        { us: '10', eu: '40', uk: '7.5', cm: '25.5' },
        { us: '11', eu: '41', uk: '8.5', cm: '26.5' }
      ]
    },
    mens: {
      clothing: [
        { size: 'XS', chest: '34', waist: '28', us: 'XS', eu: '44' },
        { size: 'S', chest: '36', waist: '30', us: 'S', eu: '46' },
        { size: 'M', chest: '38', waist: '32', us: 'M', eu: '48' },
        { size: 'L', chest: '40', waist: '34', us: 'L', eu: '50' },
        { size: 'XL', chest: '42', waist: '36', us: 'XL', eu: '52' },
        { size: 'XXL', chest: '44', waist: '38', us: 'XXL', eu: '54' }
      ],
      shoes: [
        { us: '7', eu: '40', uk: '6', cm: '25' },
        { us: '8', eu: '41', uk: '7', cm: '26' },
        { us: '9', eu: '42', uk: '8', cm: '27' },
        { us: '10', eu: '43', uk: '9', cm: '28' },
        { us: '11', eu: '44', uk: '10', cm: '29' },
        { us: '12', eu: '45', uk: '11', cm: '30' },
        { us: '13', eu: '46', uk: '12', cm: '31' }
      ]
    },
    kids: {
      clothing: [
        { age: '2-3', height: '98', chest: '20', waist: '19' },
        { age: '3-4', height: '104', chest: '21', waist: '19.5' },
        { age: '4-5', height: '110', chest: '22', waist: '20' },
        { age: '5-6', height: '116', chest: '23', waist: '20.5' },
        { age: '6-7', height: '122', chest: '24', waist: '21' },
        { age: '7-8', height: '128', chest: '25', waist: '21.5' },
        { age: '8-9', height: '134', chest: '26', waist: '22' }
      ]
    }
  };

  return (
    <SizeGuideContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Size Guide
        </Title>
        
        <Subtitle>
          Find your perfect fit with our comprehensive size guide. Still unsure? Contact us for personalized assistance.
        </Subtitle>

        <CategoryTabs>
          {categories.map(category => (
            <CategoryTab
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>How to Measure</SectionTitle>
          <MeasurementGuide>
            <MeasurementCard>
              <MeasurementTitle>📏 Chest/Bust</MeasurementTitle>
              <MeasurementText>
                Measure around the fullest part of your chest/bust, keeping the tape measure level and snug but not tight.
              </MeasurementText>
              <MeasurementText>
                <strong>Tip:</strong> Wear a well-fitting bra when measuring for the most accurate result.
              </MeasurementText>
            </MeasurementCard>

            <MeasurementCard>
              <MeasurementTitle>📐 Waist</MeasurementTitle>
              <MeasurementText>
                Measure around your natural waistline, which is typically the narrowest part of your torso.
              </MeasurementText>
              <MeasurementText>
                <strong>Tip:</strong> Don't hold your breath! Breathe normally for an accurate measurement.
              </MeasurementText>
            </MeasurementCard>

            {activeCategory === 'womens' && (
              <MeasurementCard>
                <MeasurementTitle>📏 Hips</MeasurementTitle>
                <MeasurementText>
                  Measure around the fullest part of your hips, typically about 8 inches below your waist.
                </MeasurementText>
                <MeasurementText>
                  <strong>Tip:</strong> Stand with feet together for the most accurate measurement.
                </MeasurementText>
              </MeasurementCard>
            )}

            <MeasurementCard>
              <MeasurementTitle>👤 Height</MeasurementTitle>
              <MeasurementText>
                Stand straight against a wall and measure from the top of your head to the floor.
              </MeasurementText>
              <MeasurementText>
                <strong>Tip:</strong> Remove shoes and have someone help you for best accuracy.
              </MeasurementText>
            </MeasurementCard>
          </MeasurementGuide>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>
            {activeCategory === 'womens' ? 'Women\'s' : 
             activeCategory === 'mens' ? 'Men\'s' : 'Kids\''}
            {' '}Clothing Sizes
          </SectionTitle>
          
          <SizeTable>
            <thead>
              <tr>
                {activeCategory === 'kids' ? (
                  <>
                    <TableHeader>Age</TableHeader>
                    <TableHeader>Height (cm)</TableHeader>
                    <TableHeader>Chest (in)</TableHeader>
                    <TableHeader>Waist (in)</TableHeader>
                  </>
                ) : (
                  <>
                    <TableHeader>{t('size')}</TableHeader>
                    <TableHeader>Chest (in)</TableHeader>
                    <TableHeader>Waist (in)</TableHeader>
                    {activeCategory === 'womens' && <TableHeader>Hips (in)</TableHeader>}
                    <TableHeader>US Size</TableHeader>
                    <TableHeader>EU Size</TableHeader>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sizeTables[activeCategory].clothing.map((row, index) => (
                <TableRow key={index}>
                  {activeCategory === 'kids' ? (
                    <>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>{row.height}</TableCell>
                      <TableCell>{row.chest}</TableCell>
                      <TableCell>{row.waist}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.size}</TableCell>
                      <TableCell>{row.chest}</TableCell>
                      <TableCell>{row.waist}</TableCell>
                      {activeCategory === 'womens' && <TableCell>{row.hips}</TableCell>}
                      <TableCell>{row.us}</TableCell>
                      <TableCell>{row.eu}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </tbody>
          </SizeTable>
        </Section>

        {activeCategory !== 'kids' && (
          <Section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <SectionTitle>Shoe Sizes</SectionTitle>
            
            <SizeTable>
              <thead>
                <tr>
                  <TableHeader>US</TableHeader>
                  <TableHeader>EU</TableHeader>
                  <TableHeader>UK</TableHeader>
                  <TableHeader>Length (cm)</TableHeader>
                </tr>
              </thead>
              <tbody>
                {sizeTables[activeCategory].shoes.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.us}</TableCell>
                    <TableCell>{row.eu}</TableCell>
                    <TableCell>{row.uk}</TableCell>
                    <TableCell>{row.cm}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </SizeTable>
          </Section>
        )}

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <InfoBox>
            <InfoTitle>💡 Fitting Tips</InfoTitle>
            <TipsList>
              <TipItem>If you're between sizes, we generally recommend sizing up for comfort</TipItem>
              <TipItem>Check individual product pages for specific fit notes</TipItem>
              <TipItem>Read customer reviews for real-world fit insights</TipItem>
              <TipItem>Consider the fabric type - some materials have more stretch than others</TipItem>
              <TipItem>When in doubt, contact our customer service for personalized recommendations</TipItem>
            </TipsList>
            
            <InfoText style={{ marginTop: '20px' }}>
              <strong>Still not sure?</strong> We offer free exchanges on all domestic orders, 
              so you can find your perfect fit risk-free!
            </InfoText>
          </InfoBox>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <InfoBox style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', border: '2px solid #2196f3' }}>
            <InfoTitle style={{ color: '#0d47a1' }}>📞 Need Personal Sizing Help?</InfoTitle>
            <InfoText style={{ color: '#1565c0' }}>
              Our customer service team is trained to help you find the perfect fit. 
              Contact us with your measurements and we'll recommend the best size for you.
            </InfoText>
            <InfoText style={{ color: '#1565c0' }}>
              📧 sizing@teipsum.com | 📞 +48 123 456 789
            </InfoText>
            <InfoText style={{ color: '#1565c0' }}>
              🕒 Monday - Friday: 9 AM - 6 PM CET
            </InfoText>
          </InfoBox>
        </Section>
      </ContentWrapper>
    </SizeGuideContainer>
  );
};

export default SizeGuidePage; 