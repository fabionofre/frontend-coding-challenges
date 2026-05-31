import { useAppStore } from "./useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      preferredHouse: undefined,
      favorites: [],
    });
  });

  describe("setPreferredHouse", () => {
    it("sets a specific house", () => {
      useAppStore.getState().setPreferredHouse("Gryffindor");
      expect(useAppStore.getState().preferredHouse).toBe("Gryffindor");
    });

    it("sets null to show all characters", () => {
      useAppStore.getState().setPreferredHouse(null);
      expect(useAppStore.getState().preferredHouse).toBeNull();
    });

    it("sets undefined to trigger house selection", () => {
      useAppStore.getState().setPreferredHouse("Slytherin");
      useAppStore.getState().setPreferredHouse(undefined);
      expect(useAppStore.getState().preferredHouse).toBeUndefined();
    });
  });

  describe("toggleFavorite", () => {
    it("adds an id when it is not yet a favorite", () => {
      useAppStore.getState().toggleFavorite("1");
      expect(useAppStore.getState().favorites).toEqual(["1"]);
    });

    it("removes an id that is already a favorite", () => {
      useAppStore.setState({ favorites: ["1", "2"] });
      useAppStore.getState().toggleFavorite("1");
      expect(useAppStore.getState().favorites).toEqual(["2"]);
    });

    it("persists favorites to localStorage", () => {
      useAppStore.getState().toggleFavorite("7");
      const stored = JSON.parse(localStorage.getItem("the-harry-potter-app-storage") ?? "{}");
      expect(stored.state.favorites).toContain("7");
    });
  });
});
