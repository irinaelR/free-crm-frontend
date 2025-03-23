// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectPath?: string;
}

const AuthorizedRoute: React.FC<ProtectedRouteProps> = ({
                                                           children,
                                                           redirectPath = '/'
                                                       }) => {
    const isAuthenticated = localStorage.getItem('accessToken') !== null;

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default AuthorizedRoute;