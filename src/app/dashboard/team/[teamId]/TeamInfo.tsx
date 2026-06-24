import { TeamInfoResponse } from "@/types/football";
type Props = {
  teamInfo: TeamInfoResponse;
};
import Image from "next/image";

export default function TeamInfo({ teamInfo }: Props) {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
  const formatContractDate = (date: string) => {
    if (!date) return "N/A";
    const [year, month] = date.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      },
    );
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0];
    return `${parts[0][0]}${parts[parts.length - 1][0]}`;
  };
  const POSITION_ORDER = [
    "Goalkeeper",
    "Defence",
    "Midfield",
    "Offence",
    "Other",
  ];

  const groupedSquad = POSITION_ORDER.reduce(
    (acc, position) => {
      if (position === "Other") {
        acc[position] = teamInfo.squad.filter(
          (player) =>
            !["Goalkeeper", "Defence", "Midfield", "Offence"].includes(
              player.position,
            ),
        );
      } else {
        acc[position] = teamInfo.squad.filter(
          (player) => player.position === position,
        );
      }
      return acc;
    },
    {} as Record<string, typeof teamInfo.squad>,
  );

  return (
    <div className="m-3">
      <section>
        <p className="text-white uppercase  font-semibold">Leadership</p>

        {teamInfo.coach && (
          <div className="bg-[#131313] flex-col items-center justify-evenly p-4 rounded-md border border-[#e8ff47]/10 text-white my-2 w-full lg:w-[50%]">
            <div className="flex gap-2 items-center">
              <div className="w-16 h-16 rounded-full bg-[#292c33] flex items-center justify-center text-[#e8ff47] font-bold text-xl">
                {getInitials(teamInfo.coach.name)}
              </div>
              <div>
                <p>{teamInfo.coach.name ?? "Unknown Coach"}</p>
                <p>
                  {teamInfo.coach.nationality} | Age{" "}
                  {teamInfo.coach.dateOfBirth
                    ? calculateAge(teamInfo.coach.dateOfBirth)
                    : "N/A"}
                </p>
                <p>
                  Head Coach . Since{" "}
                  {formatContractDate(teamInfo.coach.contract?.start)}
                </p>
              </div>
            </div>
          </div>
        )}
        <p className="text-white uppercase  font-semibold">
          Active competitions
        </p>
        <div className="grid grid-cols-2 gap-3">
          {teamInfo.runningCompetitions.map((competion) => (
            <div
              className="bg-[#131313] flex-col place-items-center p-4 rounded-md border border-[#e8ff47]/10 text-white my-2 "
              key={competion.id}
            >
              <Image
                src={competion.emblem}
                alt={competion.name}
                width={50}
                height={50}
              />
              <p className="text-[13px] text-nowrap my-1">{competion.name}</p>
            </div>
          ))}
        </div>
        <p className="text-white uppercase  font-semibold">Current Squad</p>
        {POSITION_ORDER.map((position) => {
          const players = groupedSquad[position];
          if (!players.length) return null;
          return (
            <div key={position}>
              <p className="text-[#8A93A8] text-xs uppercase my-2 tracking-widest">
                {position === "Goalkeeper"
                  ? "Goalkeepers"
                  : position === "Defence"
                    ? "Defenders"
                    : position === "Midfield"
                      ? "Midfielders"
                      : position === "Offence"
                        ? "Forwards"
                        : "Reserves / Others"}
              </p>
              <div className="md:grid grid-cols-2 gap-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between py-2 border-b  bg-[#131313] p-4 rounded-md border border-[#e8ff47]/10 text-white my-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#292c33] flex items-center justify-center text-[#e8ff47] text-xs font-bold">
                        {getInitials(player.name)}
                      </div>
                      <div>
                        <p className="text-white text-sm">{player.name}</p>
                        <p className="text-[#8A93A8] text-xs">
                          {player.nationality}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-white text-sm">Age</p>
                      <p className="text-[#8A93A8] text-xs">
                        {player.dateOfBirth
                          ? calculateAge(player.dateOfBirth)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
