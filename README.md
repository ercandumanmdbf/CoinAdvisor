# Borsa Advisor

A Next.js application that recommends potentially rising assets in the cryptocurrency market and provides portfolio tracking.

Kripto piyasasında yükselmesi muhtemel varlıkları öneren ve portföy takibi yapan bir Next.js uygulaması.

## Features / Özellikler

- **Recommendations**: Coin list scored with CoinGecko market data (short/mid targets and stop-loss).
- **Portfolio**: Add recommended coins to portfolio; enter amount and cost; real-time Profit/Loss (PnL) with live prices.
- **Live Prices**: Periodic (15s) price updates for coins in portfolio.
- **Persistent Storage**: Portfolio data stored locally via `localStorage`.

- **Öneriler**: CoinGecko piyasa verileri ile skorlanan coin listesi (kısa/orta hedef ve stop-loss).
- **Portföy**: Önerilen coinleri portföye ekleme; miktar, maliyet girme; canlı fiyatla anlık Kar/Zarar (PnL).
- **Canlı Fiyatlar**: Portföydeki coin'ler için periyodik (15s) fiyat güncellemesi.
- **Kalıcı Saklama**: Portföy verileri `localStorage` üzerinden cihazda saklanır.

## Technology / Teknoloji

- Next.js 15, TypeScript, Tailwind CSS
- API data source: CoinGecko (no key required)

- Next.js 15, TypeScript, Tailwind CSS
- API veri kaynağı: CoinGecko (anahtar gerektirmez)

---

## Installation / Kurulum

Prerequisites: Node.js 18+ and npm.
Önkoşullar: Node.js 18+ ve npm.

```bash
npm install
npm run dev
# http://localhost:3000
```

Production build:
Prod build:

```bash
npm run build
npm run start
```

### Environment Variables / Çevre Değişkenleri

`web/.env.local`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> Note: This value is automatically written in development environment; update with your domain name in deployment.
> Not: Geliştirme ortamında bu değer otomatik yazılır; dağıtımda kendi alan adınızla güncelleyin.

### Image Domains / Görsel Alan Adları

Coin images are configured in `next.config.ts` with allowed domains:
Coin görselleri için `next.config.ts` içinde izinli alan adları tanımlıdır:

- `assets.coingecko.com`
- `coin-images.coingecko.com`

Add new domains here if needed and restart the dev server.
Gerekirse yeni alan adlarını buraya ekleyin ve dev sunucusunu yeniden başlatın.

---

## Directory Structure / Dizin Yapısı

```
src/
  app/                 # Next.js App Router pages and API routes
    api/
      recommendations/route.ts  # Recommendations API
      prices/route.ts           # Prices API (POST)
    recommendations/page.tsx    # Recommendations page (Client component)
    portfolio/page.tsx          # Portfolio page (Client component)
  components/
    RecommendationCard.tsx
    PortfolioTable.tsx
  hooks/
    useLocalStorage.ts
    usePortfolio.ts
  lib/
    coinGecko.ts      # CoinGecko client
    recommendation.ts # Scoring and target generation
    types.ts
    format.ts         # Consistent number/currency formatting
```

```
src/
  app/                 # Next.js App Router sayfaları ve API route'ları
    api/
      recommendations/route.ts  # Öneri API
      prices/route.ts           # Fiyat API (POST)
    recommendations/page.tsx    # Öneriler sayfası (Client bileşen)
    portfolio/page.tsx          # Portföy sayfası (Client bileşen)
  components/
    RecommendationCard.tsx
    PortfolioTable.tsx
  hooks/
    useLocalStorage.ts
    usePortfolio.ts
  lib/
    coinGecko.ts      # CoinGecko istemcisi
    recommendation.ts # Skorlama ve hedef üretimi
    types.ts
    format.ts         # Tutarlı sayı/para formatları
```

---

## APIs / API'ler

- GET `/api/recommendations`
  - Description: Fetches first N coins from market, scores them, generates targets.
  - Açıklama: Piyasadan ilk N coini çekip skorlama yapar, hedefler üretir.
  - Example response fields: `coin`, `score`, `targets { shortTarget, midTarget, stopLoss }`, `rationale[]`.
  - Örnek yanıt alanları: `coin`, `score`, `targets { shortTarget, midTarget, stopLoss }`, `rationale[]`.

- POST `/api/prices`
  - Body: `{ ids: string[] }` (CoinGecko `id` list)
  - Gövde: `{ ids: string[] }` (CoinGecko `id` listesi)
  - Response: `{ prices: Record<string, number> }` (USD price map)
  - Yanıt: `{ prices: Record<string, number> }` (USD fiyat haritası)

---

## Usage / Kullanım

1) Add the coin you're interested in from the recommendations page using the "Add to Portfolio" button.
2) Fill in the "Amount" and "Cost" fields on the portfolio page.
3) Profit/Loss amount and percentage are calculated automatically; prices update periodically.

1) Öneriler sayfasında ilgilendiğiniz coini `Portföye ekle` butonuyla ekleyin.
2) Portföy sayfasında `Miktar` ve `Maliyet` alanlarını doldurun.
3) Kar/Zarar tutarı ve yüzde değeri otomatik hesaplanır; fiyatlar periyodik güncellenir.

> Not investment advice. Generated scores and targets are for educational/experimental purposes only.
> Yatırım tavsiyesi değildir. Üretilen skorlar ve hedefler sadece eğitim/deney amaçlıdır.

---

## Development Notes / Geliştirme Notları

- Number/currency formatting is fixed to `en-US` locale with `Intl.NumberFormat` to prevent hydration warnings.
- Import path shortcuts: `@/*`
- Tailwind classes are kept minimal; design system integration can be added.

- Hydration uyarıları için sayı/para formatlaması `Intl.NumberFormat` ile `en-US` bölgesinde sabitlenmiştir.
- İçe aktarma yolu kısaltmaları: `@/*`
- Tailwind sınıfları sade tutulmuştur; design system entegrasyonu eklenebilir.

### Roadmap / Yol Haritası

- Notifications (web push/email) and dynamic alert rules
- Exchange integrations (Binance/Bybit) and order simulation
- User sessions and server-side storage
- Advanced technical/statistical strategies

- Bildirimler (web push/e-posta) ve dinamik uyarı kuralları
- Borsa entegrasyonları (Binance/Bybit) ve emir simülasyonu
- Kullanıcı oturumu ve sunucu tarafı saklama
- Gelişmiş teknik/istatistiksel stratejiler

---

## Commands / Komutlar

```bash
npm run dev     # Development server
npm run build   # Production build
npm run start   # Production server
```

```bash
npm run dev     # Geliştirme sunucusu
npm run build   # Prod build
npm run start   # Prod sunucusu
```

---

## License and Disclaimer / Lisans ve Sorumluluk Reddi

This software is for educational purposes only and does not contain investment advice. Cryptocurrency assets carry high risk; all responsibility lies with the user.

Bu yazılım sadece eğitim amaçlıdır ve yatırım tavsiyesi içermez. Kripto varlıklar yüksek risk barındırır; tüm sorumluluk kullanıcıya aittir.

