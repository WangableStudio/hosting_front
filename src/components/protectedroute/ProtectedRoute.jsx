import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { isAdmin, isAuditor } = useContext(UserContext);
    if (!isAdmin && !isAuditor) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;