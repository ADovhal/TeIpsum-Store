import { Navigate } from 'react-router-dom';
import useIsAdmin from '../useIsAdmin';

export default function AdminProtectedRoute({ children }) {
  const isAdmin = useIsAdmin();
  return isAdmin ? children : <Navigate to="/login" replace />;
}