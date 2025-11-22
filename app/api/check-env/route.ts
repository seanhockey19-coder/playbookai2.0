import { NextResponse } from "next/server";

export async function GET() {
  const keyExists = !!process.env.ODDS_API_KEY;

  return NextResponse.json({
    status: "ok",
    ODDS_API_KEY_present: keyExists,
    message: keyExists
      ? "ODDS_API_KEY is loaded correctly in this environment ✅"
      : "ODDS_API_KEY is NOT detected ❌ — check Vercel Production env vars",
    // DO NOT return the actual key for security reasons
  });
}
