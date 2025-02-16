import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-4 text-center">
      <a
        href="mailto:contact@alphonse.pro"
        className="text-2xl lg:text-6xl xs:text-8xl md:text-4xl pb-5 font-bold tracking-wide break-words"
      >
        CONTACT@ALPHONSE.PRO
      </a>
      <div className="mt-6 flex flex-col sm:flex-row gap-4 text-lg sm:text-2xl font-bold">
        <a
          href="/website"
          className="cursor-pointer transition-transform hover:scale-110"
        >
          WEBSITE
        </a>
        <Link
          href="/other-projects"
          className="cursor-pointer transition-transform hover:scale-110"
        >
          OTHER PROJECTS
        </Link>
      </div>
    </div>
  );
}
