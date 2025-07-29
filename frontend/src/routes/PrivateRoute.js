import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ element: Element }) {
  const isAuth = useSelector(s => s.auth.isAuthenticated);
//   const profile = useSelector(s => s.profile.profileData);
//   const loadingProfile = useSelector(s => s.profile.isLoading);

  if (!isAuth) return <Navigate to="/login" />;
//   if (loadingProfile || profile === null) return <div>Loading profile…</div>;

  return <Element />;
}

// export default function PrivateRoute({ element: Element }) {
//   const isAuth = useSelector(s => s.auth.isAuthenticated);
//   return isAuth ? <Element /> : <Navigate to="/login" />;
// }