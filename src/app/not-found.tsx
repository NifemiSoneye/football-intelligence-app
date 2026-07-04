import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-center px-4">
      <p className="text-[8rem] font-bold text-[#e8ff47] font-[family-name:var(--font-display)] leading-none">
        404
      </p>
      <p className="text-white text-xl font-bold font-[family-name:var(--font-display)] mb-2">
        PAGE NOT FOUND
      </p>
      <p className="text-zinc-500 text-sm mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-[#e8ff47] text-black text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-300 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
