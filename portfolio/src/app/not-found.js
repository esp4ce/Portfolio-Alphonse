import Link from "next/link";

export default function NotFound() {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white text-center px-4">
        <Link href="/">   <h1  className="text-6xl font-bold">404</h1>
        <p className="text-xl font-bold mt-4">Page not found</p></Link>
     
      </div>
    );
  }
  