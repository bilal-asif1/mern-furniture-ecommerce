import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AdminRoute({ children }) {
  const { auth } = useApp();
  const location = useLocation();

  if (auth?.status === 'checking') {
    return (
      <div className="grid min-h-[40vh] place-items-center px-4 py-12 text-sm text-text/60">
        Checking your admin session...
      </div>
    );
  }

  if (!auth?.user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (auth.user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
