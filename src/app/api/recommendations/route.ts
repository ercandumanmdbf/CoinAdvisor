import { NextRequest, NextResponse } from "next/server";
import { getMarketData } from "@/lib/coinGecko";
import { createRecommendation } from "@/lib/recommendation";
import { Coin } from "@/lib/types";

export const revalidate = 60; // ISR for 1 minute

export async function GET(request: NextRequest) {
  try {
    const markets = await getMarketData();
    
    // En iyi 18 öneriyi oluştur
    const recommendations = markets
      .slice(0, 18)
      .map((coin: Coin) => createRecommendation(coin))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}


