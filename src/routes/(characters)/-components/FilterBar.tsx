import { useNavigate } from "@tanstack/react-router";
import { Button } from "@lib/components/Button";
import { FilterOption, filterLabels, filterOptions } from "@lib/constants/filters";

export const FilterBar = ({ activeFilter }: { activeFilter: FilterOption }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto flex flex-wrap gap-2 px-4">
      {filterOptions.map((filter) => (
        <Button
          key={filter}
          active={filter === activeFilter}
          // Drive the filter through the URL search param so it is shareable and
          // survives reloads/back-forward navigation.
          onClick={() => navigate({ to: "/", search: { filter } })}
        >
          {filterLabels[filter]}
        </Button>
      ))}
    </div>
  );
};
