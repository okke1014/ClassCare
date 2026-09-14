import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tl = searchParams.get("tl") || "ko";
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://translate.google.com/",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Translation fetch failed" }, { status: 502 });
    }

    const data = await res.json();
    const chunks: unknown[] = Array.isArray(data?.[0]) ? data[0] : [];
    const text = chunks
      .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === "string" ? chunk[0] : ""))
      .join("")
      .trim();

    if (!text) {
      return NextResponse.json({ error: "Empty translation" }, { status: 502 });
    }

    return NextResponse.json(
      { text },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch {
    return NextResponse.json({ error: "Translation service unavailable" }, { status: 502 });
  }
}
