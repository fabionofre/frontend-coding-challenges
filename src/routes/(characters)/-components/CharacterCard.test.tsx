import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { CharacterCard } from "./CharacterCard";
import { useAppStore } from "@lib/hooks/useAppStore";
import { mockCharacter } from "../../../test/mocks";

// Minimal in-memory router so the card's <Link> can render and (not) navigate.
const renderCard = () => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <CharacterCard character={mockCharacter} />,
  });
  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/$characterId",
    component: () => <div>Detail Page</div>,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, detailRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  render(<RouterProvider router={router} />);
  return router;
};

describe("CharacterCard", () => {
  beforeEach(() => {
    useAppStore.setState({ favorites: [] });
  });

  it("links to the character detail page", async () => {
    renderCard();
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Harry Potter" })).toBeInTheDocument()
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/1");
  });

  it("toggles favorite WITHOUT navigating when the star is clicked", async () => {
    const router = renderCard();
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Harry Potter" })).toBeInTheDocument()
    );

    const star = screen.getByRole("button", { name: /add harry potter to favorites/i });
    await userEvent.click(star);

    expect(useAppStore.getState().favorites).toContain("1");
    expect(router.state.location.pathname).toBe("/"); // did not navigate to /1
  });

  it("reflects the favorited state with an updated label", async () => {
    useAppStore.setState({ favorites: ["1"] });
    renderCard();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /remove harry potter from favorites/i })
      ).toBeInTheDocument()
    );
  });
});
