import { Drama, GraduationCap, Info, Sparkles } from "lucide-react";
import { InfoSection } from "@lib/components/InfoSection";
import { Character } from "@lib/constants/characters";
import { formatDate } from "@lib/utils";

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

export const CharacterDetail = ({ character }: { character: Character }) => {
  const alternateActors = character.alternate_actors?.filter(Boolean) ?? [];

  return (
    <div className="container mx-auto flex max-w-3xl flex-col gap-8 px-4 pb-16">
      <header className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        {character.image ? (
          <img
            src={character.image}
            alt={character.name}
            className="h-56 w-44 shrink-0 rounded-2xl object-cover shadow-md shadow-zinc-950"
          />
        ) : null}
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-light tracking-wide">{character.name ?? "Unknown"}</h2>
          {character.house ? <p className="mt-1 text-amber-200/60">{character.house}</p> : null}
        </div>
      </header>

      <InfoSection title="Basic Information" icon={<Info size={20} />}>
        <InfoSection.Grid>
          <InfoSection.Item label="Species" value={text(character.species)} />
          <InfoSection.Item label="Gender" value={text(character.gender)} />
          <InfoSection.Item
            label="Date of Birth"
            value={formatDate(character.dateOfBirth) ?? FALLBACK}
          />
          <InfoSection.Item label="Ancestry" value={text(character.ancestry)} />
          <InfoSection.Item label="Eye Colour" value={text(character.eyeColour)} />
          <InfoSection.Item label="Hair Colour" value={text(character.hairColour)} />
        </InfoSection.Grid>
      </InfoSection>

      <InfoSection.Divider />

      <InfoSection title="Magical Information" icon={<Sparkles size={20} />}>
        <InfoSection.Grid>
          <InfoSection.Item label="Status" value={magicalStatus(character)} />
          <InfoSection.Item label="Patronus" value={text(character.patronus)} />
        </InfoSection.Grid>
      </InfoSection>

      <InfoSection.Divider />

      <InfoSection title="Hogwarts" icon={<GraduationCap size={20} />}>
        <InfoSection.Grid>
          <InfoSection.Item label="Student" value={yesNo(character.hogwartsStudent)} />
          <InfoSection.Item label="Staff" value={yesNo(character.hogwartsStaff)} />
        </InfoSection.Grid>
      </InfoSection>

      <InfoSection.Divider />

      <InfoSection title="Portrayed By" icon={<Drama size={20} />}>
        <InfoSection.Grid>
          <InfoSection.Item label="Actor" value={text(character.actor)} />
          {alternateActors.length > 0 ? (
            <InfoSection.Item label="Alternate Actors" value={alternateActors.join(", ")} />
          ) : null}
        </InfoSection.Grid>
      </InfoSection>
    </div>
  );
};
