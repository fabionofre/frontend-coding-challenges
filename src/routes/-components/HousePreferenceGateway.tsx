import { ReactNode } from "react";
import { Button } from "@lib/components/Button";
import { useAppStore } from "@lib/hooks/useAppStore";
import { houses } from "@lib/constants/houses";
import { HouseCard } from "./HouseCard";

interface HousePreferenceGatewayProps {
  children: ReactNode;
}

export const HousePreferenceGateway = ({ children }: HousePreferenceGatewayProps) => {
  const preferredHouse = useAppStore((store) => store.preferredHouse);
  const setPreferredHouse = useAppStore((store) => store.setPreferredHouse);

  // Bug fix: the gateway must only block on `undefined` (no choice made yet).
  // `null` is a deliberate choice meaning "show all characters", but `if (preferredHouse)`
  // is falsy for `null` too, so clicking "Show all characters" set the state to `null`
  // and then immediately re-rendered the selection screen — the button could never be
  // used. Check explicitly against `undefined` so `null` passes through.
  if (preferredHouse !== undefined) return <>{children}</>;

  return (
    // Figma "Home": column, centered, title → houses row (gap 32px) → CTA.
    <div className="my-auto flex flex-col items-center gap-12">
      <h1 className="text-parchment text-center text-4xl tracking-wide">
        Choose your preferred house
      </h1>

      <div className="flex flex-wrap items-center justify-evenly gap-8">
        {houses.map((house) => (
          <HouseCard key={house} house={house} onClick={setPreferredHouse} />
        ))}
      </div>

      <Button
        onClick={() => setPreferredHouse(null)}
        className="text-parchment h-auto px-4 py-2 font-serif text-2xl"
      >
        Show all characters
      </Button>
    </div>
  );
};
