import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const FooterContainer = styled.footer`
  background: ${props => props.theme.footer};
  color: ${props => props.theme.textPrimary};
  padding: 60px 20px 30px;
  margin-top: auto;
  transition: all 0.3s ease;
  border-top: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    padding: 40px 15px 20px;
  }

  @media (max-width: 480px) {
    padding: 30px 10px 15px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.accent};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  border-bottom: 2px solid ${props => props.theme.accent};
  padding-bottom: 8px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 8px;
    padding-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 6px;
    padding-bottom: 4px;
  }
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.textSecondary};
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    color: ${props => props.theme.accent};
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const FooterText = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;

  @media (max-width: 480px) {
    gap: 12px;
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  color: ${props => props.theme.textSecondary};
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.accent};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    padding-top: 20px;
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  @media (max-width: 480px) {
    padding-top: 15px;
    gap: 12px;
  }
`;

const Copyright = styled.p`
  color: ${props => props.theme.textTertiary};
  font-size: 0.8rem;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const SettingsSection = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 20px;
    flex-direction: column;
  }

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const LanguageLabel = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const LanguageDropdown = styled.select`
  background: ${props => props.theme.input};
  color: ${props => props.theme.textPrimary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }

  &:hover {
    border-color: ${props => props.theme.borderLight};
  }

  option {
    background: ${props => props.theme.input};
    color: ${props => props.theme.textPrimary};
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 5px 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 4px 6px;
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ThemeLabel = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ThemeButton = styled.button`
  background: ${props => props.theme.buttonSecondary};
  color: ${props => props.theme.textPrimary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${props => props.theme.buttonSecondaryHover};
    border-color: ${props => props.theme.accent};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 5px 10px;
    gap: 5px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 4px 8px;
    gap: 4px;
  }
`;

const Newsletter = styled.div`
  background: ${props => props.theme.card};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  width: fit-content;
  align-self: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  @media (max-width: 480px) {
    gap: 6px;
    margin-top: 10px;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.input};
  color: ${props => props.theme.textPrimary};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }

  &::placeholder {
    color: ${props => props.theme.textTertiary};
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 0.8rem;
  }
`;

const NewsletterButton = styled.button`
  background: ${props => props.theme.buttonPrimary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.buttonPrimaryHover};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8rem;

    &:hover {
      transform: none;
    }
  }
`;

const Footer = () => {
  const { t, currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Newsletter subscription functionality would be implemented here');
  };

  return (
    <FooterContainer theme={theme}>
      <FooterSection>
        <Newsletter theme={theme}>
          <SectionTitle theme={theme}>{t('newsletter')}</SectionTitle>
          <FooterText theme={theme}>
            {t('stayUpdated')}
          </FooterText>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput 
              name='clientsEmail'
              type="email" 
              placeholder={t('emailPlaceholder')}
              theme={theme}
              required
            />
                          <NewsletterButton type="submit" theme={theme}>
              {t('subscribe')}
            </NewsletterButton>
          </NewsletterForm>
        </Newsletter>
      </FooterSection>
      <FooterContent>
        <FooterSection>
          <SectionTitle theme={theme}>{t('about')}</SectionTitle>
          <FooterText theme={theme}>
            {t('thoughtfulClothing')}
          </FooterText>
          <FooterText theme={theme}>
            {t('minimalSymbolic')}
          </FooterText>
          <SocialLinks>
            <SocialLink href="#" theme={theme}>📘</SocialLink>
            <SocialLink href="#" theme={theme}>📷</SocialLink>
            <SocialLink href="#" theme={theme}>🐦</SocialLink>
            <SocialLink href="#" theme={theme}>💼</SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <SectionTitle theme={theme}>{t('store')}</SectionTitle>
          <FooterLink to="/store" theme={theme}>{t('allProducts')}</FooterLink>
          <FooterLink to="/new-arrivals" theme={theme}>{t('newArrivals')}</FooterLink>
          <FooterLink to="/bestsellers" theme={theme}>{t('bestsellers')}</FooterLink>
          <FooterLink to="/discounts" theme={theme}>{t('discounts')}</FooterLink>
          <FooterLink to="/size-guide" theme={theme}>{t('sizeGuide')}</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle theme={theme}>{t('customerService')}</SectionTitle>
          <FooterLink to="/contact" theme={theme}>{t('contact')}</FooterLink>
          <FooterLink to="/shipping" theme={theme}>{t('shippingInfo')}</FooterLink>
          <FooterLink to="/returns" theme={theme}>{t('returnsExchanges')}</FooterLink>
          <FooterLink to="/faq" theme={theme}>{t('faq')}</FooterLink>
          <FooterLink to="/sustainability" theme={theme}>{t('sustainabilityFooter')}</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle theme={theme}>{t('company')}</SectionTitle>
          <FooterLink to="/about" theme={theme}>{t('about')}</FooterLink>
          <FooterLink to="/careers" theme={theme}>{t('careers')}</FooterLink>
          <FooterLink to="/blog" theme={theme}>{t('blog')}</FooterLink>
          <FooterLink to="/accessibility" theme={theme}>{t('accessibility')}</FooterLink>
          <FooterLink to="/privacy" theme={theme}>{t('privacyPolicy')}</FooterLink>
          <FooterLink to="/terms" theme={theme}>{t('termsOfService')}</FooterLink>
          <FooterLink to="/cookies" theme={theme}>{t('cookiePolicy')}</FooterLink>
        </FooterSection>
      </FooterContent>


      <FooterBottom theme={theme}>
        <Copyright theme={theme}>
          © 2025 TeIpsum. {t('allRightsReserved')}.
        </Copyright>
        
        <SettingsSection>
          <LanguageSelector>
            <LanguageLabel theme={theme}>{t('language')}:</LanguageLabel>
            <LanguageDropdown 
              value={currentLanguage} 
              onChange={handleLanguageChange}
              theme={theme}
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </LanguageDropdown>
          </LanguageSelector>

          <ThemeToggle>
            <ThemeLabel theme={theme}>{t('theme')}:</ThemeLabel>
            <ThemeButton onClick={toggleTheme} theme={theme}>
              {isDark ? '☀️' : '🌙'}
              {isDark ? t('lightTheme') : t('darkTheme')}
            </ThemeButton>
          </ThemeToggle>
        </SettingsSection>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
