import { useState } from "react";
import { average } from "../utils";

function formatRuntime(mins) {
  if (!mins) return "0 min";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function WatchedSummary({ watched }) {
  const avgUserRating = average(watched.map((m) => m.userRating));
  const totalRuntime = watched.reduce((acc, m) => acc + (parseInt(m.Runtime) || 0), 0);

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p><span>#️⃣</span><span>{watched.length} movies</span></p>
        <p><span>⏱</span><span>{formatRuntime(totalRuntime)}</span></p>
        <p>
          <span>⭐</span>
          <span>{avgUserRating > 0 ? `${avgUserRating.toFixed(1)}/10` : "—"}</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onRemoveWatched, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} style={{ cursor: "pointer" }}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p><span>📆</span><span>{movie.Year}</span></p>
        <p>
          <span>⭐</span>
          <span>{movie.userRating > 0 ? `${movie.userRating}/10` : "—"}</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={(e) => { e.stopPropagation(); onRemoveWatched(movie.imdbID); }}
      >
        ✕
      </button>
    </li>
  );
}

export function WatchedBox({ watched, onRemoveWatched, onSelectMovie }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((o) => !o)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        <>
          <WatchedSummary watched={watched} />
          <ul className="list">
            {watched.map((movie) => (
              <WatchedMovie
                key={movie.imdbID}
                movie={movie}
                onRemoveWatched={onRemoveWatched}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
