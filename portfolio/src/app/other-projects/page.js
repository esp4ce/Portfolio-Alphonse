"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { LoaderCircle } from "lucide-react";  // Import de l'icône de la roue de chargement

export default function OtherProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      let { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Erreur de récupération :", error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-4 text-center">
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircle className="animate-spin text-white text- text-8xl" />
        </div>
      ) : projects.length === 0 ? (
        <a href="/" className="text-white font-bold text-3xl">NONE</a>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {projects.map((project) => (
            <div key={project.id} className="p-2">
              <a
                href={project.url}
                target="_blank"
                className="text-white font-bold text-xl"
              >
                {project.name}
              </a>
              <p className="text-sm opacity-80 mt-2">{project.stack}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
