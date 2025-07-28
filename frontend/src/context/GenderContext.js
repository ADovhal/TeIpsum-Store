import React, { createContext, useContext, useState } from 'react';

const GenderContext = createContext();

export const useGender = () => {
  const context = useContext(GenderContext);
  if (!context) {
    throw new Error('useGender must be used within a GenderProvider');
  }
  return context;
};

export const GenderProvider = ({ children }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const value = {
    selectedGender,
    setSelectedGender,
    clearGender: () => setSelectedGender(null)
  };

  return (
    <GenderContext.Provider value={value}>
      {children}
    </GenderContext.Provider>
  );
}; 