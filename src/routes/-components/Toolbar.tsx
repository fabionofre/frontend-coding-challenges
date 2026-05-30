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
    <div className="flex items-center justify-between bg-amber-900/15 p-4">
      <div className="flex flex-1 items-center">
        <div className="mr-4 flex w-8 items-center justify-center">
          {!isRootRoute && (
            <button onClick={handleBack} className="text-amber-200 hover:text-amber-100">
              <ArrowLeft size={20} />
            </button>
          )}
        </div>
        <h1 className="text-xl font-medium text-amber-200">The Harry Potter App</h1>
      </div>

      <button
        onClick={handleHouseSelection}
        className="flex items-center gap-2 pr-9 text-amber-200 hover:text-amber-100"
        aria-label="Change house selection"
      >
        <span className="text-sm font-medium">Change House</span>
        <Shield size={20} />
      </button>
    </div>
  );
};
