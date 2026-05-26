"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import {
  insertUserPreferencesSchema,
  type insertUserPreferencesType,
} from "@/zod-schemas/preferences";
import { savePreferencesAction } from "../actions/preferences-actions";
import LeaguePicker from "@/components/preferences/LeaguePicker";
import TeamPicker from "@/components/preferences/TeamPicker";
import { Button } from "@/components/ui/button";

export default function OnboardingForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<insertUserPreferencesType>({
    resolver: zodResolver(insertUserPreferencesSchema),
    defaultValues: {
      favoriteLeaguesIds: [],
      favoriteTeamsIds: [],
    },
  });

  const selectedLeagues = watch("favoriteLeaguesIds");

  const { execute, isPending } = useAction(savePreferencesAction, {
    onSuccess: () => router.push("/dashboard"),
    onError: () => console.error("Failed to save preferences"),
  });

  const onSubmit = (data: insertUserPreferencesType) => {
    execute(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">
        Welcome! Let's set up your profile
      </h1>
      <p className="text-muted-foreground mb-8">
        Pick the leagues and teams you want to follow.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Select your leagues</h2>
          <Controller
            control={control}
            name="favoriteLeaguesIds"
            render={({ field }) => (
              <LeaguePicker selected={field.value} onChange={field.onChange} />
            )}
          />
          {errors.favoriteLeaguesIds && (
            <p className="text-destructive text-sm mt-2">
              {errors.favoriteLeaguesIds.message}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Select your teams</h2>
          <Controller
            control={control}
            name="favoriteTeamsIds"
            render={({ field }) => (
              <TeamPicker
                selectedLeagues={selectedLeagues}
                selected={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Get Started"}
        </Button>
      </form>
    </div>
  );
}
