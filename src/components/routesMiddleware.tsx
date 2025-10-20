import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store'; 
interface Props {
  children: React.ReactNode;
}

const routesMiddleware: React.FC<Props> = ({ children }) => {
  const token = useSelector((state: RootState) => state.login.token);

  if (!token) {
    return <Navigate to="/MonitoriaJa/login" replace />;
  }

  return <>{children}</>;
};

export default routesMiddleware;
