import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { nickname, score } = await request.json();
    if (!nickname || typeof nickname !== "string" || !nickname.trim()) {
      return NextResponse.json({ error: "Invalid nickname" }, { status: 400 });
    }
    if (typeof score !== "number" || !Number.isFinite(score) || score <= 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    const cleanNickname = nickname.trim().slice(0, 24);
    const safeScore = Math.floor(score);

    const { data, error } = await supabase.from("leaderboard").insert([{ nickname: cleanNickname, score: safeScore }]).select("id").single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


