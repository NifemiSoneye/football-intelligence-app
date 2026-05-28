"use client";

import { useSearchParams } from "next/navigation";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const hasLeagues = searchParams.has("leagues");
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 relative overflow-hidden">
      <div
        className={`absolute top-0 w-[600px] h-[400px] pointer-events-none ${
          hasLeagues ? "left-0" : "right-0"
        }`}
        style={
          hasLeagues
            ? {
                background:
                  "radial-gradient(ellipse 50% 100% at 0% 0%, rgba(232,255,71,0.06) 0%, transparent 60%)",
              }
            : {
                background:
                  "radial-gradient(ellipse 50% 100% at 100% 0%, rgba(232,255,71,0.06) 0%, transparent 60%)",
              }
        }
      />
      {children}
    </div>
  );
}
