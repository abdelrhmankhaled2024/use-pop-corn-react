import { useState } from "react";
import { average } from "../utils";
import MovieRatingPanel from "./MovieRatingPanel";

function WatchedSummary({ watched }) {
  const avgUserRating = average(watched.map((movie) => movie.userRating));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        {watched.length > 0 && (
          <p>
            <span>⭐</span>
            <span>{avgUserRating > 0 ? `avg ${avgUserRating.toFixed(1)}/10` : "unrated"}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onRemoveWatched, onSelectForRating }) {
  return (
    <li onClick={() => onSelectForRating(movie.imdbID)} style={{ cursor: "pointer" }}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📆</span>
          <span>{movie.Year}</span>
        </p>
        <p>
          <span>⭐</span>
          <span>{movie.userRating > 0 ? `${movie.userRating}/10` : "Rate..."}</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveWatched(movie.imdbID);
        }}
      >
        ✕
      </button>
    </li>
  );
}

function WatchedMovieList({ watched, onRemoveWatched, onSelectForRating }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onRemoveWatched={onRemoveWatched}
          onSelectForRating={onSelectForRating}
        />
      ))}
    </ul>
  );
}

export function WatchedBox({
  watched,
  ratingMovie,
  onRateMovie,
  onCloseRating,
  onRemoveWatched,
  onSelectForRating,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        <>
          {ratingMovie ? (
            <MovieRatingPanel
              movie={ratingMovie}
              onRate={onRateMovie}
              onClose={onCloseRating}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemoveWatched={onRemoveWatched}
                onSelectForRating={onSelectForRating}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
