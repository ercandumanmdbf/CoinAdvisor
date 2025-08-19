// Sabit locale kullanarak hydration sorununu önle
const LOCALE = "en-US";

export const usd = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const num = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Tarih formatlaması için güvenli fonksiyon
export const formatTime = (date: Date | null): string => {
  if (!date) return "";
  
  try {
    return date.toLocaleTimeString(LOCALE, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return date.toISOString();
  }
};

// Güvenli sayı formatlama fonksiyonları
export const safeNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const safeFormat = (value: unknown, digits = 2): string => {
  return safeNumber(value, 0).toFixed(digits);
};

export const safeUsd = (value: unknown): string => {
  return usd.format(safeNumber(value, 0));
};

export const safePercent = (value: unknown, digits = 2): string => {
  return `${safeFormat(value, digits)}%`;
};


