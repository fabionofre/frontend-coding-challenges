import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Toolbar } from "./Toolbar";
import { useAppStore } from "@lib/hooks/useAppStore";

// Mount the Toolbar inside a minimal in-memory router so its router-driven
// behavior (back navigation, change-house) is exercised for real.
const renderToolbar = (history: ReturnType<typeof createMemoryHistory>) => {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Toolbar />
        <Outlet />
      </>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div>List</div>,
  });
  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/$characterId",
    component: () => <div>Detail</div>,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, detailRoute]),
    history,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(<RouterProvider router={router as any} />);
  return router;
};

describe("Toolbar", () => {
  beforeEach(() => {
    useAppStore.setState({ preferredHouse: null });
  });

  it("hides the back button on the root route", async () => {
    renderToolbar(createMemoryHistory({ initialEntries: ["/"] }));
    await waitFor(() => expect(screen.getByText("List")).toBeInTheDocument());
    // Only the "Change House" button is present at root.
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("shows a back button off-root and navigates back through history", async () => {
    const router = renderToolbar(
      createMemoryHistory({ initialEntries: ["/", "/1"], initialIndex: 1 })
    );
    await waitFor(() => expect(screen.getByText("Detail")).toBeInTheDocument());

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2); // back + change house

    await userEvent.click(buttons[0]); // the back button comes first in the DOM
    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });

  it("falls back to the list when there is no history to pop (deep link)", async () => {
    const router = renderToolbar(createMemoryHistory({ initialEntries: ["/1"] }));
    await waitFor(() => expect(screen.getByText("Detail")).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button")[0]);
    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });

  it("change house clears the preference and returns to the root", async () => {
    const router = renderToolbar(createMemoryHistory({ initialEntries: ["/1"] }));
    await waitFor(() => expect(screen.getByText("Detail")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /change house selection/i }));

    expect(useAppStore.getState().preferredHouse).toBeUndefined();
    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });
});
