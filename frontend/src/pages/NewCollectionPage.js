import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../features/products/components/ProductCard';
import { fetchProducts } from '../features/products/productSlice';
import CustomSelect from '../components/common/Select';

const NewCollectionContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const NewCollectionHeader = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
`;

const NewCollectionTitle = styled(motion.h1)`
  font-size: 4rem;
  color: white;
  margin-bottom: 10px;
  font-family: 'Sacramento', cursive;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const NewCollectionSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  font-weight: 300;
`;

const NewCollectionBadge = styled(motion.span)`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
`;

const CollectionDescription = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const DescriptionTitle = styled.h2`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const DescriptionText = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const CollectionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
`;

const FiltersSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ClearFiltersButton = styled.button`
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }
`;

const ProductsSection = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ResultsInfo = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ecf0f1;
`;

const ResultsCount = styled.span`
  font-size: 16px;
  text-align: center;
  color: #7f8c8d;
  padding-bottom: 10px;
`;

// SortSelect replaced with CustomSelect (react-select)

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  justify-items: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
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

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #e74c3c;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #7f8c8d;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #2c3e50;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 16px;
`;

const PaginationContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #ecf0f1;
  margin-top: 30px;
`;

const PaginationButton = styled.button`
  padding: 12px 20px;
  border: 2px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 100px;

  &:hover:not(:disabled) {
    background: #3498db;
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    border-color: #bdc3c7;
    color: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const PageInfo = styled.span`
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
  padding: 0 20px;
`;

const NewCollectionPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { products, totalPages, loading, error } = useSelector((state) => state.products || {});

  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    gender: '',
    minPrice: 0,
    maxPrice: 1000,
    minDiscount: 0,
    maxDiscount: 100,
    available: true,
  });
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const size = 12;

  useEffect(() => {
    document.title = 'New Collection - TeIpsum';

    const fetchNewCollection = () => {
      dispatch(fetchProducts({
        category: filters.category,
        subcategory: filters.subcategory,
        gender: filters.gender,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minDiscount: filters.minDiscount,
        maxDiscount: filters.maxDiscount,
        available: filters.available,
        page,
        size,
        sort: sortBy
      }));
    };

    fetchNewCollection();
  }, [filters, page, sortBy, dispatch]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      gender: '',
      minPrice: 0,
      maxPrice: 1000,
      minDiscount: 0,
      maxDiscount: 100,
      available: true,
    });
    setPage(0);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  return (
    <NewCollectionContainer>
      <NewCollectionHeader>
        <NewCollectionTitle
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('newCollectionTitle')}
        </NewCollectionTitle>
        <NewCollectionSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('newCollectionSubtitle')}
        </NewCollectionSubtitle>
        <NewCollectionBadge
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('justLaunched')}
        </NewCollectionBadge>
      </NewCollectionHeader>

      <CollectionDescription
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <DescriptionTitle>Summer 2025 Collection</DescriptionTitle>
        <DescriptionText>
          Our latest collection embodies the spirit of modern elegance with sustainable materials, 
          innovative designs, and timeless aesthetics. Each piece is crafted with attention to detail 
          and a commitment to quality that defines the TeIpsum brand.
        </DescriptionText>
        <CollectionStats>
          <StatItem>
            <StatNumber>50+</StatNumber>
            <StatLabel>{t('newItems')}</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>3</StatNumber>
            <StatLabel>{t('categories')}</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>100%</StatNumber>
            <StatLabel>Sustainable</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support</StatLabel>
          </StatItem>
        </CollectionStats>
      </CollectionDescription>

      <FiltersSection>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>{t('categories')}</FilterLabel>
            <FilterSelect 
              value={filters.category} 
              onChange={(e) => handleFilterChange({ category: e.target.value })}
            >
              <option value="">{t('allCategories')}</option>
              <option value="MENS_CLOTHING">Men's Clothing</option>
              <option value="WOMENS_CLOTHING">Women's Clothing</option>
              <option value="KIDS_CLOTHING">Kids' Clothing</option>
              <option value="ACCESSORIES">Accessories</option>
              <option value="SHOES">Shoes</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('gender')}</FilterLabel>
            <FilterSelect 
              value={filters.gender} 
              onChange={(e) => handleFilterChange({ gender: e.target.value })}
            >
              <option value="">{t('allGenders')}</option>
              <option value="MEN">{t('men')}</option>
              <option value="WOMEN">{t('women')}</option>
              <option value="UNISEX">{t('unisex')}</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('price')} ($)</FilterLabel>
            <FilterSelect 
              value={filters.maxPrice} 
              onChange={(e) => handleFilterChange({ maxPrice: parseInt(e.target.value) || 1000 })}
            >
              <option value="1000">Any Price</option>
              <option value="50">{t('to')} $50</option>
              <option value="100">{t('to')} $100</option>
              <option value="200">{t('to')} $200</option>
              <option value="500">{t('to')} $500</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <ClearFiltersButton onClick={handleClearFilters}>
              {t('clearFilters')}
            </ClearFiltersButton>
          </FilterGroup>
        </FiltersGrid>
      </FiltersSection>

      <ProductsSection>
        <ResultsInfo>
          <ResultsCount>
            {loading ? 'Loading...' : `${products?.length || 0} new items found`}
          </ResultsCount>
          <CustomSelect
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'createdAt', label: t('sortByNewest') },
              { value: 'price', label: t('sortByPrice') },
              { value: 'name', label: t('sortByName') },
              { value: 'discount', label: t('sortByDiscount') }
            ]}
            placeholder={t('sortBy')}
          />
        </ResultsInfo>

        {loading && (
          <LoadingContainer>
            <div>Loading new collection...</div>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <div>Error loading products: {error}</div>
          </ErrorContainer>
        )}

        {!loading && !error && (
          <>
            {Array.isArray(products) && products.length > 0 ? (
              <ProductsGrid>
                {products.map((product, index) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.article>
                ))}
              </ProductsGrid>
            ) : (
              <EmptyState>
                <EmptyStateIcon>🌟</EmptyStateIcon>
                <EmptyStateTitle>No new items found</EmptyStateTitle>
                <EmptyStateText>
                  Check back soon for our latest collection updates.
                </EmptyStateText>
              </EmptyState>
            )}
          </>
        )}

        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton 
              onClick={handlePreviousPage} 
              disabled={page === 0}
            >
              Previous
            </PaginationButton>
            <PageInfo>
              Page {page + 1} of {totalPages}
            </PageInfo>
            <PaginationButton 
              onClick={handleNextPage} 
              disabled={page >= totalPages - 1}
            >
              Next
            </PaginationButton>
          </PaginationContainer>
        )}
      </ProductsSection>
    </NewCollectionContainer>
  );
};

export default NewCollectionPage; 