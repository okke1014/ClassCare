import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/serverTranslate";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tl = searchParams.get("tl") || "ko";
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const text = await translateText(q, tl);
  if (!text) {
    return NextResponse.json({ error: "Translation service unavailable" }, { status: 502 });
  }

  return NextResponse.json({ text }, { headers: { "Cache-Control": "public, max-age=86400" } });
}
