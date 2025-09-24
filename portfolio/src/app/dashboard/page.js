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

  // Session check and redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");  // Redirect to home if not authenticated
      }
    };

    checkSession();
  }, [router]);

  // Submit a website
  const handleSiteSubmit = async () => {
    if (!siteUrl || !siteStack) {
      alert("All website fields are required.");
      return;
    }

    const parsedSiteStack = JSON.parse(siteStack || '[]');
    setLoading(true);

    const { error } = await supabase.from("websites").insert([
      { name: siteName, url: siteUrl, stack: parsedSiteStack, country },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error while adding website:", error.message);
    } else {
      alert("Website added!");
      setSiteName("");
      setSiteUrl("");
      setSiteStack("");
      setCountry("");
    }
  };

  // Submit a project
  const handleProjectSubmit = async () => {
    if (!projectName || !githubUrl) {
      alert("All project fields are required.");
      return;
    }

    const parsedProjectStack = JSON.parse(projectStack || '[]');
    setLoading(true);

    const { error } = await supabase.from("projects").insert([
      { name: projectName, url: githubUrl, stack: parsedProjectStack },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error while adding project:", error.message);
    } else {
      alert("Project added!");
      setProjectName("");
      setGithubUrl("");
      setProjectStack("");
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4">
      {/* Navbar */}
      <nav className="flex justify-end items-end py-4">
        <button
          onClick={handleLogout}
          className="text-white font-bold px-4 py-2 rounded-md text-xl"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-wrap justify-center gap-8 py-8">
        {/* Add a Website */}
        <div className="w-full sm:w-1/2 lg:w-1/3 space-y-4">
          <h2 className="text-3xl font-bold text-center">Add a Website</h2>
          <input
            type="text"
            placeholder="name"
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
            placeholder="stack (e.g., ['react', 'node.js'])"
            value={siteStack}
            onChange={(e) => setSiteStack(e.target.value)}
            className="mb-4 p-2 w-full text-black text-xl bg-white rounded-sm"
          />
          <input
            type="text"
            placeholder="country"
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
              "Add Website"
            )}
          </button>
        </div>

        {/* Add a Project */}
        <div className="w-full sm:w-1/2 lg:w-1/3 space-y-4">
          <h2 className="text-3xl font-bold text-center">Add a Project</h2>
          <input
            type="text"
            placeholder="name"
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
            placeholder="stack (e.g., ['react', 'express'])"
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
              "Add Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
