import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCharacter } from "@lib/api/characters";
import { Character } from "@lib/constants/characters";

// Shared query definition so the route loader (ensureQueryData) and the component
// (useQuery) use the exact same key + fetcher: the loader prefetches, the component
// reads straight from the cache with no second request.
export const characterQueryOptions = (id: string) =>
  queryOptions<Character | null>({
    queryKey: ["character", id],
    queryFn: () => fetchCharacter(id),
    staleTime: Infinity,
  });

export const useCharacter = (id: string) => useQuery(characterQueryOptions(id));
