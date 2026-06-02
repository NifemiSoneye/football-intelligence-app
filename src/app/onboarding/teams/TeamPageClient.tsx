"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import TeamPicker from "@/components/preferences/TeamPicker";
import { Button } from "@/components/ui/button";
import { savePreferencesAction } from "@/app/actions/preferences-actions";
import {
  userPreferencesInputSchema,
  type userPreferencesInputType,
} from "@/zod-schemas/preferences";
import StepIndicator from "@/components/preferences/StepIndicator";
import { Suspense } from "react";

function TeamPageClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  const selectedLeagues: number[] = JSON.parse(
    searchParams.get("leagues") ?? "[]",
  );

  const { execute, isPending } = useAction(savePreferencesAction, {
    onSuccess: () => router.push("/dashboard"),
    onError: () => console.error("Failed to save preferences"),
  });

  const handleSubmit = () => {
    execute({
      favoriteLeaguesIds: selectedLeagues,
      favoriteTeamsIds: selectedTeams,
    });
  };

  return (
    <div className="">
      <StepIndicator step={2} />
      <section className="mb-10">
        <p className="text-[#e8ff47] text-[11px] font-semibold mb-2 tracking-[0.15em]">
          STEP 2 OF 2
        </p>
        <h1 className="uppercase text-white text-[2.8rem] leading-[0.95] mb-3 font-display tracking-[0.02em] font-semibold lg:text-[4.5rem]">
          Pick your <br /> teams
        </h1>
        <p className="text-[15px] text-[#666] leading-[1.6]">
          Choose the teams you want to follow across your selected leagues.
        </p>
      </section>

      <TeamPicker
        selectedLeagues={selectedLeagues}
        selected={selectedTeams}
        onChange={setSelectedTeams}
      />
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-[15px] text-[#666] leading-[1.6] flex gap-2 ">
            <span className="text-[#e8ff47] font-display">
              {selectedTeams.length}
            </span>
            teams selected
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedTeams.length === 0}
          >
            {isPending ? "Saving..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TeamPageClient() {
  return (
    <Suspense fallback={null}>
      <TeamPageClientInner />
    </Suspense>
  );
}
