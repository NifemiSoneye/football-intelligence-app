"use client";
import { Home, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import { ChevronDown, Trophy, ChevronUp } from "lucide-react";
import { LEAGUES } from "@/lib/constants";
import { useState } from "react";
import { Search } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

type Props = {
  leagueIds: number[];
};

export default function SideBar({ leagueIds }: Props) {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}
      <aside
        className={`
    fixed left-0 top-0 h-full w-55 z-50
    transition-transform duration-300 min-h-screen overflow-hidden
    flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:z-auto lg:sticky lg:top-0 lg:h-screen bg-[#0a0a0a]
    border-r border-r-[#4d5518] py-4
  `}
      >
        <div className="border-b border-b-[#292c33] md:hidden">
          <p className="uppercase text-[#e8ff47] p-3 font-display text-[1.2rem]">
            Football Analytics
          </p>
        </div>
        <div className="flex-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 p-3 ${pathname === "/dashboard" ? "text-[#e8ff47]" : "text-white"}`}
            onClick={toggle}
          >
            <Home className="w-5 h-5" />
            <p>Home</p>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 p-3 ${pathname === "/dashboard/settings" ? "text-[#e8ff47] font-semibold" : "text-white"}`}
            onClick={toggle}
          >
            <Settings className="w-5 h-5" />
            <p>Settings</p>
          </Link>
          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-3 p-3 ${pathname.startsWith("/dashboard/league") ? "text-[#e8ff47] font-semibold" : "text-white"}`}
            >
              <Trophy className="w-5 h-5" />
              Leagues {dropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            {dropdownOpen && (
              <div className="mx-3">
                {leagueIds.map((id) => {
                  const league = LEAGUES.find((l) => l.id === id);
                  if (!league) return null;
                  return (
                    <Link
                      key={id}
                      href={`/dashboard/league/${id}`}
                      onClick={() => {
                        setDropdownOpen(false);
                        toggle();
                      }}
                      className={`flex items-center gap-3 p-3 text-[13px] ${pathname === `/dashboard/league/${id}` ? "text-[#e8ff47] font-semibold" : "text-white"}`}
                    >
                      <Image
                        src={league.crest}
                        alt={league.name}
                        width={20}
                        height={20}
                      />
                      {league.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <Link
            href="/dashboard/saved-analyses"
            className={`flex items-center gap-3 p-3 ${pathname === "/dashboard/saved-analyses" ? "text-[#e8ff47] font-semibold" : "text-white"}`}
            onClick={toggle}
          >
            <Search className="w-5 h-5" />
            <p>Analyses</p>
          </Link>
        </div>
        <div className="lg:hidden px-3 pb-2">
          <LogoutLink className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-[#e8ff47] text-black text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </LogoutLink>
        </div>
      </aside>
    </>
  );
}
