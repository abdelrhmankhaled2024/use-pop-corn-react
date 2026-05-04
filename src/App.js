import { useEffect, useState } from "react";
import Main from "./components/Main";
import { Navbar, NumResults } from "./components/Navbar";
import { ListBox, MovieItem } from "./components/ListBox";
import { WatchedBox } from "./components/WatchedBox";
import Loader from "./components/Loader";
import MovieDetails from "./components/MovieDetails";

const apiKey = "c0ecb462";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      async function fetchMovies() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal: controller.signal },
          );

          const data = await res.json();
          setMovies(data?.Search || []);
        } catch (err) {
          if (err.name === "AbortError") return;
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

  function handleAddToWatched(movie) {
    setWatched((prev) => {
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      return [...prev, movie];
    });
    setSelectedId(null);
  }

  function handleRateMovie(imdbID, rating) {
    setWatched((prev) =>
      prev.map((movie) =>
        movie.imdbID === imdbID ? { ...movie, userRating: rating } : movie,
      ),
    );
  }

  function handleRemoveWatched(imdbID) {
    setWatched((prev) => prev.filter((movie) => movie.imdbID !== imdbID));
  }

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
          ) : movies.length === 0 && query === "" ? (
            <></>
          ) : (
            <p className="error">🎬 No movies found.</p>
          )}
        </ListBox>
        <WatchedBox watched={watched} onRemoveWatched={handleRemoveWatched} />
      </Main>
    </>
  );
}
