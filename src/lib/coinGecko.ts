import { Coin, PriceMap } from "@/lib/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function getMarketData(perPage: number = 100): Promise<Coin[]> {
  const url = new URL(`${COINGECKO_BASE}/coins/markets`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "false");
  url.searchParams.set("price_change_percentage", "1h,24h,7d,30d,1y");

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`CoinGecko markets error: ${res.status}`);
  }
  const data = (await res.json()) as Array<{
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
  }>;

  return data.map((d) => ({
    id: d.id,
    symbol: d.symbol,
    name: d.name,
    image: d.image,
    current_price: d.current_price,
    market_cap: d.market_cap,
    total_volume: d.total_volume,
    price_change_percentage_24h: d.price_change_percentage_24h,
    price_change_percentage_7d: d.price_change_percentage_7d,
    price_change_percentage_30d: d.price_change_percentage_30d,
    price_change_percentage_1y: d.price_change_percentage_1y,
    ath: d.ath,
    ath_change_percentage: d.ath_change_percentage,
    atl: d.atl,
    atl_change_percentage: d.atl_change_percentage,
    circulating_supply: d.circulating_supply,
    total_supply: d.total_supply,
    max_supply: d.max_supply,
  }));
}

export async function fetchSimplePrices(ids: string[]): Promise<PriceMap> {
  if (ids.length === 0) return {};
  const url = new URL(`${COINGECKO_BASE}/simple/price`);
  url.searchParams.set("ids", ids.join(","));
  url.searchParams.set("vs_currencies", "usd");

  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) {
    throw new Error(`CoinGecko price error: ${res.status}`);
  }
  const data = (await res.json()) as Record<string, { usd: number }>;
  const map: PriceMap = {};
  for (const [key, value] of Object.entries(data)) {
    map[key] = value.usd;
  }
  return map;
}


