import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const ContactContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  align-items: stretch;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  height: calc(100vh - 120px);
  width: 100%;

  @media (max-width: 1200px) {
    max-width: 1000px;
    gap: 30px;
  }

  @media (max-width: 992px) {
    gap: 25px;
    height: calc(100vh - 100px);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    height: auto;
    min-height: calc(100vh - 90px);
  }

  @media (max-width: 480px) {
    gap: 15px;
    min-height: calc(100vh - 70px);
  }
`;

const MapSection = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 992px) {
    border-radius: 15px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 500px;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
    min-height: 450px;
  }
`;

const MapContainer = styled.div`
  height: 350px;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 1200px) {
    height: 300px;
  }

  @media (max-width: 992px) {
    height: 280px;
  }

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const Map = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;

const SearchSection = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #ecf0f1;
  flex-shrink: 0;

  @media (max-width: 992px) {
    padding: 15px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
`;

const StoreLocations = styled.div`
  padding: 0px 20px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  max-height: calc(100vh - 120px - 350px - 80px);
  width: 100%;
  
  

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @media (max-width: 1200px) {
    max-height: calc(100vh - 100px - 300px - 70px);
  }

  @media (max-width: 992px) {
    max-height: calc(100vh - 90px - 280px - 60px);
  }

  @media (max-width: 768px) {
    max-height: 300px;
  }

  @media (max-width: 480px) {
    max-height: 250px;
    padding:  0 10px;
  }
`;

const LocationTitle = styled.h3`
  color: #2c3e50;
  // margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
  position: sticky;
  top: 0;
  background: white;
  padding: 10px 0 10px 20px;
  border-bottom: 2px solid #ecf0f1;
  z-index: 1;
  width: 100%;
  
  @media (max-width: 992px) {
    font-size: 1.3rem;
    // margin-top: 15px;
    // margin-bottom: 15px;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    // margin-top: 12px;
    // margin-bottom: 12px;
    // padding-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    // margin-bottom: 10px;
  }
`;

const LocationCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  border-left: 4px solid #3498db;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 992px) {
    margin-bottom: 12px;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
    border-radius: 8px;

    &:hover {
      transform: translateX(3px);
    }
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 8px;
    border-left-width: 3px;

    &:hover {
      transform: none;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    }
  }
`;

const LocationName = styled.h4`
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 5px;
  }
`;

const LocationAddress = styled.p`
  color: #7f8c8d;
  margin: 0 0 5px 0;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 3px;
  }
`;

const LocationHours = styled.p`
  color: #27ae60;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ContactFormSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 1200px) {
    padding: 35px;
  }

  @media (max-width: 992px) {
    padding: 30px;
    border-radius: 15px;
  }

  @media (max-width: 768px) {
    padding: 25px;
    height: auto;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 10px;
  }
`;

const FormTitle = styled(motion.h2)`
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;

  @media (max-width: 992px) {
    font-size: 1.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 6px;
  }
