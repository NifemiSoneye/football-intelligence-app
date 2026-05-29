"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeaguePicker from "@/components/preferences/LeaguePicker";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/preferences/StepIndicator";

export default function LeaguePageClient() {
  const router = useRouter();
  const [selectedLeagues, setSelectedLeagues] = useState<number[]>([]);

  const handleNext = () => {
    const params = new URLSearchParams();
    params.set("leagues", JSON.stringify(selectedLeagues));
    router.push(`/onboarding/teams?${params.toString()}`);
  };

  return (
    <div className="">
      <StepIndicator step={1} />
      <section className="mb-10">
        <p className="text-[#e8ff47] text-[11px] font-semibold mb-2 tracking-[0.15em]">
          STEP 1 OF 2
        </p>
        <h1 className="uppercase text-white text-[2.8rem] leading-[0.95] mb-3 font-display tracking-[0.02em] font-semibold lg:text-[4.5rem]">
          Choose your <br /> leagues
        </h1>
        <p className="text-[15px] text-[#666] leading-[1.6] lg:hidden">
          Select the competitions you want to follow. You can always change
          these later.
        </p>
        <p className="text-[15px] text-[#666] leading-[1.6] hidden lg:block">
          Select the competitions you want to follow. You can always change{" "}
          <br />
          these later.
        </p>
      </section>

      <LeaguePicker selected={selectedLeagues} onChange={setSelectedLeagues} />
      <div className="flex items-center justify-between mt-4 ">
        <p className="text-[15px] text-[#666] leading-[1.6] flex gap-2 ">
          <span className="text-[#e8ff47] font-display">
            {selectedLeagues.length}
          </span>
          leagues selected
        </p>
        <Button onClick={handleNext} disabled={selectedLeagues.length === 0}>
          Next
        </Button>
      </div>
    </div>
  );
}
