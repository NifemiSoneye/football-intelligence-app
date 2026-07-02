"use client";

import { LogOut, UserRound } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Header() {
  const { toggle } = useSidebar();
  return (
    <div className="p-4 flex items-center justify-between bg-[#131313] border-b border-b-[#4d5518]">
      <p className="uppercase text-[#e8ff47] font-display text-[1.2rem]">
        Football Analytics
      </p>
      <div className="flex items-center gap-4">
        <LogoutLink className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e8ff47] text-black text-xs font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </LogoutLink>
        <div onClick={toggle} className="md:hidden cursor-pointer">
          <UserRound className="w-5 h-5 text-[#e8ff47]" />
        </div>
      </div>
    </div>
  );
}
