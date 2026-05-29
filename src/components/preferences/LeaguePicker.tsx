"use client";

import { LEAGUES } from "@/lib/constants";
import Image from "next/image";

type Props = {
  selected: number[];
  onChange: (ids: number[]) => void;
};

export default function LeaguePicker({ selected, onChange }: Props) {
  const handleClick = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id)); // deselect
    } else {
      onChange([...selected, id]); // select
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
      {LEAGUES.map((league) => (
        <div
          key={league.id}
          onClick={() => handleClick(league.id)}
          style={
            selected.includes(league.id)
              ? {
                  boxShadow:
                    "0 0 0 1px #e8ff47, 0 8px 32px rgba(232,255,71,0.12)",
                }
              : undefined
          }
          className={` border p-5 cursor-pointer flex flex-col items-center rounded-md transition-all ${
            selected.includes(league.id)
              ? "border-[#e8ff47] bg-[#e8ff4712] "
              : "border-[#ffffff12] bg-[#111111]"
          }`}
        >
          <Image
            src={league.crest}
            alt={league.name}
            width={80}
            height={80}
            className="object-contain"
          />
          <p
            className={`font-semibold text-center  text-[13px] leading-[1.3] mt-3 transition-colors ${
              selected.includes(league.id) ? "text-[#e8ff47]" : "text-white "
            }`}
          >
            {league.name}
          </p>
          <p className="text-[11px] text-[#666]">{league.region}</p>
        </div>
      ))}
    </div>
  );
}
