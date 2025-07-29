import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../features/profile/profileSlice';
import styled from 'styled-components';
import ProfileForm from '../features/profile/components/ProfileForm';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const ProfileContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 40px;
  text-align: center;
`;

const ProfileTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
`;

const ProfileSubtitle = styled.p`
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ecf0f1;
  background: #f8f9fa;
`;

const Tab = styled.button`
  flex: 1;
  padding: 20px;
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#3498db' : 'transparent'};
  color: ${props => props.active ? '#3498db' : '#7f8c8d'};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'white' : '#ecf0f1'};
    color: #3498db;
  }
`;

const TabContent = styled.div`
  padding: 40px;
  min-height: 400px;
`;

const OrderHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  border: 1px solid #ecf0f1;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ecf0f1;
`;

const OrderNumber = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

const OrderDate = styled.span`
  color: #7f8c8d;
  font-size: 14px;
`;

// const OrderStatus = styled.span`
//   padding: 4px 12px;
//   border-radius: 20px;
//   font-size: 12px;
//   font-weight: 600;
//   text-transform: uppercase;
//   background: ${props => {
//     switch (props.status) {
//       case 'delivered': return '#27ae60';
//       case 'shipped': return '#3498db';
//       case 'processing': return '#f39c12';
//       default: return '#95a5a6';
//     }
//   }};
//   color: white;
// `;

const OrderStatus = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ status }) => (
    status === 'delivered' ? '#27ae60' :
    status === 'shipped' ? '#3498db' :
    status === 'processing' ? '#f39c12' :
    '#95a5a6'
  )};
  color: white;
`;

const OrderTotal = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const AdminPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AdminSection = styled.div`
  border: 1px solid #ecf0f1;
  border-radius: 12px;
  padding: 24px;
  background: #f8f9fa;
`;

const AdminSectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 8px;
`;

const AdminButton = styled.button`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 12px;
  margin-bottom: 12px;

  &:hover {
    background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(231, 76, 60, 0.3);
  }
`;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  // const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);
  // const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Profile - TeIpsum";
    //  dispatch(loadProfile()); dispatch // , profileData if(!profileData)
  }, []);

  // Mock order history data
  const orderHistory = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 129.99,
      items: ['Product 1', 'Product 2']
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 89.50,
      items: ['Product 3']
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      date: '2024-01-25',
      status: 'processing',
      total: 199.99,
      items: ['Product 4', 'Product 5', 'Product 6']
    }
  ];

  const isAdmin = profileData?.roles?.some(role => role.name === 'ADMIN');

  const renderProfileTab = () => (
    <ProfileForm />
  );

  const renderOrderHistoryTab = () => (
    <OrderHistoryContainer>
      {orderHistory.length > 0 ? (
        orderHistory.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <div>
                <OrderNumber>{order.orderNumber}</OrderNumber>
                <OrderDate>{new Date(order.date).toLocaleDateString()}</OrderDate>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <OrderStatus status={order.status}>
                  {String(order.status)}
                </OrderStatus>
                <OrderTotal>${order.total.toFixed(2)}</OrderTotal>
              </div>
            </OrderHeader>
            <div>
              <strong>Items:</strong> {order.items.join(', ')}
            </div>
          </OrderCard>
        ))
      ) : (
        <EmptyState>
          <EmptyStateIcon>📦</EmptyStateIcon>
          <h3>No orders yet</h3>
          <p>Start shopping to see your order history here.</p>
        </EmptyState>
      )}
    </OrderHistoryContainer>
  );

  const renderAdminPanelTab = () => (
    <AdminPanelContainer>
      <AdminSection>
        <AdminSectionTitle>Product Management</AdminSectionTitle>
        <AdminButton onClick={() => navigate('/admin/products')}>
          Manage Products
        </AdminButton>
        <AdminButton onClick={() => console.log('Navigate to add product')}>
          Add New Product
        </AdminButton>
        <AdminButton onClick={() => console.log('Navigate to categories')}>
          Manage Categories
        </AdminButton>
      </AdminSection>

      <AdminSection>
        <AdminSectionTitle>User Management</AdminSectionTitle>
        <AdminButton onClick={() => console.log('Navigate to user management')}>
          Manage Users
        </AdminButton>
        <AdminButton onClick={() => console.log('Navigate to create admin')}>
          Create Admin User
        </AdminButton>
        <AdminButton onClick={() => console.log('Navigate to roles')}>
          Manage Roles
        </AdminButton>
      </AdminSection>

      <AdminSection>
        <AdminSectionTitle>Order Management</AdminSectionTitle>
        <AdminButton onClick={() => console.log('Navigate to all orders')}>
          View All Orders
        </AdminButton>
        <AdminButton onClick={() => console.log('Navigate to analytics')}>
          Sales Analytics
        </AdminButton>
        <AdminButton onClick={() => console.log('Navigate to reports')}>
          Generate Reports
        </AdminButton>
      </AdminSection>
    </AdminPanelContainer>
  );

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileHeader>
          <ProfileTitle>My Profile</ProfileTitle>
          <ProfileSubtitle>
            Welcome back, {profileData?.firstName || 'User'}!
          </ProfileSubtitle>
        </ProfileHeader>

        <TabContainer>
          <Tab 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </Tab>
          <Tab 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </Tab>
          {isAdmin && (
            <Tab 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')}
            >
              Admin Panel
            </Tab>
          )}
        </TabContainer>

        <TabContent>
          {activeTab === 'profile' ? renderProfileTab() : null}
          {activeTab === 'orders' ? renderOrderHistoryTab() : null}
          {activeTab === 'admin' && isAdmin ? renderAdminPanelTab() : null}
        </TabContent>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default ProfilePage;