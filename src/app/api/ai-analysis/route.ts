import { NextRequest, NextResponse } from "next/server";
import { fetchSimplePrices } from "@/lib/coinGecko";

export async function POST(request: NextRequest) {
  try {
    const { coin, portfolioItems, recommendations } = await request.json();

    // Güvenli formatlayıcılar
    const toNumber = (v: unknown, fallback = 0): number => {
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    };

    const fmt = (v: unknown, digits = 2): string => toNumber(v).toFixed(digits);
    const usd = (v: unknown): string => `$${toNumber(v).toFixed(2)}`;

    // Simüle edilmiş AI analizi
    let analysis = "";

    if (coin) {
      // Belirli bir coin için detaylı analiz
      const current = toNumber(coin.current_price);
      const p24h = toNumber(coin.price_change_percentage_24h);
      const p7d = toNumber(coin.price_change_percentage_7d);
      const volume = toNumber(coin.total_volume);
      const marketCap = toNumber(coin.market_cap);
      const ath = toNumber(coin.ath) || current;
      const volatility = Math.abs(p24h);
      
      analysis = `🤖 **${coin.name} (${coin.symbol}) AI Analizi:**

📊 **Teknik Analiz:**
• Mevcut fiyat: $${fmt(current, 4)}
• 24s değişim: ${fmt(p24h, 2)}%
• 7g değişim: ${fmt(p7d, 2)}%
• Piyasa değeri: $${fmt(marketCap / 1e9, 2)}B
• 24s hacim: $${fmt(volume / 1e6, 2)}M

🎯 **AI Önerileri:**
• Kısa vadeli hedef: $${fmt(current * 1.05, 4)}
• Orta vadeli hedef: $${fmt(current * 1.15, 4)}
• Stop-loss seviyesi: $${fmt(current * 0.92, 4)}

💡 **Yapay Zeka Görüşü:**
${p24h > 0 ? 
  `📈 Pozitif momentum devam ediyor. ${volatility > 10 ? 'Yüksek volatilite' : 'Stabil hareket'} gözlemleniyor.` :
  `📉 Kısa vadeli düzeltme bekleniyor. ${volatility > 10 ? 'Aşırı satış' : 'Normal düzeltme'} sinyali.`
}

⚠️ **Risk Değerlendirmesi:**
• Volatilite: ${volatility > 10 ? "Yüksek" : volatility > 5 ? "Orta" : "Düşük"}
• Likidite: ${volume > 1e9 ? "Çok İyi" : volume > 5e8 ? "İyi" : "Dikkat"}
• Trend: ${p7d > 0 ? "Yükseliş" : "Düşüş"}
• ATH'den uzaklık: ${fmt((current / ath) * 100, 1)}%

🔮 **Gelecek Tahmini:**
${p24h > 5 ? 
  "Güçlü momentum ile yükseliş devam edebilir. Kar realizasyonu için hazır olun." :
  p24h < -5 ?
  "Düşüş trendi devam edebilir. Stop-loss seviyelerine dikkat edin." :
  "Yatay hareket bekleniyor. Breakout için bekleyin."
}`;
    } else {
      // Genel portföy analizi
      const totalItems = portfolioItems?.length || 0;
      // Fiyatı olmayanlar için CoinGecko'dan basit fiyat çek
      const recIds = new Set((recommendations || []).map((r: any) => r.coin.id));
      const missingIds = (portfolioItems || [])
        .map((i: any) => i.id)
        .filter((id: string) => !!id && !recIds.has(id));
      let simplePrices: Record<string, number> = {};
      if (missingIds.length > 0) {
        try {
          simplePrices = await fetchSimplePrices(missingIds);
        } catch {
          simplePrices = {};
        }
      }

      const enriched = (portfolioItems || [])
        .map((item: any) => {
          const rec = (recommendations || []).find((r: any) => r.coin.id === item.id);
          const price = rec ? toNumber(rec.coin.current_price) : toNumber(simplePrices[item.id]);
          const amount = toNumber(item.amount);
          const avg = toNumber(item.averageCost);
          const est = amount * price;
          const cost = amount * avg;
          const pnl = est - cost;
          const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
          return {
            id: item.id,
            symbol: item.symbol,
            name: item.name,
            amount,
            averageCost: avg,
            price,
            est,
            cost,
            pnl,
            pnlPct,
          };
        })
        .sort((a: any, b: any) => b.est - a.est);

      const totalValue = enriched.reduce((sum: number, r: any) => sum + r.est, 0);
      const totalCost = enriched.reduce((sum: number, r: any) => sum + r.cost, 0);
      const totalPnl = totalValue - totalCost;

      analysis = `🤖 **Genel Portföy AI Analizi:**

📈 **Portföy Durumu:**
• Toplam varlık: ${totalItems} coin
• Toplam maliyet: ${usd(totalCost)}
• Tahmini değer: ${usd(totalValue)}
• Toplam Kar/Zarar: ${usd(totalPnl)} (${totalCost > 0 ? fmt((totalPnl / totalCost) * 100, 2) : "0.00"}%)
• En büyük pozisyon: ${totalItems > 0 ? enriched[0]?.name : "Yok"}

📦 **Pozisyonlar:**
${enriched.length === 0 ? "- (Boş)" : enriched.map((r: any) => `• ${r.symbol.toUpperCase()}: ${fmt(r.amount, 4)} adet @ ${usd(r.averageCost)} → Değer: ${usd(r.est)} | PnL: ${usd(r.pnl)} (${fmt(r.pnlPct, 2)}%)`).join("\n")}

🎯 **AI Önerileri:**
• Çeşitlendirme: ${totalItems < 5 ? "Daha fazla coin ekleyin (5-10 arası ideal)" : "İyi çeşitlendirme"}
• Risk dağılımı: ${totalItems > 0 ? "Portföyünüzü düzenli olarak gözden geçirin" : "İlk coininizi ekleyin"}
• Stop-loss: Tüm pozisyonlar için stop-loss belirleyin

💡 **Piyasa Görünümü:**
• Bitcoin dominance: Yüksek (%45+)
• Altcoin sezonu: Başlangıç aşamasında
• Genel trend: Pozitif (bull market)
• Volatilite: Orta-yüksek

⚠️ **Risk Yönetimi:**
• Stop-loss kullanımı: Her pozisyon için %5-10
• Kar realizasyonu: %20-30 aralığında
• Portföy dengeleme: Aylık yapılmalı
• DCA (Dollar Cost Averaging): Önerilen

🚀 **Önerilen Aksiyonlar:**
${totalItems === 0 ? 
  "1. İlk coininizi ekleyin (BTC veya ETH ile başlayın)\n2. Küçük miktarlarla başlayın\n3. Risk yönetimi kuralları belirleyin" :
  totalItems < 3 ?
  "1. Portföyünüzü çeşitlendirin\n2. Farklı sektörlerden coinler ekleyin\n3. Stop-loss seviyeleri belirleyin" :
  "1. Mevcut pozisyonları gözden geçirin\n2. Kar realizasyonu yapın\n3. Yeni fırsatları değerlendirin"
}`;
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate AI analysis" },
      { status: 500 }
    );
  }
}
