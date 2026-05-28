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

export default function TeamsPage() {
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
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">Select your teams</h2>
      <TeamPicker
        selectedLeagues={selectedLeagues}
        selected={selectedTeams}
        onChange={setSelectedTeams}
      />
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : "Get Started"}
        </Button>
      </div>
    </div>
  );
}
