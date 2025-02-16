// src/app/dashboard/page.js
"use client"; // Assure-toi de déclarer cela si tu utilises l'état ou des effets

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; // Importe le client Supabase ici

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {error} = await supabase.auth.getUser();
      if (error) {
        router.push("/");
    }
    };

    getUser();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); 
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white text-center px-4">
      <h1 className="text-4xl font-bold">Bienvenue sur votre Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 transition-transform hover:scale-110"
      >
        Se déconnecter
      </button>
    </div>
  );
}
