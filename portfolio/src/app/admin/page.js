// src/app/login/page.js
"use client";  // Assure-toi de déclarer cela si tu utilises l'état ou des effets

import { useState } from "react";
import { supabase } from "../lib/supabase"; // Importe le client Supabase ici

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
    } else {
      // Si connecté, redirige vers /dashboard
      window.location.href = "/dashboard";
    }
  };

  // Gérer la soumission du formulaire avec la touche "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Return") { // Gestion aussi de la touche "Retour"
      handleLogin(); // Si "Enter" ou "Retour" est appuyé, soumettre le formulaire
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white text-center px-4">
      <div className="flex flex-col w-full max-w-sm">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown} // Ajout de l'événement pour la touche "Enter"
          className="mb-4 p-2 w-full text-black text-2xl bg-white rounded-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown} // Ajout de l'événement pour la touche "Enter"
          className="mb-4 p-2 text-black text-2xl bg-white rounded-sm"
        />
      </div>    
    </div>
  );
}
