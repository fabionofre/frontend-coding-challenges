import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { filterOptions } from "@lib/constants/filters";
import { CharactersGrid } from "./-components/CharactersGrid";
import { FilterBar } from "./-components/FilterBar";

// Validate the filter search param; fall back to "all" for missing/invalid values.
const characterSearchSchema = z.object({
  filter: z.enum(filterOptions).catch("all"),
});

export const Route = createFileRoute("/(characters)/")({
  validateSearch: characterSearchSchema,
  component: CharactersIndexView,
});

function CharactersIndexView() {
  const { filter } = Route.useSearch();

  return (
    <div className="flex flex-col gap-8">
      <FilterBar activeFilter={filter} />
      <CharactersGrid filter={filter} />
    </div>
  );
}
