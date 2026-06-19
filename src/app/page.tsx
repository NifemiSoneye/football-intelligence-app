import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const LEAGUES = [
  { name: "Premier League", crest: "https://crests.football-data.org/PL.png" },
  { name: "La Liga", crest: "https://crests.football-data.org/PD.png" },
  { name: "Bundesliga", crest: "https://crests.football-data.org/BL1.png" },
  { name: "Serie A", crest: "https://crests.football-data.org/SA.png" },
  { name: "Ligue 1", crest: "https://crests.football-data.org/FL1.png" },
  {
    name: "Champions League",
    crest: "https://crests.football-data.org/CL.png",
  },
  {
    name: "FIFA World Cup",
    crest: "https://crests.football-data.org/qatar.png",
  },
];

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-[#e8ff47] font-bold text-xl tracking-tight">
          FI.
        </span>
        <div className="flex items-center gap-3">
          <LoginLink className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
            Sign in
          </LoginLink>
          <RegisterLink className="text-sm bg-[#e8ff47] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#d4eb3a] transition-colors">
            Get started
          </RegisterLink>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-32 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Pitch graphic background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <svg
            viewBox="0 0 800 500"
            className="w-full max-w-4xl"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <rect x="40" y="40" width="720" height="420" rx="2" />
            <line x1="400" y1="40" x2="400" y2="460" />
            <circle cx="400" cy="250" r="70" />
            <circle cx="400" cy="250" r="3" fill="white" />
            <rect x="40" y="160" width="100" height="180" />
            <rect x="660" y="160" width="100" height="180" />
            <rect x="40" y="195" width="50" height="110" />
            <rect x="710" y="195" width="50" height="110" />
            <path d="M 40 250 Q 120 180 40 110" fill="none" />
            <path d="M 760 250 Q 680 180 760 110" fill="none" />
          </svg>
        </div>

        <div className="relative z-10">
          <span className="inline-block text-xs font-medium text-[#e8ff47] border border-[#e8ff47]/30 rounded-full px-3 py-1 mb-6 tracking-widest uppercase">
            AI-powered football analysis
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Understand the game
            <br />
            <span className="text-[#e8ff47]">like never before</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Analyse finished matches, explore league standings, and have real AI
            conversations about any game across the top five leagues.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <RegisterLink className="bg-[#e8ff47] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#d4eb3a] transition-colors text-sm">
              Start analysing free
            </RegisterLink>
            <LoginLink className="text-white/60 hover:text-white transition-colors text-sm px-6 py-3 border border-white/10 rounded-lg hover:border-white/20">
              Sign in
            </LoginLink>
          </div>
        </div>
      </section>

      {/* League marquee */}
      <section className="pb-20 overflow-hidden">
        <p className="text-center text-xs font-medium text-white/20 tracking-widest uppercase mb-8">
          Covering the world's top competitions
        </p>
        <div className="relative flex">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee gap-12 items-center">
            {[...LEAGUES, ...LEAGUES, ...LEAGUES].map((league, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <img
                  src={league.crest}
                  alt={league.name}
                  className="w-8 h-8 object-contain opacity-70"
                />
                <span className="text-white/40 text-sm font-medium whitespace-nowrap">
                  {league.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-white/30 tracking-widest uppercase mb-3">
            What you can do
          </p>
          <h2 className="text-3xl font-bold">
            Everything you need to follow the game
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "⚽",
              title: "Match analysis",
              desc: "Pick any finished match and start a conversation with AI. Ask about tactics, key moments, performance — get real answers, not stats dumps.",
              tag: "AI chat",
            },
            {
              icon: "🏆",
              title: "League intelligence",
              desc: "Live standings, matchday results, and upcoming fixtures across the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, and Champions League.",
              tag: "6 competitions",
            },
            {
              icon: "👕",
              title: "Team insights",
              desc: "Full squad breakdowns, coach info, active competitions, and a complete results and fixtures history — all in one place.",
              tag: "Any club",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <span className="text-[10px] font-medium text-[#e8ff47]/70 tracking-widest uppercase mb-2 block">
                {f.tag}
              </span>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-white/30 tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl font-bold">
            Three steps to deeper football knowledge
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {[
            {
              step: "01",
              title: "Pick a league or team",
              desc: "Browse the top five European leagues and Champions League, or search directly for any club.",
            },
            {
              step: "02",
              title: "Find a finished match",
              desc: "Navigate matchday results to find the game you want to understand better.",
            },
            {
              step: "03",
              title: "Start an AI conversation",
              desc: "Ask anything — why did they lose, how did the tactics change, who was the real difference maker.",
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-5">
              <span className="text-[#e8ff47] font-bold text-4xl leading-none opacity-30 shrink-0 mt-1">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="bg-[#e8ff47] rounded-2xl px-10 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to analyse your first match?
          </h2>
          <p className="text-black/50 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Free to use. No credit card required. Just sign up and start having
            real conversations about football.
          </p>
          <RegisterLink className="inline-block bg-black text-[#e8ff47] font-semibold px-8 py-3 rounded-lg hover:bg-black/80 transition-colors text-sm">
            Create your free account
          </RegisterLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 max-w-6xl mx-auto border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[#e8ff47] font-bold tracking-tight">FI.</span>
        <p className="text-white/20 text-xs">
          © 2026 Football Intelligence. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
