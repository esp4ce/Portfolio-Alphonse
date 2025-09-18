import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    // Ne compter qu’en production et uniquement sur domaine alphonse.pro
    const host = request.headers.get("host") || "";
    const isProd = process.env.NODE_ENV === "production";
    const allowed = isProd && /(^|\.)alphonse\.pro$/i.test(host);
    if (!allowed) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Optionnel: user agent / ip (anonymisé) si besoin plus tard
    const userAgent = request.headers.get("user-agent") || null;

    const { error } = await supabase.from("metrics_game_start").insert([
      { user_agent: userAgent }
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


