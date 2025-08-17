import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const FAQContainer = styled.div`
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

const Subtitle = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 50px;
  line-height: 1.6;
`;

const SearchBox = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 15px 20px;
  border: 2px solid #ecf0f1;
  border-radius: 50px;
  font-size: 1rem;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 5px 25px rgba(52, 152, 219, 0.2);
  }

  &::placeholder {
    color: #bdc3c7;
  }
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

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FAQItem = styled(motion.div)`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 2px solid ${props => props.isOpen ? '#3498db' : '#ecf0f1'};
  transition: border-color 0.3s ease;
`;

const QuestionButton = styled.button`
  width: 100%;
  padding: 25px 30px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;

  &:hover {
    background: #f8f9fa;
  }
`;

const QuestionText = styled.span`
  flex: 1;
  margin-right: 20px;
`;

const ToggleIcon = styled(motion.span)`
  font-size: 1.2rem;
  color: #3498db;
  font-weight: bold;
`;

const AnswerContainer = styled(motion.div)`
  overflow: hidden;
`;

const Answer = styled.div`
  padding: 0 30px 25px;
  color: #5a6c7d;
  line-height: 1.6;
  font-size: 1rem;

  p {
    margin-bottom: 15px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    margin: 15px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;

const ContactSection = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px solid #2196f3;
  border-radius: 15px;
  padding: 30px;
  margin-top: 50px;
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

const FAQPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    document.title = t('faqPageTitle');
  }, [t]);

  const categories = [
    { id: 'all', label: t('allQuestions') },
    { id: 'ordering', label: t('ordering') },
    { id: 'shipping', label: t('shipping') },
    { id: 'returns', label: t('returnsFAQ') },
    { id: 'sizing', label: t('sizing') },
    { id: 'care', label: t('productCare') },
    { id: 'account', label: t('account') }
  ];

  const faqData = [
    {
      id: 1,
      category: 'ordering',
      question: t('howToPlaceOrder'),
      answer: t('howToPlaceOrderAnswer')
    },
    {
      id: 2,
      category: 'ordering',
      question: t('canModifyOrder'),
      answer: t('canModifyOrderAnswer')
    },
    {
      id: 3,
      category: 'shipping',
      question: t('shippingTime'),
      answer: t('shippingTimeAnswer')
    },
    {
      id: 4,
      category: 'shipping',
      question: t('internationalShipping'),
      answer: t('internationalShippingAnswer') + `
      <p><strong>${t('importantNotesInternational')}</strong></p>
      <ul>
        <li>${t('customersResponsibleDuties')}</li>
        <li>${t('deliveryTimesVary')}</li>
        <li>${t('someRestrictions')}</li>
      </ul>`
    },
    {
      id: 5,
      category: 'returns',
      question: t('returnPolicyQuestion'),
      answer: t('returnPolicyAnswer')
    },
    {
      id: 6,
      category: 'returns',
      question: t('howToReturnQuestion'),
      answer: t('howToReturnAnswer')
    },
    {
      id: 7,
      category: 'sizing',
      question: t('howToFindSizeQuestion'),
      answer: t('howToFindSizeAnswer')
    },
    {
      id: 8,
      category: 'sizing',
      question: t('orderDoesntFitQuestion'),
      answer: t('orderDoesntFitAnswer')
    },
    {
      id: 9,
      category: 'care',
      question: t('careClotheQuestion'),
      answer: t('careClotheAnswer')
    },
    {
      id: 10,
      category: 'account',
      question: t('needAccountQuestion'),
      answer: t('needAccountAnswer')
    },
    {
      id: 11,
      category: 'account',
      question: t('resetPasswordQuestion'),
      answer: t('resetPasswordAnswer')
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <FAQContainer>
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('faqTitle')}
        </Title>
        
        <Subtitle>
          {t('faqSubtitle')}
        </Subtitle>

        <SearchBox>
          <SearchInput
                          type="text"
              placeholder={t('searchForAnswers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

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

        <FAQList>
          <AnimatePresence>
            {filteredFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                isOpen={openItems.has(faq.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuestionButton onClick={() => toggleItem(faq.id)}>
                  <QuestionText>{faq.question}</QuestionText>
                  <ToggleIcon
                    animate={{ rotate: openItems.has(faq.id) ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    +
                  </ToggleIcon>
                </QuestionButton>
                
                <AnimatePresence>
                  {openItems.has(faq.id) && (
                    <AnswerContainer
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Answer dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AnswerContainer>
                  )}
                </AnimatePresence>
              </FAQItem>
            ))}
          </AnimatePresence>
        </FAQList>

        {filteredFAQs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
            <p>{t('noQuestionsFound')}</p>
          </div>
        )}

        <ContactSection>
          <ContactTitle>{t('stillNeedHelp')}</ContactTitle>
          <ContactText>
            {t('customerServiceHelp')}
          </ContactText>
          <ContactText>{t('contactInfo')}</ContactText>
          <ContactText>{t('workingHours')}</ContactText>
        </ContactSection>
      </ContentWrapper>
    </FAQContainer>
  );
};

export default FAQPage; 