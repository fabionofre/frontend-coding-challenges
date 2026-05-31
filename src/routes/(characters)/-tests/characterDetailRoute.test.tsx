import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "../../../routeTree.gen";
import { useAppStore } from "@lib/hooks/useAppStore";
import * as api from "@lib/api/characters";
import { mockCharacter } from "../../../test/mocks";

// Mount the real generated route tree against an in-memory history so the actual
// `$characterId` route — loader (prefetch), component, and notFoundComponent — runs.
const renderAt = (path: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(
    <QueryClientProvider client={queryClient}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RouterProvider router={router as any} />
    </QueryClientProvider>
  );
  return router;
};

describe("$characterId route", () => {
  beforeEach(() => {
    // Pass the house-preference gateway so the routed Outlet (detail page) renders.
    useAppStore.setState({ preferredHouse: null, favorites: [] });
  });

  it("pre-fetches the character via the route loader and renders its detail", async () => {
    const spy = vi.spyOn(api, "fetchCharacter").mockResolvedValue(mockCharacter);

    renderAt("/1");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Harry Potter" })).toBeInTheDocument()
    );
    // The loader prefetched id "1" through the shared query options.
    expect(spy).toHaveBeenCalledWith("1");
    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByText("Portrayed By")).toBeInTheDocument();
  });

  it("renders the not-found UI (with a back link) when the character is missing", async () => {
    vi.spyOn(api, "fetchCharacter").mockResolvedValue(null);

    renderAt("/999");

    await waitFor(() => expect(screen.getByText("Character not found.")).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /back to all characters/i })).toBeInTheDocument();
  });
});
