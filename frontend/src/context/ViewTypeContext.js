import React, { createContext, useState, useEffect } from 'react';

export const ViewTypeContext = createContext();

export const ViewTypeProvider = ({ children }) => {
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const savedViewMode = localStorage.getItem('viewMode');
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    return (
        <ViewTypeContext.Provider value={{ viewMode, setViewMode }}>
            {children}
        </ViewTypeContext.Provider>
    );
};
