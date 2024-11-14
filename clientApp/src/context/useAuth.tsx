// src/hooks/useAuth.ts
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return ({props}: { props: any }) => {
        const { isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isAuthenticated) {
                router.push('/user').then(() => {});
            }
        }, [isAuthenticated, router]);

        if (!isAuthenticated) {
            return null; // Render nothing while redirecting
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
