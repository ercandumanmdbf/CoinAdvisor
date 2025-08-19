"use client";
import { useEffect, useState } from "react";
import { PortfolioTable } from "@/components/PortfolioTable";
import { AISidebar } from "@/components/AISidebar";
import { formatTime } from "@/lib/format";
import { Recommendation } from "@/lib/types";

export default function PortfolioPage() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [mounted, setMounted] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Önerileri yükle (AI sidebar için)
  useEffect(() => {
    if (mounted) {
      const fetchRecommendations = async () => {
        try {
          const response = await fetch("/api/recommendations");
          const data = await response.json();
          if (data.recommendations) {
            setRecommendations(data.recommendations);
          }
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      };
      fetchRecommendations();
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setLastUpdate(new Date());
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

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
          <h1 className="text-2xl font-bold">Portföyüm</h1>
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
          </div>
        </div>
        
        <PortfolioTable />
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


