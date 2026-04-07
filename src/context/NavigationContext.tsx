import React, { createContext, useContext, useState, useCallback } from 'react';

type NavigationContextType = {
  goHome: () => void;
  homeSignal: number; // increments every time goHome() is called
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [homeSignal, setHomeSignal] = useState(0);

  const goHome = useCallback(() => {
    setHomeSignal(s => s + 1);
  }, []);

  return (
    <NavigationContext.Provider value={{ goHome, homeSignal }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};
