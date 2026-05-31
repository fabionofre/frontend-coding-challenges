import { PropsWithChildren } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCharacters } from "./useCharacters";
import { useAppStore } from "@lib/hooks/useAppStore";
import * as api from "@lib/api/characters";
import { mockCharacters } from "../../../test/mocks";

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const names = (characters: { name?: string }[]) => characters.map((c) => c.name);

describe("useCharacters filtering", () => {
  beforeEach(() => {
    useAppStore.setState({ preferredHouse: null, favorites: [] });
    vi.spyOn(api, "fetchCharacters").mockResolvedValue(mockCharacters);
  });

  it("returns only characters that have an image (Dobby has none)", async () => {
    const { result } = renderHook(() => useCharacters("all"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(names(result.current.characters)).toEqual([
      "Harry Potter",
      "Hermione Granger",
      "Severus Snape",
    ]);
  });

  it("filters to Hogwarts students", async () => {
    const { result } = renderHook(() => useCharacters("students"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(names(result.current.characters)).toEqual(["Harry Potter", "Hermione Granger"]);
  });

  it("filters to Hogwarts staff", async () => {
    const { result } = renderHook(() => useCharacters("staff"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(names(result.current.characters)).toEqual(["Severus Snape"]);
  });

  it("filters to favorites from the store", async () => {
    useAppStore.setState({ favorites: ["2"] });
    const { result } = renderHook(() => useCharacters("favorite"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(names(result.current.characters)).toEqual(["Hermione Granger"]);
  });
});
