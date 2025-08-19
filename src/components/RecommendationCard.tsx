"use client";
import { useState } from "react";
import Image from "next/image";
import { Recommendation } from "@/lib/types";
import { usePortfolio } from "@/hooks/usePortfolio";
import { num, usd } from "@/lib/format";

type Props = {
  rec: Recommendation;
};

export function RecommendationCard({ rec }: Props) {
  const { add, ids, items, isClient } = usePortfolio();
  const isAdded = isClient && ids.includes(rec.coin.id);
  const portfolioItem = isClient ? items.find(item => item.id === rec.coin.id) : null;
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [averageCost, setAverageCost] = useState(rec.coin.current_price.toString());

  const handleAdd = () => {
    if (!isClient) return;
    
    if (!showForm) {
      setShowForm(true);
      return;
    }

    const numAmount = parseFloat(amount);
    const numCost = parseFloat(averageCost);

    if (isNaN(numAmount) || numAmount <= 0 || isNaN(numCost) || numCost <= 0) {
      alert("Lütfen geçerli miktar ve maliyet değerleri girin.");
      return;
    }

    const portfolioItem = {
      id: rec.coin.id,
      symbol: rec.coin.symbol,
      name: rec.coin.name,
      image: rec.coin.image,
      amount: numAmount,
      averageCost: numCost,
    };

    add(portfolioItem);

    setShowForm(false);
    setAmount("");
    setAverageCost(rec.coin.current_price.toString());
  };

  const handleCancel = () => {
    setShowForm(false);
    setAmount("");
    setAverageCost(rec.coin.current_price.toString());
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3 w-full">
      <div className="flex items-center gap-3">
        <Image src={rec.coin.image} alt={rec.coin.symbol} width={28} height={28} />
        <div className="font-semibold uppercase">{rec.coin.symbol}</div>
        <div className="text-sm text-zinc-500">{rec.coin.name}</div>
        <div className="ml-auto text-sm">{usd.format(rec.coin.current_price)}</div>
      </div>
      
      <div className="text-xs text-zinc-500 text-right">
        Skor: {rec.score.toFixed(2)}
      </div>
      
      {isAdded && portfolioItem && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Portföyde</div>
          <div className="text-xs text-blue-500 dark:text-blue-300">
            Miktar: {portfolioItem.amount} | Ortalama: {usd.format(portfolioItem.averageCost)}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-md bg-green-100/60 dark:bg-green-900/20 p-2">
          <div className="text-xs text-zinc-500">Kısa hedef</div>
          <div className="font-medium">{num.format(rec.targets.shortTarget)}</div>
        </div>
        <div className="rounded-md bg-green-100/60 dark:bg-green-900/20 p-2">
          <div className="text-xs text-zinc-500">Orta hedef</div>
          <div className="font-medium">{num.format(rec.targets.midTarget)}</div>
        </div>
        <div className="rounded-md bg-red-100/60 dark:bg-red-900/20 p-2">
          <div className="text-xs text-zinc-500">Stop</div>
          <div className="font-medium">{num.format(rec.targets.stopLoss)}</div>
        </div>
      </div>
      
      <div className="text-xs text-zinc-500 flex gap-2 flex-wrap">
        {rec.rationale.map((r, i) => (
          <span key={i} className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5">
            {r}
          </span>
        ))}
      </div>
      
      {showForm && (
        <div className="space-y-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Miktar</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="any"
                min="0"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Maliyet (USD)</label>
              <input
                type="number"
                value={averageCost}
                onChange={(e) => setAverageCost(e.target.value)}
                placeholder="0.00"
                step="any"
                min="0"
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Ekle
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-2 bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-400 dark:hover:bg-zinc-600 text-sm"
            >
              İptal
            </button>
          </div>
        </div>
      )}
      
      {!showForm && (
        <button
          onClick={handleAdd}
          disabled={isAdded || !isClient}
          className="mt-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm px-3 py-2 disabled:opacity-60"
        >
          {isAdded ? "Portföyde" : "Portföye ekle"}
        </button>
      )}
    </div>
  );
}


