import React, { useEffect } from 'react';
import styled from 'styled-components';
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

const CookieTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
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

const CookiePolicyPage = () => {
  useEffect(() => {
    document.title = "Cookie Policy - TeIpsum";
  }, []);

  const cookieTypes = [
    {
      type: "Essential Cookies",
      purpose: "Required for basic website functionality",
      duration: "Session/Persistent",
      examples: "Authentication, shopping cart, security"
    },
    {
      type: "Analytics Cookies",
      purpose: "Help us understand how visitors use our website",
      duration: "1-2 years",
      examples: "Google Analytics, page views, user behavior"
    },
    {
      type: "Marketing Cookies",
      purpose: "Used to deliver relevant advertisements",
      duration: "30 days - 2 years",
      examples: "Facebook Pixel, Google Ads, retargeting"
    },
    {
      type: "Preference Cookies",
      purpose: "Remember your settings and preferences",
      duration: "1 year",
      examples: "Language, currency, region settings"
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
          Cookie Policy
        </Title>
        
        <Subtitle>
          Learn about how TeIpsum uses cookies and similar technologies to enhance your browsing experience.
        </Subtitle>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>What Are Cookies?</SectionTitle>
          <Text>
            Cookies are small text files that are stored on your device when you visit a website. They help 
            websites remember information about your visit, making your next visit easier and the site more 
            useful to you.
          </Text>
          <Text>
            Cookies cannot access, read, or modify any other data on your computer and cannot carry viruses 
            or install malware on your device.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SectionTitle>How We Use Cookies</SectionTitle>
          <Text>
            TeIpsum uses cookies to provide, protect, and improve our services. We use cookies for several purposes:
          </Text>
          <Text>
            • <strong>Essential Operations:</strong> Enable core website functionality<br/>
            • <strong>Performance:</strong> Analyze how our website is used and improve performance<br/>
            • <strong>Personalization:</strong> Remember your preferences and customize your experience<br/>
            • <strong>Marketing:</strong> Deliver relevant advertisements and measure their effectiveness
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Types of Cookies We Use</SectionTitle>
          <CookieTable>
            <thead>
              <tr>
                <TableHeader>Cookie Type</TableHeader>
                <TableHeader>Purpose</TableHeader>
                <TableHeader>Duration</TableHeader>
                <TableHeader>Examples</TableHeader>
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
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SectionTitle>Third-Party Cookies</SectionTitle>
          <Text>
            We work with third-party service providers who may place cookies on your device through our website. 
            These providers include:
          </Text>
          <Text>
            • <strong>Google Analytics:</strong> Helps us understand website usage and performance<br/>
            • <strong>Payment Processors:</strong> Enable secure online transactions<br/>
            • <strong>Social Media Platforms:</strong> Allow social sharing and integration<br/>
            • <strong>Advertising Networks:</strong> Deliver targeted advertisements
          </Text>
          <Text>
            These third parties have their own privacy policies and cookie practices, which we encourage you to review.
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Managing Your Cookie Preferences</SectionTitle>
          <Text>
            You have several options for managing cookies on our website:
          </Text>
          
          <Text>
            <strong>Browser Settings:</strong><br/>
            Most web browsers allow you to control cookies through their settings. You can:
          </Text>
          <Text>
            • Accept or reject all cookies<br/>
            • Accept only certain types of cookies<br/>
            • Receive notifications when cookies are set<br/>
            • Delete existing cookies
          </Text>

          <Text>
            <strong>Cookie Consent Banner:</strong><br/>
            When you first visit our website, you'll see a cookie consent banner where you can choose which 
            types of cookies to accept.
          </Text>

          <Text>
            <strong>Opt-Out Tools:</strong><br/>
            For advertising cookies, you can opt out through industry tools like:
          </Text>
          <Text>
            • Network Advertising Initiative (NAI)<br/>
            • Digital Advertising Alliance (DAA)<br/>
            • European Interactive Digital Advertising Alliance (EDAA)
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <SectionTitle>Impact of Disabling Cookies</SectionTitle>
          <Text>
            While you can browse our website with cookies disabled, please note that some features may not 
            work properly:
          </Text>
          <Text>
            • Your shopping cart may not remember items<br/>
            • You may need to log in repeatedly<br/>
            • Personalized recommendations won't be available<br/>
            • Some pages may load more slowly<br/>
            • You may see less relevant advertisements
          </Text>
        </Section>

        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Updates to This Policy</SectionTitle>
          <Text>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for 
            legal, operational, or regulatory reasons. We will notify you of any significant changes by 
            updating the policy on our website.
          </Text>
        </Section>

        <HighlightBox>
          <HighlightText>
            <strong>Need More Information?</strong><br/>
            If you have questions about our use of cookies or this Cookie Policy, please contact us at 
            privacy@teipsum.com or +48 123 456 789.
          </HighlightText>
        </HighlightBox>
      </ContentWrapper>
    </CookieContainer>
  );
};

export default CookiePolicyPage; 