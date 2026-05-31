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

// Figma "character-card": 250×350, 20px radius, drop shadow, bottom fade,
// name (Cinzel Decorative 18px, parchment) bottom-left, favorite star top-right.
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
        "relative isolate flex h-[350px] w-[250px] flex-col justify-end overflow-hidden rounded-[20px] px-3 py-4 shadow-[0_10px_10px_0_rgba(0,0,0,0.25)]",
        className
      )}
    >
      <img
        src={character.image || undefined}
        alt={character.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Bottom fade: transparent until 82%, then black 0.8 (Figma gradient). */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-[82%] to-black/80" />
      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Remove ${character.name} from favorites`
            : `Add ${character.name} to favorites`
        }
        className="text-parchment absolute top-3 right-3 z-10 transition hover:scale-110"
      >
        <Star size={24} className={cn(isFavorite && "fill-amber-300 text-amber-300")} />
      </button>
      <h3 className="font-decorative text-parchment z-10 text-lg tracking-wide">
        {character.name}
      </h3>
    </Link>
  );
};
