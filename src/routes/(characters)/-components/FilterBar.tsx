import { useNavigate } from "@tanstack/react-router";
import { cn } from "@lib/utils";
import { FilterOption, filterLabels, filterOptions } from "@lib/constants/filters";

// Figma "Tab Bar": pill container (#211513, 12px radius, 4px padding) wrapping tabs.
// Each tab: Roboto Mono 16px, 8px/16px padding, 8px radius. Active = #905500 bg / #FFFBE8 text.
export const FilterBar = ({ activeFilter }: { activeFilter: FilterOption }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="bg-tabbar inline-flex gap-1 rounded-xl p-1">
        {filterOptions.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              // Drive the filter through the URL search param so it is shareable and
              // survives reloads/back-forward navigation.
              onClick={() => navigate({ to: "/", search: { filter } })}
              className={cn(
                "rounded-lg px-4 py-2 font-mono text-base whitespace-nowrap transition-colors outline-none",
                isActive
                  ? "bg-tab-active text-tab-active-foreground"
                  : "text-parchment hover:bg-white/5"
              )}
            >
              {filterLabels[filter]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
