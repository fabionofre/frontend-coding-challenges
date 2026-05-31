import { MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { cn } from "@lib/utils";
import { Character } from "@lib/constants/characters";
import { useAppStore } from "@lib/hooks/useAppStore";

type CharacterCardProps = {
  character: Character;
  className?: string;
};

export const CharacterCard = ({ character, className }: CharacterCardProps) => {
  const isFavorite = useAppStore((store) => store.favorites.includes(character.id));
  const toggleFavorite = useAppStore((store) => store.toggleFavorite);

  const handleToggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    // The card is a Link; prevent the click from navigating to the detail page.
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(character.id);
  };

  return (
    <Link
      to="/$characterId"
      params={{ characterId: character.id }}
      className={cn(
        "relative isolate flex h-87.5 flex-col justify-end overflow-hidden rounded-2xl px-3 py-6 shadow-md shadow-zinc-950",
        className
      )}
    >
      <img
        src={character.image || undefined}
        alt={character.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-stone-900/20"></div>
      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Remove ${character.name} from favorites`
            : `Add ${character.name} to favorites`
        }
        className="absolute top-3 right-3 z-10 text-amber-200 transition hover:scale-110 hover:text-amber-100"
      >
        <Star size={22} className={cn(isFavorite && "fill-amber-300 text-amber-300")} />
      </button>
      <h3 className="z-10 font-light tracking-wide">{character.name}</h3>
    </Link>
  );
};
