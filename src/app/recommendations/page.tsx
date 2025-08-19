"use client";
import { useEffect, useState } from "react";
import { RecommendationCard } from "@/components/RecommendationCard";
import { AISidebar } from "@/components/AISidebar";
import { Recommendation } from "@/lib/types";
import { formatTime } from "@/lib/format";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [mounted, setMounted] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/recommendations");
      const data = await response.json();
      
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setLastUpdate(new Date());
        setCountdown(60);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchRecommendations();
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchRecommendations();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, recommendations]);

  const handleRefresh = () => {
    fetchRecommendations();
  };

  // Client-side rendering için
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Öneriler</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-500">
              {lastUpdate && `Son güncelleme: ${formatTime(lastUpdate)}`}
            </div>
            <div className="text-sm text-zinc-500">
              {countdown}s sonra güncellenecek
            </div>
            <button
              onClick={() => setIsAISidebarOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              🤖 AI Asistan
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-80"
            >
              Yenile
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.coin.id} rec={rec} />
            ))}
          </div>
        )}
      </div>
      
      {/* AI Sidebar */}
      <AISidebar
        recommendations={recommendations}
        isOpen={isAISidebarOpen}
        onClose={() => setIsAISidebarOpen(false)}
      />
    </div>
  );
}


