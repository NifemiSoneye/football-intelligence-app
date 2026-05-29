import React from "react";
import { UserRound } from "lucide-react";

export default function Header() {
  return (
    <div className="p-4 flex items-center justify-between bg-[#131313] border-b border-b-[#4d5518]">
      <p className="uppercase  text-[#e8ff47] font-display text-[1.2rem]">
        Football Analytics
      </p>
      <div>
        <UserRound className="w-5 h-5 text-[#e8ff47]" />
      </div>
    </div>
  );
}
