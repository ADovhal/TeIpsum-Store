import React, { createContext, useState, useEffect } from 'react';

// Создаем контекст
export const ViewTypeContext = createContext();

// Создаем провайдер
export const ViewTypeProvider = ({ children }) => {
    const [viewMode, setViewMode] = useState('grid'); // Состояние для отображения

    // Загружаем сохраненный режим отображения при монтировании компонента
    useEffect(() => {
        const savedViewMode = localStorage.getItem('viewMode');
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    // Сохраняем текущий режим отображения в localStorage
    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    return (
        <ViewTypeContext.Provider value={{ viewMode, setViewMode }}>
            {children}
        </ViewTypeContext.Provider>
    );
};
