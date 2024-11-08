import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import FilterSidebar from '../components/store/FilterSidebar';
import SearchBar from '../components/store/SearchBar';
import { getProductsFiltered } from '../services/productService';

const StorePage = () => {
    const [products, setProducts] = useState([]);  // Продукты на текущей странице
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: 0,
        maxPrice: 1000,
        rating: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');
    
    const [page, setPage] = useState(0); // Номер текущей страницы
    const [totalPages, setTotalPages] = useState(0); // Общее количество страниц

    const size = 10; // Размер страницы

    // Функция для получения продуктов с учетом фильтров и пагинации
    useEffect(() => {
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

                console.log('Fetched products:', fetchedProducts); // Логируем ответ от сервера

                if (Array.isArray(fetchedProducts)) {
                    setProducts(fetchedProducts); // Обновляем состояние продуктами
                } else {
                    setProducts([]); // Если данных нет, очищаем продукты
                }

                // Устанавливаем общее количество страниц
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [filters, searchQuery, page]); // Следим за изменениями фильтров и поисковым запросом

    // Обработчик изменений фильтров
    const handleFilterChange = (updatedFilters) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...updatedFilters }));
        setPage(0); // Сбрасываем на первую страницу при изменении фильтров
    };

    // Обработчик изменения поискового запроса
    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setFilters((prevFilters) => ({ ...prevFilters, name: query }));
        setPage(0); // Сбрасываем на первую страницу при изменении поиска
    };

    // Переход на следующую страницу
    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // Переход на предыдущую страницу
    const handlePreviousPage = () => {
        if (page > 0) setPage((prevPage) => prevPage - 1);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
            <div style={{ flex: 1, marginLeft: '20px' }}>
                <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: '20px' }}>
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>

                {/* Элементы управления пагинацией */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
