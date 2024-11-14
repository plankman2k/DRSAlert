// src/hooks/useAuth.ts
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return ({props}: { props: any }) => {
        const { isAuthenticated } = useAuth();

        useEffect(() => {
            if (!isAuthenticated) {
                window.location.reload();
                window.location.href = '/user';
            }
        }, [isAuthenticated]);

        if (!isAuthenticated) {
            return null; // Render nothing while redirecting
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
