import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { loadUserOrders, loadOrderDetails } from '../orderSlice';

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderItem = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid ${props => props.isOpen ? '#3498db' : '#ecf0f1'};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const OrderButton = styled.button`
  width: 100%;
  padding: 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
`;

const OrderNumber = styled.span`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
`;

const OrderDate = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const OrderStatus = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ status }) => {
    switch (status) {
      case 'delivered': return '#27ae60';
      case 'shipped': return '#3498db';
      case 'processing': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const OrderTotal = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #e74c3c;
`;

const ToggleIcon = styled(motion.span)`
  font-size: 1.5rem;
  color: #3498db;
  font-weight: bold;
  margin-left: 10px;
`;

const DetailsContainer = styled(motion.div)`
  overflow: hidden;
`;

const OrderDetails = styled.div`
  padding: 20px;
  border-top: 1px solid #ecf0f1;
  background: #f8f9fa;
`;

const DetailSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ecf0f1;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #7f8c8d;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #2c3e50;
  font-weight: 600;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OrderItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const ItemDetails = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ItemPrice = styled.span`
  color: #e74c3c;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background: #ffeaa7;
  color: #856404;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f39c12;
`;

const OrdersListComponent = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { orders, orderDetails, isLoading, error } = useSelector((state) => state.orders);
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    dispatch(loadUserOrders());
  }, [dispatch]);

  const toggleItem = (orderId) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(orderId)) {
      newOpenItems.delete(orderId);
    } else {
      newOpenItems.add(orderId);
      // Load order details if not already loaded
      if (!orderDetails[orderId]) {
        dispatch(loadOrderDetails(orderId));
      }
    }
    setOpenItems(newOpenItems);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'processing': t('processing') || 'Processing',
      'shipped': t('shipped') || 'Shipped',
      'delivered': t('delivered') || 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  if (isLoading && orders.length === 0) {
    return (
      <OrdersContainer>
        <LoadingSpinner>
          {t('loading')}...
        </LoadingSpinner>
      </OrdersContainer>
    );
  }

  if (error) {
    return (
      <OrdersContainer>
        <ErrorMessage>
          {error}
        </ErrorMessage>
      </OrdersContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <OrdersContainer>
        <EmptyState>
          <EmptyIcon>📦</EmptyIcon>
          <h3>{t('noOrdersYet') === 'Ще немає замовлень' ? 'У вас ще немає замовлень' : t('noOrdersYet')}</h3>
          <p>{t('startShopping')}</p>
        </EmptyState>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <OrdersList>
        <AnimatePresence>
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              isOpen={openItems.has(order.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OrderButton onClick={() => toggleItem(order.id)}>
                <OrderHeader>
                  <OrderInfo>
                    <OrderNumber>#{order.orderNumber || order.id}</OrderNumber>
                    <OrderDate>{formatDate(order.createdAt || order.orderDate)}</OrderDate>
                    <OrderStatus status={order.status}>
                      {getStatusText(order.status)}
                    </OrderStatus>
                  </OrderInfo>
                  <OrderTotal>
                    ${(order.totalAmount || order.total || 0).toFixed(2)}
                  </OrderTotal>
                </OrderHeader>
                <ToggleIcon
                  animate={{ rotate: openItems.has(order.id) ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </ToggleIcon>
              </OrderButton>
              
              <AnimatePresence>
                {openItems.has(order.id) && (
                  <DetailsContainer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OrderDetails>
                      {orderDetails[order.id] ? (
                        <>
                          <DetailSection>
                            <SectionTitle>{t('orderInformation') || 'Order Information'}</SectionTitle>
                            <DetailRow>
                              <DetailLabel>{t('orderNumber')}:</DetailLabel>
                              <DetailValue>#{orderDetails[order.id].orderNumber}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailLabel>{t('orderDate')}:</DetailLabel>
                              <DetailValue>{formatDate(orderDetails[order.id].createdAt)}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailLabel>{t('orderStatus')}:</DetailLabel>
                              <DetailValue>{getStatusText(orderDetails[order.id].status)}</DetailValue>
                            </DetailRow>
                            {orderDetails[order.id].trackingNumber && (
                              <DetailRow>
                                <DetailLabel>Tracking Number:</DetailLabel>
                                <DetailValue>{orderDetails[order.id].trackingNumber}</DetailValue>
                              </DetailRow>
                            )}
                          </DetailSection>

                          {orderDetails[order.id].items && (
                            <DetailSection>
                              <SectionTitle>{t('items')} ({orderDetails[order.id].items.length})</SectionTitle>
                              <ItemsList>
                                {orderDetails[order.id].items.map((item, index) => (
                                  <OrderItemCard key={index}>
                                    {item.image && (
                                      <ItemImage src={item.image} alt={item.name} />
                                    )}
                                    <ItemInfo>
                                      <ItemName>{item.name || item.productName}</ItemName>
                                      <ItemDetails>
                                        Size: {item.size} | Qty: {item.quantity}
                                      </ItemDetails>
                                      <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
                                    </ItemInfo>
                                  </OrderItemCard>
                                ))}
                              </ItemsList>
                            </DetailSection>
                          )}

                          <DetailSection>
                            <SectionTitle>{t('orderSummary')}</SectionTitle>
                            <DetailRow>
                              <DetailLabel>Subtotal:</DetailLabel>
                              <DetailValue>${(orderDetails[order.id].subtotal || 0).toFixed(2)}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailLabel>{t('shipping')}:</DetailLabel>
                              <DetailValue>${(orderDetails[order.id].shippingCost || 0).toFixed(2)}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailLabel>{t('tax')}:</DetailLabel>
                              <DetailValue>${(orderDetails[order.id].tax || 0).toFixed(2)}</DetailValue>
                            </DetailRow>
                            <DetailRow style={{ borderTop: '2px solid #3498db', paddingTop: '10px', fontWeight: 'bold' }}>
                              <DetailLabel>{t('total')}:</DetailLabel>
                              <DetailValue>${(orderDetails[order.id].totalAmount || 0).toFixed(2)}</DetailValue>
                            </DetailRow>
                          </DetailSection>
                        </>
                      ) : (
                        <LoadingSpinner>
                          Loading order details...
                        </LoadingSpinner>
                      )}
                    </OrderDetails>
                  </DetailsContainer>
                )}
              </AnimatePresence>
            </OrderItem>
          ))}
        </AnimatePresence>
      </OrdersList>
    </OrdersContainer>
  );
};

export default OrdersListComponent;