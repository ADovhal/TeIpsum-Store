import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../features/products/components/ProductCard';
import ProductBlock from '../features/products/components/ProductBlock';
import FilterSidebar from '../components/store/FilterSidebar';
import SearchBar from '../components/store/SearchBar';
import { fetchProducts } from '../features/products/productSlice';
import { ViewTypeContext } from '../context/ViewTypeContext'; 

const StorePage = () => {
  const { viewMode, setViewMode } = useContext(ViewTypeContext);
  const dispatch = useDispatch();

  const { products, totalPages, loading, error } = useSelector((state) => state.products || {});

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const size = 12;

  useEffect(() => {
    document.title = 'Store';

    const fetchProductData = () => {
      dispatch(fetchProducts({
        name: searchQuery.toLowerCase(),
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        page,
        size
      }));
    };

    fetchProductData();
  }, [filters, searchQuery, page, dispatch]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    setPage(0);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setFilters((prevFilters) => ({ ...prevFilters, name: query }));
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

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', flexDirection: 'column', height: '80vh' }}>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside>
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        <main style={{ flex: 1, marginLeft: '20px' }}>
          <header style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '20px', paddingLeft: '80px', paddingTop: '20px' }}>
            <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

            <div style={{ paddingBottom: '20px' }}>
              <button onClick={() => setViewMode('grid')} style={{ marginRight: '20px' }}>Cards</button>
              <button onClick={() => setViewMode('list')}>Blocks</button>
            </div>
          </header>

          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}

          <section aria-label="Product List" style={{
            display: viewMode === 'grid' ? 'flex' : 'block',
            flexWrap: viewMode === 'grid' ? 'wrap' : 'none',
            justifyContent: viewMode === 'grid' ? 'flex-start' : 'center',
            marginTop: viewMode === 'grid' ? '0px' : '30px',
            marginBottom: viewMode === 'grid' ? '30px' : '40px',
            paddingLeft: viewMode === 'grid' ? '20px' : '80px'
          }}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <article key={product.id}>
                  {viewMode === 'grid' ? (
                    <ProductCard product={product} />
                  ) : (
                    <ProductBlock product={product} />
                  )}
                </article>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </section>
        </main>
      </div>
        <footer style={{
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button onClick={handlePreviousPage} disabled={page === 0}>
              Previous
            </button>
            <span style={{ margin: '0 10px' }}>
              Page {page + 1} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={page >= totalPages - 1}>
              Next
            </button>
          </div>
        </footer>
    </div>
  );
};

export default StorePage;
