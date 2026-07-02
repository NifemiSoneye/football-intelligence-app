"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-100 px-8 text-center">
      <p className="text-white text-3xl font-bold font-display mb-2">
        SOMETHING WENT WRONG
      </p>
      <p className="text-zinc-500 text-sm mb-6">
        This could be a rate limit or network issue. Try again in a moment.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-[#e8ff47] text-black text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-300 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
