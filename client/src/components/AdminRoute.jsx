import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AdminRoute({ children }) {
  const { auth } = useApp();
  const location = useLocation();

  if (!auth?.user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (auth.user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
