import { useQuery } from "@tanstack/react-query";
import { fetchCharacters } from "@lib/api/characters";
import { useAppStore } from "@lib/hooks/useAppStore";
import { Character } from "@lib/constants/characters";

export const useCharacters = () => {
  const { preferredHouse } = useAppStore();
  const { data, ...rest } = useQuery<Character[]>({
    // Bug fix: queryKey must include `preferredHouse`. The queryFn depends on it,
    // but the key was static (["characters"]). Combined with `staleTime: Infinity`,
    // React Query served the first house's cached data forever and never refetched
    // when the user switched houses (or to "all"). Keying by house caches each
    // house separately and triggers a fetch on change.
    queryKey: ["characters", preferredHouse], // BUG #1
    queryFn: () => fetchCharacters(preferredHouse),
    staleTime: Infinity,
  });

  const characters = data?.filter((character) => character.image) || [];

  return {
    characters,
    ...rest,
  };
};
