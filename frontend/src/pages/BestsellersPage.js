import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../context/LanguageContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../features/products/components/ProductCard';

const BestsellersContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
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
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
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

const FilterSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  color: #2c3e50;
  font-weight: 600;
  font-size: 1rem;
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const StatNumber = styled.h3`
  color: #3498db;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const StatLabel = styled.p`
  color: #5a6c7d;
  font-size: 0.9rem;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #7f8c8d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const BestsellersPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products || {});
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    sortBy: 'popularity'
  });

  useEffect(() => {
    document.title = `${t('bestsellersTitle')} - TeIpsum`;
  }, [t]);

  useEffect(() => {
    // Fetch bestselling products (you could modify this to use a specific bestsellers endpoint)
    dispatch(fetchProducts({
      page: 0,
      size: 20,
      sort: filters.sortBy,
      category: filters.category,
      gender: filters.gender,
      featured: true // Assuming you have a way to mark bestsellers
    }));
  }, [dispatch, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Mock bestseller stats
  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Bestselling Items' },
    { number: '4.8★', label: 'Average Rating' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <BestsellersContainer>
      <ContentWrapper>
        <HeaderSection>
          <Title
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('bestsellersTitle')}
          </Title>
          <Subtitle>
            Discover the most loved pieces by our customers. These top-rated items have earned their place 
            as favorites through exceptional quality, style, and customer satisfaction.
          </Subtitle>
        </HeaderSection>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StatsSection>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <FilterSection>
            <FilterGroup>
              <FilterLabel>Filter by:</FilterLabel>
              <FilterSelect
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="MENS_CLOTHING">Men's Clothing</option>
                <option value="WOMENS_CLOTHING">Women's Clothing</option>
                <option value="KIDS_CLOTHING">Kids' Clothing</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="SHOES">Shoes</option>
              </FilterSelect>

              <FilterSelect
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="UNISEX">Unisex</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Sort by:</FilterLabel>
              <FilterSelect
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name A-Z</option>
              </FilterSelect>
            </FilterGroup>
          </FilterSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ProductsSection>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.8rem' }}>
              Top Selling Products
            </h2>
            
            {loading && (
              <LoadingContainer>
                Loading bestsellers...
              </LoadingContainer>
            )}

            {error && (
              <EmptyState>
                <EmptyIcon>⚠️</EmptyIcon>
                <h3>Error loading products</h3>
                <p>Please try again later</p>
              </EmptyState>
            )}

            {!loading && !error && Array.isArray(products) && products.length > 0 && (
              <ProductsGrid>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </ProductsGrid>
            )}

            {!loading && !error && (!Array.isArray(products) || products.length === 0) && (
              <EmptyState>
                <EmptyIcon>🔍</EmptyIcon>
                <h3>No bestsellers found</h3>
                <p>Try adjusting your filters or check back later for new arrivals.</p>
              </EmptyState>
            )}
          </ProductsSection>
        </motion.div>
      </ContentWrapper>
    </BestsellersContainer>
  );
};

export default BestsellersPage; 