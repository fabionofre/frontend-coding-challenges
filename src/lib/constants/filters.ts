export const characterFilters = ["students", "staff", "favorite"] as const;

export type CharacterFilterType = (typeof characterFilters)[number];

// "all" is the default (no-op) option that fronts the filter bar.
export const filterOptions = ["all", ...characterFilters] as const;

export type FilterOption = (typeof filterOptions)[number];

export const filterLabels: Record<FilterOption, string> = {
  all: "All Characters",
  students: "Students",
  staff: "Staff",
  favorite: "Favorite",
};
