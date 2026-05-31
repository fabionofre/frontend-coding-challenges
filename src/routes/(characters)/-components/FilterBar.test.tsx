import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { FilterBar } from "./FilterBar";
import { FilterOption, filterOptions } from "@lib/constants/filters";

// Mount FilterBar inside a minimal router so useNavigate + the `filter` search param
// behave like they do in the real index route.
const renderFilterBar = (initialPath = "/") => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    validateSearch: (search: Record<string, unknown>) => ({
      filter: (filterOptions.includes(search.filter as FilterOption)
        ? (search.filter as FilterOption)
        : "all") as FilterOption,
    }),
    component: () => {
      const { filter } = indexRoute.useSearch();
      return <FilterBar activeFilter={filter} />;
    },
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
  render(<RouterProvider router={router} />);
  return router;
};

describe("FilterBar", () => {
  it("renders all four filter options with their labels", async () => {
    renderFilterBar();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "All Characters" })).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Students" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Staff" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Favorite" })).toBeInTheDocument();
  });

  it("marks the active filter and leaves the others inactive", async () => {
    renderFilterBar("/?filter=staff");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Staff" })).toHaveClass("bg-tab-active")
    );
    expect(screen.getByRole("button", { name: "All Characters" })).not.toHaveClass("bg-tab-active");
  });

  it("navigates with the filter search param when a tab is clicked", async () => {
    const router = renderFilterBar();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Students" })).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole("button", { name: "Students" }));

    await waitFor(() => expect(router.state.location.search).toEqual({ filter: "students" }));
    expect(screen.getByRole("button", { name: "Students" })).toHaveClass("bg-tab-active");
  });
});
