"use client";
import { useState, useEffect } from "react";
import { Recommendation } from "@/lib/types";
import { usePortfolio } from "@/hooks/usePortfolio";
import { safeFormat, safeUsd, safeNumber } from "@/lib/format";

interface AISidebarProps {
  recommendations: Recommendation[];
  isOpen: boolean;
  onClose: () => void;
}

export function AISidebar({ recommendations, isOpen, onClose }: AISidebarProps) {
  const { items, isClient } = usePortfolio();
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Yapay zeka analizi
  const generateAIAnalysis = async (coinId?: string) => {
    setLoading(true);
    
    try {
      const coin = coinId ? recommendations.find(r => r.coin.id === coinId) : null;
      
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coin: coin?.coin || null,
          portfolioItems: items,
          recommendations: recommendations,
        }),
      });

      if (!response.ok) {
        throw new Error("AI analizi alınamadı");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      setAnalysis("❌ AI analizi yüklenirken hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !selectedCoin && mounted && isClient) {
      generateAIAnalysis();
    }
  }, [isOpen, selectedCoin, mounted, isClient]);

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoin(coinId);
    generateAIAnalysis(coinId);
  };

  const handleGeneralAnalysis = () => {
    setSelectedCoin("");
    generateAIAnalysis();
  };

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-96 bg-white dark:bg-zinc-900 h-full overflow-y-auto">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              🤖 AI Asistan
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => generateAIAnalysis(selectedCoin)}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                title="Analizi yenile"
              >
                🔄
              </button>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Coin Seçimi */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Coin Analizi Seçin:</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <button
                onClick={handleGeneralAnalysis}
                className={`w-full text-left p-2 rounded text-sm ${
                  !selectedCoin 
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" 
                    : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                📊 Genel Portföy Analizi
              </button>
              {recommendations.slice(0, 10).map((rec) => (
                <button
                  key={rec.coin.id}
                  onClick={() => handleCoinSelect(rec.coin.id)}
                  className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 ${
                    selectedCoin === rec.coin.id 
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" 
                      : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span className="font-medium">{rec.coin.symbol}</span>
                  <span className="text-zinc-500">${safeFormat(rec.coin.current_price, 4)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Analizi */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <h3 className="text-sm font-medium mb-2">AI Analizi:</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-zinc-500">AI analiz ediyor...</span>
              </div>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis}
                </pre>
              </div>
            )}
          </div>

          {/* Market Sentiment */}
          <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <h3 className="text-sm font-medium mb-2">Market Sentiment:</h3>
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  📊 Genel Durum
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {recommendations.filter(r => safeNumber(r.coin.price_change_percentage_24h) > 0).length} / {recommendations.length} coin pozitif
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  🔥 En Aktif
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {recommendations.length > 0 ? 
                    (() => {
                      const mostActive = recommendations.reduce((max, rec) => 
                        Math.abs(safeNumber(rec.coin.price_change_percentage_24h)) > Math.abs(safeNumber(max.coin.price_change_percentage_24h)) ? rec : max
                      );
                      return `${mostActive.coin.symbol} - %${safeFormat(Math.abs(safeNumber(mostActive.coin.price_change_percentage_24h)), 1)}`;
                    })() : 
                    "Veri yok"
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı Öneriler */}
          <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <h3 className="text-sm font-medium mb-2">Hızlı Öneriler:</h3>
            <div className="space-y-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-green-700 dark:text-green-300">
                  🚀 En Yüksek Potansiyel
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {recommendations[0]?.coin.symbol || "Veri yok"} - Skor: {safeFormat(recommendations[0]?.score, 2)}
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  ⚠️ Dikkat Edilmesi Gereken
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Volatilite yüksek olan coinler için stop-loss kullanın
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-red-700 dark:text-red-300">
                  📉 Risk Yönetimi
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Portföyünüzün %10'undan fazlasını tek coin'e yatırmayın
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
