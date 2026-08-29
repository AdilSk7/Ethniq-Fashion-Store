import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToStoreSettings, defaultStoreSettings } from '../services/storeService';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState(defaultStoreSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToStoreSettings((settings) => {
      setStoreSettings(settings);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <StoreContext.Provider value={{ storeSettings, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
