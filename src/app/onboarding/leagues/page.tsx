"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeaguePicker from "@/components/preferences/LeaguePicker";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/preferences/StepIndicator";

export default function LeaguesPage() {
  const router = useRouter();
  const [selectedLeagues, setSelectedLeagues] = useState<number[]>([]);

  const handleNext = () => {
    const params = new URLSearchParams();
    params.set("leagues", JSON.stringify(selectedLeagues));
    router.push(`/onboarding/teams?${params.toString()}`);
  };

  return (
    <div className="space-y-8 ">
      <StepIndicator step={1} />
      <h2 className="text-lg font-semibold">Select your leagues</h2>
      <LeaguePicker selected={selectedLeagues} onChange={setSelectedLeagues} />
      <Button onClick={handleNext} disabled={selectedLeagues.length === 0}>
        Next
      </Button>
    </div>
  );
}
