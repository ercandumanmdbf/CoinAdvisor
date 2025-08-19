import { NextRequest, NextResponse } from "next/server";
import { fetchSimplePrices } from "@/lib/coinGecko";

export const revalidate = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ids = Array.isArray(body?.ids) ? (body.ids as string[]) : [];
    const prices = await fetchSimplePrices(ids);
    return NextResponse.json({ prices });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


