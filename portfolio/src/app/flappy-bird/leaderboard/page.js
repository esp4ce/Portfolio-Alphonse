"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("leaderboard")
        .select("id, nickname, score, created_at")
        .order("score", { ascending: false })
        .limit(50);
      if (error) {
        console.error(error);
      } else {
        setRows(data || []);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className=" font-bold uppercase tracking-wide">leaderboard</h1>
          <Link href="/flappy-bird" className="uppercase font-bold hover:scale-110 transition-transform">Back</Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoaderCircle className="animate-spin text-white text-8xl" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center">No entries yet</div>
        ) : (
          <ol className="space-y-3">
            {rows.map((r, idx) => (
              <li key={r.id} className="flex justify-between items-center py-2 border-b border-gray-800">
                <div className="flex items-center gap-4">
                  <span className="w-8 text-right">{idx + 1}</span>
                  <span className="font-bold">{r.nickname}</span>
                </div>
                <span className="font-bold">{r.score}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}


