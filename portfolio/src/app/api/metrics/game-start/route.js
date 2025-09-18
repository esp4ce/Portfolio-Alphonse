import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    // Ne compter qu’en production et uniquement sur domaine alphonse.pro
    const headers = request.headers;
    const host = headers.get("host") || "";
    const isProd = process.env.NODE_ENV === "production";
    const allowed = isProd && /(^|\.)alphonse\.pro$/i.test(host);
    if (!allowed) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Métadonnées
    const userAgent = headers.get("user-agent") || null;
    const acceptLanguage = headers.get("accept-language") || null;
    const referer = headers.get("referer") || null;
    // IP & géoloc (Vercel headers si dispo)
    const xff = headers.get("x-forwarded-for") || headers.get("x-real-ip") || null;
    const ip = xff ? xff.split(",")[0].trim() : null;
    const city = headers.get("x-vercel-ip-city") || null;
    const country = headers.get("x-vercel-ip-country") || null;
    const region = headers.get("x-vercel-ip-country-region") || null;
    const continent = headers.get("x-vercel-ip-continent") || null;

    const { error } = await supabase.from("metrics_game_start").insert([
      {
        user_agent: userAgent,
        accept_language: acceptLanguage,
        referer,
        ip,
        city,
        country,
        region,
        continent,
      }
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


