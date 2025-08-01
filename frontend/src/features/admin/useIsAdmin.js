import { useSelector } from 'react-redux';

export default function useIsAdmin() {
  const roles = useSelector(state => state.auth.roles);
  return roles.includes('ADMIN');
}