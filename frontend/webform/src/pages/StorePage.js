import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import FilterSidebar from '../components/store/FilterSidebar';
import SearchBar from '../components/store/SearchBar';
import { getProductsFiltered } from '../services/productService';

const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: 0,
        maxPrice: 1000,
        rating: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const query = searchQuery.toLowerCase(); // Приведение к нижнему регистру для регистронезависимого поиска
                const fetchedProducts = await getProductsFiltered({
                    name: query,
                    category: filters.category,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    rating: filters.rating,
                });
                
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [filters, searchQuery]);

    const handleFilterChange = (updatedFilters) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setFilters((prevFilters) => ({ ...prevFilters, name: query })); // Добавляем поиск по имени в фильтры
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
            <div style={{ flex: 1, marginLeft: '20px' }}>
                <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: '20px' }}>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StorePage;
