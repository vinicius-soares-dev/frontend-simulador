import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        if (!userId) {
          navigate('/login');
          return;
        }

        const response = await fetch(`https://portalaeronauta.com/auth/usuarios/${userId}`);
        const userData = await response.json();
        
        if (userData.role === 'admin') {
          setIsAuthorized(true);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    verifyAdminAccess();
  }, [userId, navigate]);

  if (loading) {
    return <div className="p-4 text-center">Verificando permissões...</div>;
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/" replace />;
};

export default AdminRoute;