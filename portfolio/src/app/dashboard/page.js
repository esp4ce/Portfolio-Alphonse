"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";  // Import de l'icône de la roue de chargement

export default function Dashboard() {
  const [siteUrl, setSiteUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteStack, setSiteStack] = useState("");  // stack peut être un JSON
  const [projectStack, setProjectStack] = useState("");  // stack pour projet
  const [country, setCountry] = useState("");
  const [projectName, setProjectName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const router = useRouter();

  // Vérification de la session utilisateur pour redirection
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");  // Redirection vers la page d'accueil si non connecté
      }
    };

    checkSession(); // Appel de la fonction pour vérifier la session
  }, [router]);

  // Fonction pour soumettre un site
  const handleSiteSubmit = async () => {
    if (!siteUrl || !siteStack) {
      alert("Tous les champs pour le site sont requis.");
      return;
    }

    const parsedSiteStack = JSON.parse(siteStack || '[]');  // Si siteStack est une chaîne, la parser en tableau
    setLoading(true); // Activer le chargement

    const { error } = await supabase.from("websites").insert([
      { name: siteName, url: siteUrl, stack: parsedSiteStack, country },
    ]);

    setLoading(false); // Désactiver le chargement après la soumission

    if (error) {
      console.error("Erreur lors de l'ajout du site :", error.message);
    } else {
      alert("Site ajouté !");
      setSiteName("");
      setSiteUrl("");
      setSiteStack("");
      setCountry("");
    }
  };

  // Fonction pour soumettre un projet
  const handleProjectSubmit = async () => {
    if (!projectName || !githubUrl) {
      alert("Tous les champs pour le projet sont requis.");
      return;
    }

    const parsedProjectStack = JSON.parse(projectStack || '[]');  // Idem ici pour stack projet
    setLoading(true); // Activer le chargement

    const { error } = await supabase.from("projects").insert([
      { name: projectName, url: githubUrl, stack: parsedProjectStack },
    ]);

    setLoading(false); // Désactiver le chargement après la soumission

    if (error) {
      console.error("Erreur lors de l'ajout du projet :", error.message);
    } else {
      alert("Projet ajouté !");
      setProjectName("");
      setGithubUrl("");
      setProjectStack("");
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");  // Redirection vers la page d'accueil après déconnexion
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4">
      {/* Navbar */}
      <nav className="flex justify-end items-end py-4">
        <button
          onClick={handleLogout}
          className="text-white font-bold px-4 py-2 rounded-md text-xl"
        >
          Déconnexion
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-wrap justify-center gap-8 py-8">
        {/* Ajouter un Site */}
        <div className="w-full sm:w-1/2 lg:w-1/3 space-y-4">
          <h2 className="text-3xl font-bold text-center">Ajouter un Site</h2>
          <input
            type="text"
            placeholder="nom"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <input
            type="text"
            placeholder="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <input
            type="text"
            placeholder="stack (ex: ['react', 'node.js'])"
            value={siteStack}
            onChange={(e) => setSiteStack(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <input
            type="text"
            placeholder="pays"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <button
            onClick={handleSiteSubmit}
            className="p-2 bg-white text-black text-xl font-bold rounded-sm w-full"
          >
            {loading ? (
              <LoaderCircle className="animate-spin text-white text-3xl" />
            ) : (
              "Ajouter Site"
            )}
          </button>
        </div>

        {/* Ajouter un Projet */}
        <div className="w-full sm:w-1/2 lg:w-1/3 space-y-4">
          <h2 className="text-3xl font-bold text-center">Ajouter un Projet</h2>
          <input
            type="text"
            placeholder="nom"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <input
            type="text"
            placeholder="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <input
            type="text"
            placeholder="stack (ex: ['react', 'express'])"
            value={projectStack}
            onChange={(e) => setProjectStack(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <button
            onClick={handleProjectSubmit}
            className="p-2 bg-white text-black text-xl font-bold rounded-sm w-full"
          >
            {loading ? (
              <LoaderCircle className="animate-spin text-white text-3xl" />
            ) : (
              "Ajouter Projet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
