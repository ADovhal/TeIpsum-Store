import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { 
  fetchAdminProducts, 
  deleteAdminProduct, 
  bulkDeleteAdminProducts,
  setSelectedProducts,
  clearSelectedProducts,
  selectAdminProducts,
  selectAdminProductsLoading,
  selectAdminProductsError,
  selectAdminProductsPagination
} from '../features/admin/adminSlice';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const AdminContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const AdminHeader = styled.div`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
`;

const AddProductButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #e74c3c;
    transform: translateY(-2px);
  }
`;

const AdminBody = styled.div`
  padding: 30px;
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 10px 16px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ProductsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr 1fr 120px;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr 1fr 120px;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const ProductCategory = styled.span`
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
`;

const ProductPrice = styled.span`
  font-weight: 600;
  color: #e74c3c;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Star = styled.span`
  color: #f39c12;
  font-size: 14px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const EditButton = styled(ActionButton)`
  background: #3498db;
  color: white;

  &:hover {
    background: #2980b9;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #e74c3c;
  color: white;

  &:hover {
    background: #c0392b;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.active ? '#27ae60' : '#95a5a6'};
  color: white;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
  padding: 20px;
`;

const PaginationButton = styled.button`
  padding: 10px 16px;
  border: 2px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #3498db;
    color: white;
  }

  &:disabled {
    border-color: #bdc3c7;
    color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
`;

const AdminProductPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);
  const loading = useSelector(selectAdminProductsLoading);
  const error = useSelector(selectAdminProductsError);
  const { totalPages } = useSelector(selectAdminProductsPagination);
  
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    status: ''
  });
  const [page, setPage] = useState(0);
  const selectedProducts = useSelector((state) => state.admin.selectedProducts);

  useEffect(() => {
    document.title = "Admin - Product Management";
    dispatch(fetchAdminProducts({ page, size: 20, ...filters }));
  }, [dispatch, page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleEditProduct = (productId) => {
    console.log('Edit product:', productId);
    // TODO: Navigate to edit product page
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteAdminProduct(productId));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) {
      alert('Please select products first');
      return;
    }
    
    if (action === 'Delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
        dispatch(bulkDeleteAdminProducts(selectedProducts));
      }
    } else {
      console.log(`${action} products:`, selectedProducts);
      // TODO: Implement other bulk actions
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      dispatch(setSelectedProducts(products.map(p => p.id)));
    } else {
      dispatch(clearSelectedProducts());
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      dispatch(setSelectedProducts([...selectedProducts, productId]));
    } else {
      dispatch(setSelectedProducts(selectedProducts.filter(id => id !== productId)));
    }
  };



  return (
    <AdminContainer>
      <AdminContent>
        <AdminHeader>
          <HeaderTitle>Product Management</HeaderTitle>
          <AddProductButton onClick={() => console.log('Add new product')}>
            + Add Product
          </AddProductButton>
        </AdminHeader>

        <AdminBody>
          <FiltersSection>
            <FilterInput
              type="text"
              placeholder="Search products..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
            <FilterSelect
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Garden</option>
            </FilterSelect>
            <FilterSelect
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FilterSelect>
          </FiltersSection>

          {selectedProducts.length > 0 && (
            <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f4fd', borderRadius: '8px' }}>
              <strong>{selectedProducts.length} products selected</strong>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleBulkAction('Edit')} style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Edit Selected
                </button>
                <button onClick={() => handleBulkAction('Delete')} style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          <ProductsTable>
            <TableHeader>
              <div>
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                                     checked={selectedProducts.length === products.length && products.length > 0}
                />
              </div>
              <div>Product</div>
              <div>Price</div>
              <div>Rating</div>
              <div>Status</div>
              <div>Actions</div>
            </TableHeader>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>
                         ) : products.length > 0 ? (
               products.map((product) => (
                <TableRow key={product.id}>
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ProductImage src={product.imageUrl} alt={product.name} />
                    <ProductInfo>
                      <ProductName>{product.name}</ProductName>
                      <ProductCategory>{product.category}</ProductCategory>
                    </ProductInfo>
                  </div>
                  <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                  <ProductRating>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i}>
                        {i < Math.floor(product.rating) ? '★' : '☆'}
                      </Star>
                    ))}
                    <span style={{ marginLeft: '4px', fontSize: '12px' }}>({product.rating})</span>
                  </ProductRating>
                  <StatusBadge active={product.status === 'active'}>
                    {product.status}
                  </StatusBadge>
                  <ActionButtons>
                    <EditButton onClick={() => handleEditProduct(product.id)}>
                      Edit
                    </EditButton>
                    <DeleteButton onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </DeleteButton>
                  </ActionButtons>
                </TableRow>
              ))
            ) : (
              <EmptyState>
                <h3>No products found</h3>
                <p>Add some products to get started.</p>
              </EmptyState>
            )}
          </ProductsTable>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton 
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
              >
                Previous
              </PaginationButton>
              <PageInfo>
                Page {page + 1} of {totalPages}
              </PageInfo>
              <PaginationButton 
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </AdminBody>
      </AdminContent>
    </AdminContainer>
  );
};

export default AdminProductPage; 