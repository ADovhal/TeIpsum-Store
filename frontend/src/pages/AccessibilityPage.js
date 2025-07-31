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
    padding: 40px 30px;
  }
`;

const Title = styled(motion.h1)`
  color: #2c3e50;
  font-size: 3rem;
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
  padding-left: 25px;
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
    document.title = `${t('accessibility')} - TeIpsum`;
  }, [t]);

  const accessibilityFeatures = [
    {
      icon: "♿",
      title: "Screen Reader Support",
      description: "Our website is fully compatible with screen readers like JAWS, NVDA, and VoiceOver. All images include descriptive alt text, and navigation is optimized for assistive technologies."
    },
    {
      icon: "🎯",
      title: "Keyboard Navigation",
      description: "Navigate our entire website using only your keyboard. All interactive elements are accessible via Tab, Enter, and arrow keys with clear focus indicators."
    },
    {
      icon: "🔍",
      title: "Text Scaling",
      description: "Zoom text up to 200% without horizontal scrolling or loss of functionality. Our responsive design adapts to different text sizes and browser zoom levels."
    },
    {
      icon: "🎨",
      title: "High Contrast Mode",
      description: "Enhanced color contrast ratios meet WCAG AA standards. Important information is never conveyed through color alone, and we support high contrast display modes."
    },
    {
      icon: "⏱️",
      title: "No Time Limits",
      description: "Take your time browsing and shopping. We don't impose time limits on forms or sessions, and any automatic content updates can be paused or controlled."
    },
    {
      icon: "🚫",
      title: "Seizure Safe",
      description: "Our content avoids flashing elements and rapid animations that could trigger seizures. Motion can be reduced through browser settings and our design preferences."
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
          TeIpsum is committed to ensuring digital accessibility for all users, regardless of ability. 
          We continually improve the user experience for everyone.
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>Our Commitment</SectionTitle>
          <Text>
            We believe that everyone should have equal access to fashion and online shopping. TeIpsum is 
            dedicated to providing an inclusive, accessible, and user-friendly experience for all visitors, 
            including those who rely on assistive technologies.
          </Text>
          <Text>
            Our accessibility efforts are guided by the Web Content Accessibility Guidelines (WCAG) 2.1 
            Level AA standards, ensuring our website meets international accessibility requirements.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Accessibility Features</SectionTitle>
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
          <SectionTitle>What We've Implemented</SectionTitle>
          <List>
            <ListItem><strong>Semantic HTML:</strong> Proper heading structure and landmark regions for easy navigation</ListItem>
            <ListItem><strong>Alt Text:</strong> Descriptive alternative text for all images and graphics</ListItem>
            <ListItem><strong>Form Labels:</strong> Clear, descriptive labels for all form inputs</ListItem>
            <ListItem><strong>Color Contrast:</strong> High contrast ratios for text and background colors</ListItem>
            <ListItem><strong>Focus Management:</strong> Visible focus indicators and logical tab order</ListItem>
            <ListItem><strong>ARIA Labels:</strong> Additional context for complex interactive elements</ListItem>
            <ListItem><strong>Responsive Design:</strong> Mobile-friendly layout that works with assistive technologies</ListItem>
            <ListItem><strong>Error Handling:</strong> Clear, descriptive error messages and validation feedback</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Assistive Technology Support</SectionTitle>
          <Text>
            Our website has been tested with various assistive technologies and browsers:
          </Text>
          <List>
            <ListItem><strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver, TalkBack</ListItem>
            <ListItem><strong>Voice Control:</strong> Dragon NaturallySpeaking, Voice Control</ListItem>
            <ListItem><strong>Switch Navigation:</strong> Switch Access, external switch devices</ListItem>
            <ListItem><strong>Magnification:</strong> ZoomText, browser zoom, OS magnification tools</ListItem>
          </List>
        </Section>

        <StandardsBox>
          <StandardsTitle>🏆 Compliance Standards</StandardsTitle>
          <StandardsText>
            TeIpsum strives to conform to WCAG 2.1 Level AA guidelines, Section 508 of the Rehabilitation Act, 
            and the Americans with Disabilities Act (ADA). We regularly audit our website to ensure continued 
            compliance and optimal accessibility.
          </StandardsText>
        </StandardsBox>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Ongoing Improvements</SectionTitle>
          <Text>
            Accessibility is an ongoing effort. We regularly:
          </Text>
          <List>
            <ListItem>Conduct accessibility audits and user testing</ListItem>
            <ListItem>Train our team on accessibility best practices</ListItem>
            <ListItem>Update our website based on user feedback and new standards</ListItem>
            <ListItem>Test new features with assistive technologies before release</ListItem>
            <ListItem>Collaborate with accessibility experts and the disability community</ListItem>
          </List>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SectionTitle>Browser and Device Recommendations</SectionTitle>
          <Text>
            For the best accessible experience, we recommend:
          </Text>
          <List>
            <ListItem>Using the latest version of your preferred browser</ListItem>
            <ListItem>Keeping your operating system and assistive technologies updated</ListItem>
            <ListItem>Enabling JavaScript for full functionality</ListItem>
            <ListItem>Using browsers that support modern web standards (Chrome, Firefox, Safari, Edge)</ListItem>
          </List>
        </Section>

        <ContactBox>
          <ContactTitle>Accessibility Feedback</ContactTitle>
          <ContactText>
            We welcome your feedback on the accessibility of TeIpsum. If you encounter any barriers or 
            have suggestions for improvement, please let us know:
          </ContactText>
          <ContactText>📧 accessibility@teipsum.com</ContactText>
          <ContactText>📞 +48 123 456 789 (Voice/TTY available)</ContactText>
          <ContactText>📍 TeIpsum Accessibility Team, ul. Fashion 123, 90-001 Łódź, Poland</ContactText>
          <ContactText style={{ marginTop: '20px', fontWeight: '600' }}>
            We aim to respond to accessibility feedback within 3 business days.
          </ContactText>
        </ContactBox>
      </ContentWrapper>
    </AccessibilityContainer>
  );
};

export default AccessibilityPage; 