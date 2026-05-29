"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import TeamPicker from "@/components/preferences/TeamPicker";
import { Button } from "@/components/ui/button";
import { savePreferencesAction } from "@/app/actions/preferences-actions";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import LeaguePicker from "@/components/preferences/LeaguePicker";
import { useToast } from "@/hooks/use-toast";
type Props = {
  initialLeagues: number[];
  initialTeams: number[];
  KindeUser: KindeUser<Record<string, any>> | null;
};

export default function SettingsClient({
  initialTeams,
  initialLeagues,
  KindeUser,
}: Props) {
  const { toast } = useToast();
  const [selectedTeams, setSelectedTeams] = useState<number[]>(initialTeams);
  const [selectedLeagues, setSelectedLeagues] =
    useState<number[]>(initialLeagues);

  const { execute, isPending } = useAction(savePreferencesAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast({
          variant: "default",
          title: "Success! 🎉",
          description: data?.message,
        });
      }
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Save failed",
      });
    },
  });

  const handleLeagueChange = (ids: number[]) => {
    setSelectedLeagues(ids);
    setSelectedTeams([]); // reset teams when leagues change
  };

  const handleSubmit = () => {
    execute({
      favoriteLeaguesIds: selectedLeagues,
      favoriteTeamsIds: selectedTeams,
    });
  };
  return (
    <div>
      <section className="min-h-screen bg-[#0a0a0a] p-4 relative overflow-hidden">
        <h1 className="uppercase text-white text-[2rem] leading-[0.95] my-3 font-display tracking-[0.02em] font-semibold lg:text-[4.5rem] italic lg:not-italic">
          Account settings
        </h1>

        <p className=" text-[15px] text-[#666] leading-[1.6] hidden md:block mb-3 ">
          Manage your precision data preferences
        </p>

        <div className="flex items-center gap-3">
          <div className="h-7 w-1 bg-[#e8ff47]"></div>
          <p className="uppercase text-[1.5rem] text-white font-display ">
            Profile Information
          </p>
        </div>
        <section className="my-3 md:flex  md:gap-3 md:bg-[#131313] md:border md:border-[#2d320e] md:p-5">
          <div className="w-full">
            <Label htmlFor="name" className="text-white  text-[14px] my-2">
              Display Name
            </Label>
            <Input
              name="name"
              type="text"
              readOnly
              value={`${KindeUser?.given_name ?? ""} ${KindeUser?.family_name ?? ""}`}
              className="text-white rounded-none p-5 uppercase bg-[#131313] border-[#4d5518] cursor-not-allowed opacity-60 outline-none w-full "
            />
          </div>
          <div className="w-full">
            <Label htmlFor="email" className="text-white  text-[14px] my-2">
              Email Address
            </Label>
            <Input
              name="email"
              type="text"
              readOnly
              value={KindeUser?.email ?? ""}
              className="text-white rounded-none p-5 bg-[#131313] border-[#4d5518] cursor-not-allowed opacity-60 outline-none w-full"
            />
          </div>
        </section>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 my-3">
            <div className="h-7 w-1 bg-[#e8ff47]"></div>
            <p className="uppercase text-[1.5rem] text-white font-display ">
              Favorite Leagues
            </p>
          </div>
          <p className="text-[15px] text-[#666] leading-[1.6] flex gap-2 ">
            <span className="text-[#e8ff47] font-display">
              {selectedLeagues.length}
            </span>
            selected
          </p>
        </div>

        <LeaguePicker
          selected={selectedLeagues}
          onChange={handleLeagueChange}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 my-3">
            <div className="h-7 w-1 bg-[#e8ff47]"></div>
            <p className="uppercase text-[1.5rem] text-white font-display ">
              Favorite Teams
            </p>
          </div>
          <p className="text-[15px] text-[#666] leading-[1.6] flex gap-2 ">
            <span className="text-[#e8ff47] font-display">
              {selectedTeams.length}
            </span>
            selected
          </p>
        </div>
        <TeamPicker
          selectedLeagues={selectedLeagues}
          selected={selectedTeams}
          onChange={setSelectedTeams}
        />
        <div className="my-4">
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedTeams.length === 0}
            className="p-5 rounded-none md:"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </section>
    </div>
  );
}
