"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OnboardingLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const hasLeagues = searchParams.has("leagues");
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 relative overflow-hidden">
      <div
        className={`absolute top-0 w-150 h-100 pointer-events-none lg:hidden ${
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
      <div
        className="hidden lg:block fixed bottom-0 left-0 w-150 h-100 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 0% 100%, rgba(232,255,71,0.06) 0%, transparent 60%)",
        }}
      />
      <div
        className="hidden lg:block fixed top-0 right-0 w-150 h-100 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 70% 0%, rgba(232,255,71,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-[900px] mx-auto relative z-[100]">{children}</div>
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <OnboardingLayoutInner>{children}</OnboardingLayoutInner>
    </Suspense>
  );
}
