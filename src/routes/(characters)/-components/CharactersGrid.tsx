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
        <p className="text-parchment/60 text-lg">Something went wrong while fetching characters.</p>
        <p className="text-parchment/30 text-sm">Please try again later.</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="text-parchment/60 text-lg">No characters found.</p>
      </div>
    );
  }

  // Figma grid: 250px cards, 20px gap, 60px side padding. Wrap + center each row.
  return (
    <div className="flex w-full flex-wrap gap-5 px-4 pb-5 sm:px-15">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          className="transition-transform duration-300 hover:scale-105"
        />
      ))}
    </div>
  );
};
