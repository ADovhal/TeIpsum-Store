// src/pages/StorePage.js
import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../features/products/components/ProductCard';
import ProductBlock from '../features/products/components/ProductBlock';
import FilterSidebar from '../components/store/FilterSidebar';
import SearchBar from '../components/store/SearchBar';
import { getProductsFiltered } from '../features/products/ProductService'
import { ViewTypeContext } from '../context/ViewTypeContext'; // Импортируем контекст

const StorePage = () => {
    const { viewMode, setViewMode } = useContext(ViewTypeContext); // Используем контекст для доступа к viewMode и setViewMode
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: 0,
        maxPrice: 1000,
        rating: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const size = 12;

    useEffect(() => {

        document.title = 'Store';

        const fetchProducts = async () => {
            try {
                const query = searchQuery.toLowerCase();
                const { products: fetchedProducts, totalPages } = await getProductsFiltered({
                    name: query,
                    category: filters.category,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    rating: filters.rating,
                    page,
                    size
                });

                if (Array.isArray(fetchedProducts)) {
                    setProducts(fetchedProducts);
                } else {
                    setProducts([]);
                }

                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [filters, searchQuery, page]);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', position: 'relative' }}>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
            
            <div style={{ flex: 1, marginLeft: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '20px', paddingLeft: '80px', paddingTop: '20px'}}>
                    <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                    
                    <div style={{paddingBottom: '20px'}}>
                        <button onClick={() => setViewMode('grid')} style={{ marginRight: '20px' }}>Карточки</button>
                        <button onClick={() => setViewMode('list')}>Блоки</button>
                    </div>
                </div>

                <div style={{
                    display: viewMode === 'grid' ? 'flex' : 'block',
                    flexWrap: viewMode === 'grid' ? 'wrap' : 'none',
                    justifyContent: viewMode === 'grid' ? 'flex-start' : 'center',
                    marginTop: viewMode === 'grid' ? '0px' : '30px',
                    marginBottom: viewMode === 'grid' ? '30px' : '40px',
                    paddingLeft: viewMode === 'grid' ? '20px' : '80px'
                }}>
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                            viewMode === 'grid' ? (
                                <ProductCard key={product.id} product={product} />
                            ) : (
                                <ProductBlock key={product.id} product={product} />
                            )
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
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
            </div>
        </div>
    );
};

export default StorePage;
