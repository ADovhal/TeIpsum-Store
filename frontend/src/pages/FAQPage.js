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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    document.title = "FAQ - TeIpsum";
  }, []);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'ordering', label: 'Ordering' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
    { id: 'sizing', label: 'Sizing' },
    { id: 'care', label: 'Product Care' },
    { id: 'account', label: 'Account' }
  ];

  const faqData = [
    {
      id: 1,
      category: 'ordering',
      question: 'How do I place an order?',
      answer: `<p>Placing an order is easy! Follow these simple steps:</p>
      <ul>
        <li>Browse our collections and add items to your cart</li>
        <li>Click the cart icon to review your items</li>
        <li>Proceed to checkout and enter your shipping information</li>
        <li>Choose your payment method and complete your purchase</li>
      </ul>
      <p>You'll receive an order confirmation email with tracking information once your order ships.</p>`
    },
    {
      id: 2,
      category: 'ordering',
      question: 'Can I modify or cancel my order?',
      answer: `<p>We process orders quickly to get them to you as soon as possible. Here's what you need to know:</p>
      <p><strong>Modifications:</strong> Contact us within 1 hour of placing your order at orders@teipsum.com</p>
      <p><strong>Cancellations:</strong> Orders can be cancelled within 2 hours if they haven't been processed yet.</p>
      <p>Once an order has shipped, you can use our return process if needed.</p>`
    },
    {
      id: 3,
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: `<p>Shipping times depend on your location and chosen method:</p>
      <ul>
        <li><strong>Standard Shipping:</strong> 3-5 business days (FREE on orders over $75)</li>
        <li><strong>Express Shipping:</strong> 1-2 business days ($15.99)</li>
        <li><strong>International:</strong> 7-14 business days (varies by destination)</li>
      </ul>
      <p>All orders are processed within 1-2 business days before shipping.</p>`
    },
    {
      id: 4,
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: `<p>Yes! We ship to most countries worldwide. International shipping costs start at $25.99 and vary by destination.</p>
      <p><strong>Important notes for international orders:</strong></p>
      <ul>
        <li>Customers are responsible for any customs duties or taxes</li>
        <li>Delivery times may vary due to customs processing</li>
        <li>Some restrictions may apply to certain countries</li>
      </ul>`
    },
    {
      id: 5,
      category: 'returns',
      question: 'What is your return policy?',
      answer: `<p>We offer a generous 30-day return policy:</p>
      <ul>
        <li>Items must be unworn, unwashed, and in original condition</li>
        <li>All original tags must be attached</li>
        <li>Returns are free for domestic orders</li>
        <li>Refunds are processed within 5-7 business days</li>
      </ul>
      <p>Some items like underwear and earrings cannot be returned for hygiene reasons.</p>`
    },
    {
      id: 6,
      category: 'returns',
      question: 'How do I return an item?',
      answer: `<p>Returning items is simple:</p>
      <ul>
        <li>Email returns@teipsum.com with your order number</li>
        <li>We'll send you a prepaid return label within 24 hours</li>
        <li>Package your items and attach the return label</li>
        <li>Drop off at any post office</li>
      </ul>
      <p>You'll receive an email confirmation once we receive and process your return.</p>`
    },
    {
      id: 7,
      category: 'sizing',
      question: 'How do I find my size?',
      answer: `<p>Getting the right fit is important to us:</p>
      <ul>
        <li>Check our detailed size guide on each product page</li>
        <li>Measure yourself using our sizing instructions</li>
        <li>Read customer reviews for fit insights</li>
        <li>Contact our customer service for personalized sizing help</li>
      </ul>
      <p>If you're between sizes, we generally recommend sizing up for a more comfortable fit.</p>`
    },
    {
      id: 8,
      category: 'sizing',
      question: 'What if my order doesn\'t fit?',
      answer: `<p>No worries! We offer free exchanges for size issues:</p>
      <ul>
        <li>Size exchanges are processed within 3-5 business days</li>
        <li>We'll send the new size as soon as we receive your return</li>
        <li>Exchange shipping is free within Poland</li>
      </ul>
      <p>For faster service, you can order the correct size and return the wrong size separately.</p>`
    },
    {
      id: 9,
      category: 'care',
      question: 'How should I care for my TeIpsum clothes?',
      answer: `<p>Proper care will help your TeIpsum pieces last longer:</p>
      <ul>
        <li>Always check the care label on each garment</li>
        <li>Wash in cold water when possible</li>
        <li>Use gentle detergents and avoid bleach</li>
        <li>Air dry or use low heat settings</li>
        <li>Store hanging or folded properly</li>
      </ul>
      <p>For specific care instructions, refer to the product page or contact our customer service.</p>`
    },
    {
      id: 10,
      category: 'account',
      question: 'Do I need an account to shop?',
      answer: `<p>You can shop as a guest, but creating an account has benefits:</p>
      <ul>
        <li>Faster checkout for future orders</li>
        <li>Order history and tracking</li>
        <li>Exclusive member discounts</li>
        <li>Early access to new collections</li>
        <li>Personalized recommendations</li>
      </ul>
      <p>Creating an account is free and takes just a minute!</p>`
    },
    {
      id: 11,
      category: 'account',
      question: 'How do I reset my password?',
      answer: `<p>To reset your password:</p>
      <ul>
        <li>Go to the login page and click "Forgot Password"</li>
        <li>Enter your email address</li>
        <li>Check your email for reset instructions</li>
        <li>Follow the link to create a new password</li>
      </ul>
      <p>If you don't receive the email, check your spam folder or contact support.</p>`
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
          Frequently Asked Questions
        </Title>
        
        <Subtitle>
          Find answers to common questions about TeIpsum. Can't find what you're looking for? Contact us!
        </Subtitle>

        <SearchBox>
          <SearchInput
            type="text"
            placeholder="Search for answers..."
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
            <p>No questions found matching your search. Try different keywords or browse all categories.</p>
          </div>
        )}

        <ContactSection>
          <ContactTitle>Still Need Help?</ContactTitle>
          <ContactText>
            Our customer service team is here to help with any questions not covered here.
          </ContactText>
          <ContactText>📧 support@teipsum.com | 📞 +48 123 456 789</ContactText>
          <ContactText>🕒 Monday - Friday: 9 AM - 6 PM CET</ContactText>
        </ContactSection>
      </ContentWrapper>
    </FAQContainer>
  );
};

export default FAQPage; 