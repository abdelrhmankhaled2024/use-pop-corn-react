import { useEffect, useState } from "react";
import Main from "./components/Main";
import { Navbar, NumResults } from "./components/Navbar";
import { ListBox, MovieItem } from "./components/ListBox";
import { WatchedBox } from "./components/WatchedBox";
import Loader from "./components/Loader";

const apiKey = "c0ecb462";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("avengers");
  const [isLoading, setIsLoading] = useState(false);

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

  function handleSelectMovie(newMovie) {
    setWatched((prev) => {
      if (prev.some((m) => m.imdbID === newMovie.imdbID)) return prev;
      return [...prev, { ...newMovie, userRating: 0 }];
    });
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
          {isLoading ? (
            <Loader />
          ) : movies.length > 0 ? (
            <ul className="list">
              {movies.map((movie) => (
                <MovieItem
                  key={movie.imdbID}
                  movie={movie}
                  onSelectMovie={handleSelectMovie}
                />
              ))}
            </ul>
          ) : (
            <p className="error">🎬 No movies found</p>
          )}
        </ListBox>
        <WatchedBox watched={watched} onRateMovie={handleRateMovie} onRemoveWatched={handleRemoveWatched} />
      </Main>
    </>
  );
}
