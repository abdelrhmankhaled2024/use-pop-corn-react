import { useState } from "react";
import { average } from "../utils";
import StarRating from "./StarRating";

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onRateMovie, onRemoveWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📆</span>
          <span>{movie.Year}</span>
        </p>
      </div>
      <StarRating
        maxRating={10}
        initialRating={movie.userRating}
        onRate={(rating) => onRateMovie(movie.imdbID, rating)}
      />
      <button
        className="btn-delete"
        onClick={() => onRemoveWatched(movie.imdbID)}
      >
        ✕
      </button>
    </li>
  );
}

function WatchedMovieList({ watched, onRateMovie, onRemoveWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onRateMovie={onRateMovie}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  );
}

export function WatchedBox({ watched, onRateMovie, onRemoveWatched }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMovieList
            watched={watched}
            onRateMovie={onRateMovie}
            onRemoveWatched={onRemoveWatched}
          />
        </>
      )}
    </div>
  );
}
