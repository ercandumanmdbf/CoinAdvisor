import { useLocalStorage } from "./useLocalStorage";
import { PortfolioItem } from "@/lib/types";

const STORAGE_KEY = "portfolio_items_v1";

export function usePortfolio() {
  const { value: items, setValue, update, isClient } = useLocalStorage<PortfolioItem[]>(STORAGE_KEY, []);

  const add = (item: PortfolioItem) => {
    if (!isClient) return;
    
    update((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        // Mevcut item'ı güncelle
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      } else {
        // Yeni item ekle
        return [...prev, item];
      }
    });
  };

  const remove = (id: string) => {
    if (!isClient) return;
    
    update((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAmount = (id: string, amount: number) => {
    if (!isClient) return;
    
    update((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount } : item
      )
    );
  };

  const updateAverageCost = (id: string, averageCost: number) => {
    if (!isClient) return;
    
    update((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, averageCost } : item
      )
    );
  };

  const clear = () => {
    if (!isClient) return;
    
    setValue([]);
  };

  const ids = items.map((item) => item.id);

  return {
    items,
    ids,
    add,
    remove,
    updateAmount,
    updateAverageCost,
    clear,
    isClient,
  };
}


