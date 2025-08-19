import { Coin, Recommendation, Targets } from "./types";

export function calculateTargets(coin: Coin): Targets {
  const currentPrice = coin.current_price;
  
  // Kısa vadeli hedef: %15 artış
  const shortTarget = currentPrice * 1.15;
  
  // Orta vadeli hedef: %30 artış
  const midTarget = currentPrice * 1.30;
  
  // Stop loss: %10 düşüş
  const stopLoss = currentPrice * 0.90;
  
  return {
    shortTarget,
    midTarget,
    stopLoss,
  };
}

export function calculateScore(coin: Coin): number {
  let score = 0;
  
  // 24 saatlik değişim
  if (coin.price_change_percentage_24h > 0) {
    score += Math.min(coin.price_change_percentage_24h * 2, 20);
  }
  
  // 7 günlük değişim
  if (coin.price_change_percentage_7d > 0) {
    score += Math.min(coin.price_change_percentage_7d, 15);
  }
  
  // 30 günlük değişim
  if (coin.price_change_percentage_30d > 0) {
    score += Math.min(coin.price_change_percentage_30d * 0.5, 10);
  }
  
  // Market cap büyüklüğü (daha büyük = daha stabil)
  if (coin.market_cap > 1000000000) { // 1B+
    score += 10;
  } else if (coin.market_cap > 100000000) { // 100M+
    score += 5;
  }
  
  // Hacim analizi
  const volumeToMarketCap = coin.total_volume / coin.market_cap;
  if (volumeToMarketCap > 0.1) {
    score += 5;
  }
  
  // ATH'ye yakınlık (daha uzak = daha fazla potansiyel)
  const athDistance = (coin.ath - coin.current_price) / coin.ath;
  if (athDistance > 0.5) {
    score += 10;
  } else if (athDistance > 0.3) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

export function generateRationale(coin: Coin): string[] {
  const reasons: string[] = [];
  
  if (coin.price_change_percentage_24h > 5) {
    reasons.push("24s güçlü momentum");
  }
  
  if (coin.price_change_percentage_7d > 10) {
    reasons.push("Haftalık trend pozitif");
  }
  
  if (coin.market_cap > 1000000000) {
    reasons.push("Büyük market cap");
  }
  
  if (coin.total_volume / coin.market_cap > 0.1) {
    reasons.push("Yüksek işlem hacmi");
  }
  
  const athDistance = (coin.ath - coin.current_price) / coin.ath;
  if (athDistance > 0.5) {
    reasons.push("ATH'den uzak");
  }
  
  if (reasons.length === 0) {
    reasons.push("Teknik analiz pozitif");
  }
  
  return reasons;
}

export function createRecommendation(coin: Coin): Recommendation {
  const score = calculateScore(coin);
  const targets = calculateTargets(coin);
  const rationale = generateRationale(coin);
  
  return {
    coin,
    score,
    targets,
    rationale,
    timestamp: new Date().toISOString(), // Öneri yapıldığı zaman
  };
}


