// src/app/dashboard/league/[leagueId]/matches/[matchId]/MatchOverview.tsx
import { Match } from "@/types/football";

type Incident = {
  incidentType: "goal" | "card" | "substitution" | "period" | "injuryTime";
  incidentClass?: string;
  time: number;
  addedTime?: number;
  isHome?: boolean;
  player?: { name: string };
  playerIn?: { name: string };
  playerOut?: { name: string };
  reason?: string;
  footballPassingNetworkAction?: { bodyPart: string }[];
};

type Props = {
  match: Match;
  sofascoreData: any;
};

function formatMinute(time: number, addedTime?: number) {
  if (addedTime) return `${time}+${addedTime}'`;
  return `${time}'`;
}

function getGoalSubtext(incident: Incident) {
  if (incident.incidentClass === "penalty") return "Penalty";
  if (incident.incidentClass === "ownGoal") return "Own Goal";
  const bodyPart = incident.footballPassingNetworkAction?.[0]?.bodyPart;
  if (bodyPart === "head") return "Header";
  return null;
}

function EventIcon({ incident }: { incident: Incident }) {
  if (incident.incidentType === "goal") {
    return <span className="text-sm">⚽</span>;
  }
  if (incident.incidentType === "card") {
    return (
      <span
        className={`inline-block w-4 h-4 rounded-sm ${
          incident.incidentClass === "yellow" ? "bg-yellow-400" : "bg-red-500"
        }`}
      />
    );
  }
  if (incident.incidentType === "substitution") {
    return <span className="text-sm">🔄</span>;
  }
  return null;
}

function EventContent({
  incident,
  isHome,
}: {
  incident: Incident;
  isHome: boolean;
}) {
  const align = isHome ? "items-end text-right" : "items-start text-left";

  if (incident.incidentType === "goal") {
    const subtext = getGoalSubtext(incident);
    return (
      <div className={`flex flex-col ${align}`}>
        <div
          className={`flex items-center gap-1.5 ${isHome ? "flex-row-reverse" : "flex-row"}`}
        >
          <EventIcon incident={incident} />
          <span className="text-sm font-bold text-[#e8ff47] font-body">
            {incident.player?.name}
          </span>
        </div>
        {subtext && (
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {subtext}
          </span>
        )}
      </div>
    );
  }

  if (incident.incidentType === "card") {
    return (
      <div className={`flex flex-col ${align}`}>
        <div
          className={`flex items-center gap-1.5 ${isHome ? "flex-row-reverse" : "flex-row"}`}
        >
          <EventIcon incident={incident} />
          <span className="text-sm font-bold text-white font-body">
            {incident.player?.name}
          </span>
        </div>
        {incident.reason && (
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {incident.reason}
          </span>
        )}
      </div>
    );
  }

  if (incident.incidentType === "substitution") {
    return (
      <div className={`flex flex-col ${align}`}>
        <div
          className={`flex items-center gap-1.5 ${isHome ? "flex-row-reverse" : "flex-row"}`}
        >
          <EventIcon incident={incident} />
          <span className="text-sm font-bold text-white font-body">
            {incident.playerIn?.name}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          {incident.playerOut?.name}
        </span>
      </div>
    );
  }

  return null;
}

export default function MatchOverview({ match, sofascoreData }: Props) {
  const { referees, utcDate } = match;

  const events: Incident[] = (sofascoreData?.incidents?.incidents ?? [])
    .filter((i: any) =>
      ["goal", "card", "substitution"].includes(i.incidentType),
    )
    .reverse();

  const referee = referees?.[0]?.name ?? "—";

  const date = new Date(utcDate);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime =
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " GMT";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Events timeline */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-body">
            Match Events
          </h2>
        </div>

        {events.length === 0 ? (
          <p className="text-zinc-500 text-sm">No events</p>
        ) : (
          <div className="relative flex flex-col gap-0">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-zinc-700" />

            {events.map((event, idx) => {
              const isHome = event.isHome ?? false;
              const minute = formatMinute(event.time, event.addedTime);

              return (
                <div key={idx} className="relative flex items-center min-h-16">
                  {/* Home side */}
                  <div className="flex-1 flex flex-col items-end pr-8">
                    {isHome && <EventContent incident={event} isHome={true} />}
                  </div>

                  {/* Minute badge */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 z-10 px-2 py-1 rounded text-[10px] font-bold min-w-11 text-center whitespace-nowrap ${
                      event.incidentType === "goal"
                        ? isHome
                          ? "bg-[#e8ff47] text-black"
                          : "bg-zinc-700 text-zinc-300"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {minute}
                  </div>

                  {/* Away side */}
                  <div className="flex-1 flex flex-col items-start pl-8">
                    {!isHome && (
                      <EventContent incident={event} isHome={false} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Match info card */}
      <div className="lg:w-72 shrink-0 lg:sticky lg:top-6 self-start">
        <div className="bg-zinc-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#e8ff47] text-sm">ℹ</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Match Info
            </h2>
          </div>

          {[
            { label: "Referee", value: referee },
            { label: "Date", value: formattedDate },
            { label: "Kickoff", value: formattedTime },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 shrink-0">
                {label}
              </span>
              <span className="text-sm text-white text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
