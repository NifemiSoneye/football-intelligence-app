export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 100% 0%, rgba(232,255,71,0.06) 0%, transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
