import { useEffect, useState } from "react";
import Main from "./components/Main";
import { Navbar, NumResults } from "./components/Navbar";
import { ListBox, MovieItem } from "./components/ListBox";
import { WatchedBox } from "./components/WatchedBox";
import Loader from "./components/Loader";
import MovieDetails from "./components/MovieDetails";
import { OMDB_API_KEY, OMDB_BASE_URL } from "./config";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }

    setIsLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      async function fetchMovies() {
        try {
          const res = await fetch(
            `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${query}`,
            { signal: controller.signal },
          );
          const data = await res.json();
          setMovies(data?.Search ?? []);
        } catch (err) {
          if (err.name !== "AbortError") setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovies();
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const handleAddToWatched = (movie) => {
    setWatched((prev) =>
      prev.some((m) => m.imdbID === movie.imdbID) ? prev : [...prev, movie],
    );
    setSelectedId(null);
  };

  const handleRateMovie = (imdbID, rating) =>
    setWatched((prev) =>
      prev.map((m) => (m.imdbID === imdbID ? { ...m, userRating: rating } : m)),
    );

  const handleRemoveWatched = (imdbID) =>
    setWatched((prev) => prev.filter((m) => m.imdbID !== imdbID));

  return (
    <>
      <Navbar query={query} setQuery={setQuery}>
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <ListBox>
          {selectedId ? (
            <MovieDetails
              key={selectedId}
              selectedId={selectedId}
              watched={watched}
              onClose={() => setSelectedId(null)}
              onAddToWatched={handleAddToWatched}
              onRateMovie={handleRateMovie}
            />
          ) : isLoading ? (
            <Loader />
          ) : movies.length > 0 ? (
            <ul className="list">
              {movies.map((movie) => (
                <MovieItem
                  key={movie.imdbID}
                  movie={movie}
                  onSelectMovie={(m) => setSelectedId(m.imdbID)}
                />
              ))}
            </ul>
          ) : query ? (
            <p className="error">🎬 No movies found.</p>
          ) : null}
        </ListBox>
        <WatchedBox
          watched={watched}
          onRemoveWatched={handleRemoveWatched}
          onSelectMovie={setSelectedId}
        />
      </Main>
    </>
  );
}
