import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../features/products/components/ProductCard';
import ProductBlock from '../features/products/components/ProductBlock';
import FilterSidebar from '../components/store/FilterSidebar';
import SearchBar from '../components/store/SearchBar';
import { fetchProducts } from '../features/products/productSlice';
import { ViewTypeContext } from '../context/ViewTypeContext';
import { useGender } from '../context/GenderContext'; 

const StoreContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const StoreHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

const ViewToggleButton = styled.button`
  width: 105px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #3498db;
  border-radius: 25px;
  background: white;
  color: #3498db;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);

  &:hover {
    background: #3498db;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StoreContent = styled.div`
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ProductsSection = styled.main`
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ProductsGrid = styled.section`
  display: ${props => props.viewMode === 'grid' ? 'grid' : 'block'};
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

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const StorePage = () => {
  const { viewMode, setViewMode } = useContext(ViewTypeContext);
  const { selectedGender } = useGender();
  const dispatch = useDispatch();
  const location = useLocation();

  const { products, totalPages, loading, error } = useSelector((state) => state.products || {});

  const [filters, setFilters] = useState(() => {
    const locationState = location.state;
    if (locationState?.filters) {
      return {
        name: '',
        category: '',
        subcategory: '',
        gender: locationState.filters.gender || '',
        minPrice: 0,
        maxPrice: 1000,
        minDiscount: 0,
        maxDiscount: 100,
        available: true,
      };
    }
    // Use context gender if available
    if (selectedGender) {
      return {
        name: '',
        category: '',
        subcategory: '',
        gender: selectedGender,
        minPrice: 0,
        maxPrice: 1000,
        minDiscount: 0,
        maxDiscount: 100,
        available: true,
      };
    }
    return {
      name: '',
      category: '',
      subcategory: '',
      gender: '',
      minPrice: 0,
      maxPrice: 1000,
      minDiscount: 0,
      maxDiscount: 100,
      available: true,
    };
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    // Initialize search query from location state if available (from header search)
    const locationState = location.state;
    return locationState?.searchQuery || '';
  });
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const size = 12;

  useEffect(() => {
    document.title = 'Store - TeIpsum';

    const fetchProductData = () => {
      dispatch(fetchProducts({
        name: searchQuery.toLowerCase(),
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

    fetchProductData();
  }, [filters, searchQuery, page, sortBy, dispatch]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    setPage(0);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
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
    <StoreContainer>
      <StoreHeader>
        <SearchSection>
          <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        </SearchSection>
      </StoreHeader>

      <StoreContent>
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        
        <ProductsSection>
          <ResultsInfo>
            <ResultsCount>
              {loading ? 'Loading...' : `${products?.length || 0} products found`}
            </ResultsCount>
          <ViewToggleButton onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </ViewToggleButton>
            <SortSelect value={sortBy} onChange={handleSortChange}>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="createdAt">Sort by Newest</option>
            </SortSelect>
          </ResultsInfo>

          {loading && (
            <LoadingContainer>
              <div>Loading products...</div>
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
                <ProductsGrid viewMode={viewMode}>
                  {products.map((product) => (
                    <article key={product.id}>
                      {viewMode === 'grid' ? (
                        <ProductCard product={product} />
                      ) : (
                        <ProductBlock product={product} />
                      )}
                    </article>
                  ))}
                </ProductsGrid>
              ) : (
                <EmptyState>
                  <EmptyStateIcon>🔍</EmptyStateIcon>
                  <EmptyStateTitle>No products found</EmptyStateTitle>
                  <EmptyStateText>
                    Try adjusting your filters or search terms to find what you're looking for.
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
      </StoreContent>
    </StoreContainer>
  );
};

export default StorePage;
