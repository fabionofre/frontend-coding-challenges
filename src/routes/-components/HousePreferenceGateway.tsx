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
  if (preferredHouse !== undefined) return <>{children}</>; // BUG #2

  return (
    <div className="flex flex-col items-center justify-center gap-8 pt-30">
      <h1 className="text-center text-3xl tracking-widest font-stretch-extra-expanded">
        Choose your preferred house
      </h1>

      <div className="flex flex-wrap items-center justify-evenly gap-12">
        {houses.map((house) => (
          <HouseCard key={house} house={house} onClick={setPreferredHouse} />
        ))}
      </div>

      <Button onClick={() => setPreferredHouse(null)} className="self-center text-lg">
        Show all characters
      </Button>
    </div>
  );
};
