export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  price_change_percentage_1y: number;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
}

export interface Targets {
  shortTarget: number;
  midTarget: number;
  stopLoss: number;
}

export interface Recommendation {
  coin: Coin;
  score: number;
  targets: Targets;
  rationale: string[];
  timestamp: string; // Öneri yapıldığı zaman
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  averageCost: number;
}

export type PriceMap = Record<string, number>; // coinId -> price in USD


