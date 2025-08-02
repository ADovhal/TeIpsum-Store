import apiOrder from '../../services/apiOrder';

export const getMyOrders = () => apiOrder.get('/orders/my').then(res => res.data.orders || []);
export const getOrderById = (orderId) => apiOrder.get(`/orders/${orderId}`).then(res => res.data);