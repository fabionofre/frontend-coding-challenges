import { Spinner } from "@lib/components/Spinner";
import { FilterOption } from "@lib/constants/filters";
import { CharacterCard } from "./CharacterCard";
import { useCharacters } from "../-hooks/useCharacters";

export const CharactersGrid = ({ filter }: { filter: FilterOption }) => {
  const { characters, isLoading, isError } = useCharacters(filter);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg text-amber-200/60">Something went wrong while fetching characters.</p>
        <p className="text-sm text-amber-200/30">Please try again later.</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="text-lg text-amber-200/60">No characters found.</p>
        <p className="text-sm text-amber-200/30">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid w-min grid-cols-[repeat(auto-fill,minmax(200px,max-content))] gap-4">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          className="transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        />
      ))}
    </div>
  );
};
