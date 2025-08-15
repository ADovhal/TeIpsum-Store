import { Routes, Route } from 'react-router-dom';
import AdminProtectedRoute from '../features/admin/components/AdminProtectedRoute';
// import AdminProductListPage from '../pages/admin/AdminProductListPage';
import AdminProductCreatePage from '../pages/admin/AdminProductCreatePage';
// import AdminProductEditPage from '../pages/admin/AdminProductEditPage';
import AdminUserManagementPage from '../pages/admin/AdminUserManagementPage';

export default function AdminRoutes() {
  return (
    <AdminProtectedRoute>
      <Routes>
        {/* <Route path="products" element={<AdminProductListPage />} /> */}
        <Route path="products/new" element={<AdminProductCreatePage />} />
        {/* <Route path="products/:id/edit" element={<AdminProductEditPage />} /> */}
        <Route path="users" element={<AdminUserManagementPage />} />
      </Routes>
    </AdminProtectedRoute>
  );
}