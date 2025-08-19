import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Client-side kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load - sadece client-side
  useEffect(() => {
    if (!isClient) return;

    try {
      const raw = localStorage.getItem(key);
      if (raw != null) {
        const parsed = JSON.parse(raw);
        setValue(parsed);
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    }
  }, [key, isClient]);

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    if (!isClient) return;
    
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }, [key, value, isClient]);

  const update = useCallback((updater: (prev: T) => T) => {
    if (!isClient) return;
    
    try {
      const newValue = updater(value);
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  }, [key, value, isClient]);

  // Sunucu tarafında initialValue döndür, client tarafında gerçek değer
  return { 
    value: isClient ? value : initialValue, 
    setValue: setStoredValue, 
    update,
    isClient 
  } as const;
}


