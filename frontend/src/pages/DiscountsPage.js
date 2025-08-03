import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../features/products/components/ProductCard';
import { fetchProducts } from '../features/products/productSlice';
import CustomSelect from '../components/common/Select';

const DiscountsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  padding: 20px;
`;

const DiscountsHeader = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
`;

const DiscountsTitle = styled(motion.h1)`
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  font-family: 'Sacramento', cursive;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const DiscountsSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 20px;
`;

const DiscountBadge = styled(motion.span)`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
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
    border-color: #e74c3c;
  }
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const ClearFiltersButton = styled.button`
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c0392b;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ecf0f1;
`;

const ResultsCount = styled.span`
  font-size: 16px;
  color: #7f8c8d;
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
  border: 2px solid #e74c3c;
  background: white;
  color: #e74c3c;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 100px;

  &:hover:not(:disabled) {
    background: #e74c3c;
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

const DiscountsPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { products, totalPages, loading, error } = useSelector((state) => state.products || {});

  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    gender: '',
    minDiscount: 10,
    maxDiscount: 100,
    minPrice: 0,
    maxPrice: 1000,
  });
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('discount');
  const size = 12;

  useEffect(() => {
    document.title = `${t('discountsTitle')} - TeIpsum`;

    const fetchDiscountProducts = () => {
      dispatch(fetchProducts({
        category: filters.category,
        subcategory: filters.subcategory,
        gender: filters.gender,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minDiscount: filters.minDiscount,
        maxDiscount: filters.maxDiscount,
        page,
        size,
        sort: sortBy
      }));
    };

    fetchDiscountProducts();
  }, [filters, page, sortBy, dispatch, t]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      gender: '',
      minDiscount: 10,
      maxDiscount: 100,
      minPrice: 0,
      maxPrice: 1000,
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

  const filteredProducts = products?.filter(product => product.discount > 0) || [];

  return (
    <DiscountsContainer>
      <DiscountsHeader>
        <DiscountsTitle
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('discountsTitle')}
        </DiscountsTitle>
        <DiscountsSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('discountsSubtitle')}
        </DiscountsSubtitle>
        <DiscountBadge
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('upTo')} 70% {t('off')}
        </DiscountBadge>
      </DiscountsHeader>

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
            <FilterLabel>{t('minDiscount')} (%)</FilterLabel>
            <FilterInput
              type="number"
              value={filters.minDiscount}
              onChange={(e) => handleFilterChange({ minDiscount: parseInt(e.target.value) || 0 })}
              min="0"
              max="100"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('maxPrice')} ($)</FilterLabel>
            <FilterInput
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange({ maxPrice: parseInt(e.target.value) || 1000 })}
              min="0"
            />
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
            {loading ? `${t('loading')}` : `${filteredProducts.length} discounted ${t('productsFound')}`}
          </ResultsCount>
          <CustomSelect
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'discount', label: t('sortByDiscount') },
              { value: 'price', label: t('sortByPrice') },
              { value: 'title', label: t('sortByName') },
              // { value: 'createdAt', label: t('sortByNewest') }
            ]}
            placeholder={t('sortBy')}
          />
        </ResultsInfo>

        {loading && (
          <LoadingContainer>
            <div>Loading discounted products...</div>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <div>Error loading products: {error}</div>
          </ErrorContainer>
        )}

        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <ProductsGrid>
                {filteredProducts.map((product) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard product={product} />
                  </motion.article>
                ))}
              </ProductsGrid>
            ) : (
              <EmptyState>
                <EmptyStateIcon>🎁</EmptyStateIcon>
                <EmptyStateTitle>{t('noProductsFound')}</EmptyStateTitle>
                <EmptyStateText>
                  {t('tryAdjustingFilters')}
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
              {t('previous')}
            </PaginationButton>
            <PageInfo>
              {t('page')} {page + 1} {t('of')} {totalPages}
            </PageInfo>
            <PaginationButton 
              onClick={handleNextPage} 
              disabled={page >= totalPages - 1}
            >
              {t('next')}
            </PaginationButton>
          </PaginationContainer>
        )}
      </ProductsSection>
    </DiscountsContainer>
  );
};

export default DiscountsPage; 