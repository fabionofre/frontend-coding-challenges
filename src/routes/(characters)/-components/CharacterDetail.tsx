import { MouseEvent, ReactNode } from "react";
import { BookOpen, Church, Sparkles, Star, User } from "lucide-react";
import { cn, formatDate } from "@lib/utils";
import { Character } from "@lib/constants/characters";
import { useAppStore } from "@lib/hooks/useAppStore";

// Figma design tokens (HP Code Challenge → Characters Details).
const PARCHMENT = "text-parchment"; // primary text / values / titles
const MUTED = "text-muted"; // field labels
const ALIAS = "text-faint"; // "Also known as" caption

const FALLBACK = "—";

const text = (value?: string | null) => (value && value.trim() ? value : FALLBACK);

const yesNo = (value?: boolean) => (value ? "Yes" : "No");

// "wizard/witch status" — derive the label from the magical flag + gender.
const magicalStatus = (character: Character) => {
  if (!character.wizard) return "Non-magical";
  if (character.gender === "female") return "Witch";
  if (character.gender === "male") return "Wizard";
  return "Magical";
};

// Section heading: Cinzel Decorative Bold 22px in parchment, icon 20px, 10px gap.
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-[18px]">
    <h3 className={cn("flex items-center gap-2.5 text-[22px] leading-tight font-bold", PARCHMENT)}>
      {icon}
      {title}
    </h3>
    {children}
  </section>
);

// Two-column grid of label/value pairs. Row col-gap 10px, row-gap 18px (Figma "Row" rhythm).
const Grid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-2.5 gap-y-[18px]">{children}</div>
);

// Label (#53524F) over value (#F1DBB5), 8px apart, both Cinzel 16px.
const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className={cn("text-base", MUTED)}>{label}</span>
    <span className={cn("text-base", PARCHMENT)}>{value}</span>
  </div>
);

const Divider = () => <hr className="border-t border-gray-200/15" />;

export const CharacterDetail = ({ character }: { character: Character }) => {
  const isFavorite = useAppStore((store) => store.favorites.includes(character.id));
  const toggleFavorite = useAppStore((store) => store.toggleFavorite);

  const aliases = character.alternate_names?.filter(Boolean) ?? [];
  const alternateActors = character.alternate_actors?.filter(Boolean) ?? [];

  const handleToggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleFavorite(character.id);
  };

  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-[18px] px-4 pt-4 pb-16 sm:flex-row sm:items-start">
      {/* Left column: image card (262×369) + "Also known as" caption, 14px apart. */}
      <div className="flex flex-col gap-3.5">
        <div className="relative flex h-[369px] w-[262px] shrink-0 overflow-hidden rounded-[20px] shadow-md shadow-zinc-950">
          {character.image ? (
            <img
              src={character.image}
              alt={character.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
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
            className={cn("absolute top-3 right-3 z-10 transition hover:scale-110", PARCHMENT)}
          >
            <Star size={24} className={cn(isFavorite && "fill-amber-300 text-amber-300")} />
          </button>

          <h2
            className={cn("absolute right-3 bottom-3 left-3 z-10 text-lg tracking-wide", PARCHMENT)}
          >
            {character.name ?? "Unknown"}
          </h2>
        </div>

        {aliases.length > 0 ? (
          <p className={cn("w-[262px] text-base", ALIAS)}>Also known as: {aliases.join(", ")}</p>
        ) : null}
      </div>

      {/* Info card: #09090B, 20px radius, 24px padding, 18px gaps. */}
      <div className="bg-surface flex w-full flex-col gap-[18px] rounded-[20px] p-6 sm:w-[544px]">
        <Section title="Basic Information" icon={<User size={20} />}>
          <Grid>
            <Field label="Species" value={text(character.species)} />
            <Field label="Gender" value={text(character.gender)} />
            <Field label="Date of Birth" value={formatDate(character.dateOfBirth) ?? FALLBACK} />
            <Field label="Ancestry" value={text(character.ancestry)} />
            <Field label="Eye Color" value={text(character.eyeColour)} />
            <Field label="Hair Color" value={text(character.hairColour)} />
          </Grid>
        </Section>

        <Divider />

        <Section title="Magical Information" icon={<Sparkles size={20} />}>
          <Grid>
            <Field label="Wizard/Witch" value={magicalStatus(character)} />
            <Field label="Patronus" value={text(character.patronus)} />
          </Grid>
        </Section>

        <Divider />

        <Section title="Hogwarts" icon={<Church size={20} />}>
          <Grid>
            <Field label="Student" value={yesNo(character.hogwartsStudent)} />
            <Field label="Staff" value={yesNo(character.hogwartsStaff)} />
          </Grid>
        </Section>

        <Divider />

        <Section title="Portrayed By" icon={<BookOpen size={20} />}>
          <div className="flex flex-col gap-[18px]">
            <p className={cn("text-lg tracking-wide", PARCHMENT)}>{text(character.actor)}</p>
            {alternateActors.length > 0 ? (
              <Field label="Alternate Actors" value={alternateActors.join(", ")} />
            ) : null}
          </div>
        </Section>
      </div>
    </div>
  );
};
