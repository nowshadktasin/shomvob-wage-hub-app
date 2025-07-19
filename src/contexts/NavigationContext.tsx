import React, { createContext, useState, useContext } from "react";

interface NavigationContextType {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  navigationHistory: string[];
  addToHistory: (route: string) => void;
  goBack: () => string | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState("/ewa");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["/ewa"]);

  const addToHistory = (route: string) => {
    setNavigationHistory(prev => {
      // Avoid duplicate consecutive routes
      if (prev[prev.length - 1] === route) return prev;
      // Limit history to last 10 routes
      const newHistory = [...prev, route];
      return newHistory.slice(-10);
    });
  };

  const goBack = (): string | null => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current route
      const previousRoute = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentRoute(previousRoute);
      return previousRoute;
    }
    return null;
  };

  const handleSetCurrentRoute = (route: string) => {
    setCurrentRoute(route);
    addToHistory(route);
  };

  return (
    <NavigationContext.Provider value={{
      currentRoute,
      setCurrentRoute: handleSetCurrentRoute,
      navigationHistory,
      addToHistory,
      goBack
    }}>
      {children}
    </NavigationContext.Provider>
  );
};