`;

const FormSubtitle = styled(motion.p)`
  color: #7f8c8d;
  margin-bottom: 30px;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 992px) {
    font-size: 0.95rem;
    margin-bottom: 25px;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 15px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const Label = styled.label`
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.85rem;
    border-radius: 6px;
  }
`;

const TextArea = styled.textarea`
  padding: 15px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
    border-radius: 8px;
    min-height: 100px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.85rem;
    border-radius: 6px;
    min-height: 80px;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    border-radius: 6px;
    margin-top: 5px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.25);
    }
  }
`;

const StatusMessage = styled(motion.div)`
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  background: ${props => props.type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.type === 'success' ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#f5c6cb'};

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
    margin-top: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.85rem;
    margin-top: 10px;
    border-radius: 6px;
  }
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const storeLocations = [
    {
      id: 1,
      name: "TeIpsum Main Store",
      address: "123 Fashion Street, Lodz, Poland",
      hours: "Mon-Sat: 10:00 AM - 8:00 PM, Sun: 12:00 PM - 6:00 PM",
      phone: "+48 123 456 789"
    },
    {
      id: 2,
      name: "TeIpsum Shopping Center",
      address: "456 Mall Avenue, Warsaw, Poland",
      hours: "Mon-Sun: 9:00 AM - 9:00 PM",
      phone: "+48 987 654 321"
    },
    {
      id: 3,
      name: "TeIpsum Boutique",
      address: "789 Designer Lane, Krakow, Poland",
      hours: "Mon-Fri: 11:00 AM - 7:00 PM, Sat: 10:00 AM - 6:00 PM, Sun: Closed",
      phone: "+48 555 123 456"
    },
    {
      id: 4,
      name: "TeIpsum Outlet",
      address: "321 Discount Road, Gdansk, Poland",
      hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 11:00 AM - 5:00 PM",
      phone: "+48 777 888 999"
    },
    {
      id: 5,
      name: "TeIpsum Premium",
      address: "555 Luxury Boulevard, Wroclaw, Poland",
      hours: "Mon-Fri: 10:00 AM - 8:00 PM, Sat: 10:00 AM - 6:00 PM, Sun: 12:00 PM - 5:00 PM",
      phone: "+48 888 999 111"
    },
    {
      id: 6,
      name: "TeIpsum Express",
      address: "777 Quick Street, Poznan, Poland",
      hours: "Mon-Sun: 8:00 AM - 10:00 PM",
      phone: "+48 111 222 333"
    }
  ];

  const filteredLocations = storeLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setStatus(result.success ? 'success' : 'error');
      
      if (result.success) {
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const contactPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact TeIpsum",
    "description": "Get in touch with TeIpsum. Find our store locations, contact information, and send us a message.",
    "mainEntity": {
      "@type": "Organization",
      "name": "TeIpsum",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+48-123-456-789",
          "contactType": "customer service",
          "availableLanguage": ["English", "Polish"]
        }
      ]
    }
  };

  return (
    <ContactContainer>
      <SEO
        title="Contact Us - Get in Touch"
        description="Get in touch with TeIpsum. Find our store locations across Poland, contact information, opening hours, and send us a message for customer support."
        keywords="contact TeIpsum, store locations, customer service, contact information, TeIpsum stores, Poland stores, fashion store contact"
        canonicalUrl="/contact"
        image="/images/teipsum-contact.jpg"
        imageAlt="Contact TeIpsum - Store Locations and Customer Service"
        structuredData={contactPageStructuredData}
      />
      
      <ContactContent>
        <MapSection>
          <MapContainer>
            <Map
              title="TeIpsum Store Locations"
              src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Lodz,Poland"
              allowFullScreen=""
              loading="lazy"
            />
          </MapContainer>
          
          <SearchSection>
            <SearchInput
              type="text"
              placeholder="Search for store locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchSection>
          <LocationTitle>Our Store Locations</LocationTitle>
          <StoreLocations>
            
            {filteredLocations.map((location) => (
              <LocationCard key={location.id}>
                <LocationName>{location.name}</LocationName>
                <LocationAddress>{location.address}</LocationAddress>
                <LocationAddress>📞 {location.phone}</LocationAddress>
                <LocationHours>🕒 {location.hours}</LocationHours>
              </LocationCard>
            ))}
            {filteredLocations.length === 0 && (
              <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px 20px' }}>
                <p>No stores found matching your search.</p>
              </div>
            )}
          </StoreLocations>
        </MapSection>

        <ContactFormSection>
          <FormTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get in Touch
          </FormTitle>
          <FormSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
          </FormSubtitle>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Message</Label>
              <TextArea
                name="message"
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </Form>

          {status && status !== 'loading' && (
            <StatusMessage
              type={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {status === 'success' 
                ? 'Thank you for your message! We\'ll get back to you soon.' 
                : 'Something went wrong. Please try again later.'
              }
            </StatusMessage>
          )}
        </ContactFormSection>
      </ContactContent>
    </ContactContainer>
  );
}
