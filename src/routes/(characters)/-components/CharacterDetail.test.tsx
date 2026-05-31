import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterDetail } from "./CharacterDetail";
import { useAppStore } from "@lib/hooks/useAppStore";
import { mockCharacter } from "../../../test/mocks";

describe("CharacterDetail", () => {
  it("renders every information section with its values", () => {
    render(<CharacterDetail character={mockCharacter} />);

    expect(screen.getByRole("heading", { name: "Harry Potter" })).toBeInTheDocument();
    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByText("Magical Information")).toBeInTheDocument();
    expect(screen.getByText("Hogwarts")).toBeInTheDocument();
    expect(screen.getByText("Portrayed By")).toBeInTheDocument();

    expect(screen.getByText("human")).toBeInTheDocument();
    expect(screen.getByText("July 31, 1980")).toBeInTheDocument(); // formatted from 31-07-1980
    expect(screen.getByText("half-blood")).toBeInTheDocument();
    expect(screen.getByText("stag")).toBeInTheDocument();
    expect(screen.getByText("Daniel Radcliffe")).toBeInTheDocument();
  });

  it("derives wizard status from gender", () => {
    render(
      <CharacterDetail character={{ id: "1", name: "Harry", wizard: true, gender: "male" }} />
    );
    expect(screen.getByText("Wizard")).toBeInTheDocument();
  });

  it("derives witch status from gender", () => {
    render(
      <CharacterDetail character={{ id: "2", name: "Hermione", wizard: true, gender: "female" }} />
    );
    expect(screen.getByText("Witch")).toBeInTheDocument();
  });

  it("renders Yes/No for Hogwarts status", () => {
    render(<CharacterDetail character={mockCharacter} />);
    expect(screen.getByText("Yes")).toBeInTheDocument(); // hogwartsStudent: true
    expect(screen.getByText("No")).toBeInTheDocument(); // hogwartsStaff: false
  });

  it("falls back to a placeholder for missing fields and 'Non-magical' for non-wizards", () => {
    render(<CharacterDetail character={{ id: "x", name: "Mystery" }} />);

    expect(screen.getByText("Non-magical")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    expect(screen.getAllByText("No").length).toBeGreaterThanOrEqual(2); // student + staff
  });

  it("omits the alternate actors row when there are none", () => {
    render(<CharacterDetail character={mockCharacter} />); // alternate_actors: []
    expect(screen.queryByText("Alternate Actors")).not.toBeInTheDocument();
  });

  it("renders the remaining Basic Information fields", () => {
    render(<CharacterDetail character={mockCharacter} />);
    expect(screen.getByText("male")).toBeInTheDocument(); // gender
    expect(screen.getByText("green")).toBeInTheDocument(); // eye colour
    expect(screen.getByText("black")).toBeInTheDocument(); // hair colour
  });

  it("renders the 'Also known as' aliases", () => {
    render(<CharacterDetail character={mockCharacter} />);
    expect(
      screen.getByText(/Also known as: The Boy Who Lived, The Chosen One/)
    ).toBeInTheDocument();
  });

  it("lists alternate actors when present", () => {
    render(
      <CharacterDetail
        character={{ ...mockCharacter, alternate_actors: ["Toby Papworth", "Kit Connor"] }}
      />
    );
    expect(screen.getByText("Alternate Actors")).toBeInTheDocument();
    expect(screen.getByText("Toby Papworth, Kit Connor")).toBeInTheDocument();
  });

  it("toggles the favorite state from the detail page", async () => {
    useAppStore.setState({ favorites: [] });
    render(<CharacterDetail character={mockCharacter} />);

    const star = screen.getByRole("button", { name: /add harry potter to favorites/i });
    await userEvent.click(star);

    expect(useAppStore.getState().favorites).toContain("1");
    expect(
      screen.getByRole("button", { name: /remove harry potter from favorites/i })
    ).toBeInTheDocument();
  });
});
