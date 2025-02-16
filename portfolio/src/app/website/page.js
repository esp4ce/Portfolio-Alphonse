"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { LoaderCircle } from "lucide-react";  // Import de l'icône de la roue de chargement

export default function Website() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      setLoading(true);
      let { data, error } = await supabase.from("websites").select("*");
      if (error) {
        console.error("Erreur de récupération :", error);
      } else {
        setWebsites(data);
      }
      setLoading(false);
    };

    fetchWebsites();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-4 text-center">
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircle className="animate-spin text-white text-8xl" />
        </div>
      ) : websites.length === 0 ? (
        <a href="/" className="text-white font-bold text-3xl">NONE</a>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {websites.map((site) => (
            <div key={site.id} className="p-2">
              <a
                href={site.url}
                target="_blank"
                className="text-white font-bold text-xl"
              >
                {site.name}
              </a>
              <p className="text-sm opacity-80 mt-2">{site.stack} - {site.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
