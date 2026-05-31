import { useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";
import { useAppStore } from "@lib/hooks/useAppStore";

export const Toolbar = () => {
  const router = useRouter();
  const routerState = useRouterState();
  const isRootRoute = routerState.location.pathname === "/";
  const setPreferredHouse = useAppStore((store) => store.setPreferredHouse);

  const handleHouseSelection = () => {
    setPreferredHouse(undefined);
    if (!isRootRoute) {
      router.navigate({ to: "/" });
    }
  };

  const handleBack = () => {
    // On a deep link (e.g. opening a character URL directly) there is no in-app
    // history to pop, so going "back" would leave the app. Fall back to the list.
    if (router.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    // Figma "Frame 1": row, h≈60px, padding 16px 32px, gradient #160F12 → #2E1C15, gold text.
    <div className="flex h-15 items-center justify-between bg-linear-to-r from-[#160f12] to-[#2e1c15] px-8">
      <div className="flex flex-1 items-center">
        <div className="mr-4 flex w-8 items-center justify-center">
          {!isRootRoute && (
            <button onClick={handleBack} className="text-gold hover:text-gold/80">
              <ArrowLeft size={20} />
            </button>
          )}
        </div>
        <h1 className="font-decorative text-gold text-xl tracking-tight">The Harry Potter App</h1>
      </div>

      <button
        onClick={handleHouseSelection}
        className="font-decorative text-gold hover:text-gold/80 flex items-center gap-2 tracking-tight"
        aria-label="Change house selection"
      >
        <span className="text-xl">CHANGE HOUSE</span>
        <Shield size={20} />
      </button>
    </div>
  );
};
