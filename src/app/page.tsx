"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AISidebar } from "@/components/AISidebar";
import { Recommendation } from "@/lib/types";

export default function HomePage() {
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [mounted, setMounted] = useState(false);

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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Borsa Advisor</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Kripto para önerileri ve portföy takibi için gelişmiş araçlar
          </p>
          
          <div className="mb-8">
            <button
              onClick={() => setIsAISidebarOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              🤖 AI Asistan ile Başlayın
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/recommendations"
              className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-2">Öneriler</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                En iyi kripto para önerilerini görüntüleyin ve portföyünüze ekleyin
              </p>
            </Link>
            
            <Link
              href="/portfolio"
              className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-2">Portföyüm</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Portföyünüzü takip edin ve kar/zarar durumunuzu görüntüleyin
              </p>
            </Link>
          </div>
        </div>
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
