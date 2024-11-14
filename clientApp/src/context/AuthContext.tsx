// src/context/AuthContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthStatus, login, logout } from '../utils/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    handleLogin: (token: string, expiryDate: string) => void;
    handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const { isAuthenticated } = getAuthStatus();
        setIsAuthenticated(isAuthenticated);
    }, []);

    const handleLogin = (token: string, expiryDate: string) => {
        login(token, expiryDate);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
    };

    const isAuthenticated = getAuthStatus().isAuthenticated;

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};