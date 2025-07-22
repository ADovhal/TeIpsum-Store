// src/context/HeaderHeightContext.js
import { createContext, useState } from 'react';

export const HeaderHeightContext = createContext({
  headerHeight: 0,
  setHeaderHeight: () => {},
});

export const HeaderHeightProvider = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  
  return (
    <HeaderHeightContext.Provider value={{ headerHeight, setHeaderHeight }}>
      {children}
    </HeaderHeightContext.Provider>
  );
};

export default HeaderHeightContext;