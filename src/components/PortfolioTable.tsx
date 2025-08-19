"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { num, usd } from "@/lib/format";

type Prices = Record<string, number>;

export function PortfolioTable() {
  const { items, remove, updateAmount, updateAverageCost, isClient } = usePortfolio();
  const [prices, setPrices] = useState<Prices>({});

  useEffect(() => {
    if (!isClient) return;
    
    let active = true;
    const ids = items.map((i) => i.id);
    if (ids.length === 0) {
      setPrices({});
      return;
    }
    fetch("/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (active) setPrices(d.prices ?? {});
      })
      .catch(() => {});
    const t = setInterval(() => {
      fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (active) setPrices(d.prices ?? {});
        })
        .catch(() => {});
    }, 15000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [items, isClient]);

  const rows = useMemo(() => {
    return items.map((i) => {
      const price = prices[i.id] ?? 0;
      const marketValue = i.amount * price;
      const costValue = i.amount * i.averageCost;
      const pnl = marketValue - costValue;
      const pnlPct = costValue > 0 ? (pnl / costValue) * 100 : 0;
      return {
        ...i,
        price,
        marketValue,
        costValue,
        pnl,
        pnlPct,
      };
    });
  }, [items, prices]);

  if (!isClient) {
    return <div className="text-sm text-zinc-500">Yükleniyor...</div>;
  }

  if (items.length === 0) {
    return <div className="text-sm text-zinc-500">Portföyünüz boş. Önerilerden coin ekleyin.</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-zinc-500">
            <th className="p-2">Varlık</th>
            <th className="p-2">Güncel Fiyat</th>
            <th className="p-2">Miktar</th>
            <th className="p-2">Ortalama Maliyet</th>
            <th className="p-2">Toplam Maliyet</th>
            <th className="p-2">Piyasa Değeri</th>
            <th className="p-2">Kar/Zarar</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <Image src={r.image} alt={r.symbol} width={20} height={20} />
                  <span className="uppercase font-medium">{r.symbol}</span>
                  <span className="text-zinc-500">{r.name}</span>
                </div>
              </td>
              <td className="p-2">{usd.format(r.price)}</td>
              <td className="p-2">
                <input
                  type="number"
                  className="w-24 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1"
                  value={r.amount}
                  min={0}
                  step="any"
                  onChange={(e) => updateAmount(r.id, Number(e.target.value))}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  className="w-24 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1"
                  value={r.averageCost}
                  min={0}
                  step="any"
                  onChange={(e) => updateAverageCost(r.id, Number(e.target.value))}
                />
              </td>
              <td className="p-2">{usd.format(r.costValue)}</td>
              <td className="p-2">{usd.format(r.marketValue)}</td>
              <td className="p-2">
                <span className={r.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                  {usd.format(r.pnl)} ({num.format(r.pnlPct)}%)
                </span>
              </td>
              <td className="p-2 text-right">
                <button onClick={() => remove(r.id)} className="text-xs text-red-600">
                  Kaldır
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


