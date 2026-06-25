// src/app/dashboard/league/[leagueId]/matches/[matchId]/MatchLineups.tsx

type PlayerColor = {
  primary: string;
  number: string;
};

type Player = {
  player: { name: string; shortName: string };
  jerseyNumber: string;
  position: string;
  substitute: boolean;
};

type TeamLineup = {
  players: Player[];
  formation: string;
  playerColor: PlayerColor;
  goalkeeperColor: PlayerColor;
};

type Props = {
  lineups: {
    confirmed: boolean;
    home: TeamLineup;
    away: TeamLineup;
  };
  homeTeamName: string;
  awayTeamName: string;
};

const POSITION_ORDER = ["G", "D", "M", "F"];
const POSITION_LABELS: Record<string, string> = {
  G: "Goalkeeper",
  D: "Defenders",
  M: "Midfielders",
  F: "Forwards",
};

function JerseyBadge({
  number,
  color,
}: {
  number: string;
  color: PlayerColor;
}) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
      style={{
        backgroundColor: `#${color.primary}`,
        color: `#${color.number}`,
      }}
    >
      {number}
    </div>
  );
}

function PlayerRow({
  player,
  isHome,
  color,
}: {
  player: Player;
  isHome: boolean;
  color: PlayerColor;
}) {
  const name = player.player.shortName;

  if (isHome) {
    return (
      <div className="flex items-center gap-2.5 py-2 border-b border-zinc-800/50">
        <JerseyBadge number={player.jerseyNumber} color={color} />
        <span className="text-sm text-white font-body truncate">{name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2.5 py-2 border-b border-zinc-800/50">
      <span className="text-sm text-white font-body truncate text-right">
        {name}
      </span>
      <JerseyBadge number={player.jerseyNumber} color={color} />
    </div>
  );
}

export default function MatchLineups({
  lineups,
  homeTeamName,
  awayTeamName,
}: Props) {
  const { home, away, confirmed } = lineups;

  const homeStarters = home.players.filter((p) => !p.substitute);
  const awaySubs = away.players.filter((p) => p.substitute);
  const awayStarters = away.players.filter((p) => !p.substitute);
  const homeSubs = home.players.filter((p) => p.substitute);

  const groupByPosition = (players: Player[]) => {
    return POSITION_ORDER.reduce(
      (acc, pos) => {
        const group = players.filter((p) => p.position === pos);
        if (group.length > 0) acc[pos] = group;
        return acc;
      },
      {} as Record<string, Player[]>,
    );
  };

  const homeGroups = groupByPosition(homeStarters);
  const awayGroups = groupByPosition(awayStarters);

  const allPositions = POSITION_ORDER.filter(
    (pos) => homeGroups[pos] || awayGroups[pos],
  );

  return (
    <div>
      {/* Formations bar */}
      <div className="flex items-center justify-between mb-8 bg-zinc-900 rounded-xl px-6 py-4">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
            {homeTeamName}
          </span>
          <span className="text-2xl font-bold text-white  font-display">
            {home.formation}
          </span>
        </div>

        <span className="text-2xl">⚽</span>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
            {awayTeamName}
          </span>
          <span className="text-2xl font-bold text-white font-display">
            {away.formation}
          </span>
        </div>
      </div>

      {!confirmed && (
        <p className="text-xs text-zinc-500 text-center mb-4 uppercase tracking-widest">
          Lineups not yet confirmed
        </p>
      )}

      {/* Starting XI */}
      <div className="grid grid-cols-2 gap-0 divide-x divide-zinc-800">
        {/* Home column */}
        <div className="pr-4 md:pr-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
            {homeTeamName} XI
          </p>
          {allPositions.map((pos) => (
            <div key={pos} className="mb-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">
                {POSITION_LABELS[pos]}
              </p>
              {(homeGroups[pos] ?? []).map((player, idx) => (
                <PlayerRow
                  key={idx}
                  player={player}
                  isHome={true}
                  color={
                    player.position === "G"
                      ? home.goalkeeperColor
                      : home.playerColor
                  }
                />
              ))}
            </div>
          ))}
        </div>

        {/* Away column */}
        <div className="pl-4 md:pl-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 text-right">
            {awayTeamName} XI
          </p>
          {allPositions.map((pos) => (
            <div key={pos} className="mb-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1 text-right">
                {POSITION_LABELS[pos]}
              </p>
              {(awayGroups[pos] ?? []).map((player, idx) => (
                <PlayerRow
                  key={idx}
                  player={player}
                  isHome={false}
                  color={
                    player.position === "G"
                      ? away.goalkeeperColor
                      : away.playerColor
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Substitutes */}
      <div className="mt-8 pt-6 border-t border-zinc-800">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
          Substitutes
        </p>
        <div className="grid grid-cols-2 gap-0 divide-x divide-zinc-800">
          <div className="pr-4 md:pr-8">
            {homeSubs.map((player, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 py-2 border-b border-zinc-800/50"
              >
                <JerseyBadge
                  number={player.jerseyNumber}
                  color={
                    player.position === "G"
                      ? home.goalkeeperColor
                      : home.playerColor
                  }
                />
                <span className="text-sm text-zinc-400 font-body truncate">
                  {player.player.shortName}
                </span>
              </div>
            ))}
          </div>
          <div className="pl-4 md:pl-8">
            {awaySubs.map((player, idx) => (
              <div
                key={idx}
                className="flex items-center justify-end gap-2.5 py-2 border-b border-zinc-800/50"
              >
                <span className="text-sm text-zinc-400 font-body truncate text-right">
                  {player.player.shortName}
                </span>
                <JerseyBadge
                  number={player.jerseyNumber}
                  color={
                    player.position === "G"
                      ? away.goalkeeperColor
                      : away.playerColor
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
