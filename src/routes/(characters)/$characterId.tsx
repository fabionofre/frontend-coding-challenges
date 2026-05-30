import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CharacterDetail } from "./-components/CharacterDetail";
import { characterQueryOptions, useCharacter } from "./-hooks/useCharacter";

export const Route = createFileRoute("/(characters)/$characterId")({
  // Pre-fetch via the route loader. ensureQueryData populates the React Query cache
  // (or reuses it) so the component renders instantly without its own request.
  loader: async ({ context: { queryClient }, params: { characterId } }) => {
    const character = await queryClient.ensureQueryData(characterQueryOptions(characterId));
    if (!character) throw notFound();
  },
  component: CharacterDetailView,
  notFoundComponent: CharacterNotFound,
});

function CharacterDetailView() {
  const { characterId } = Route.useParams();
  const { data: character } = useCharacter(characterId);

  // The loader guarantees a non-null character before this renders; the guard is a
  // type-narrowing safety net.
  if (!character) return null;

  return <CharacterDetail character={character} />;
}

function CharacterNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-lg text-amber-200/60">Character not found.</p>
      <Link to="/" className="text-sm text-amber-200/40 hover:text-amber-100">
        Back to all characters
      </Link>
    </div>
  );
}
