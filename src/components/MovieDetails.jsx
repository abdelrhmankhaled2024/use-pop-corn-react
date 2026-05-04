import { useEffect, useState } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
import { OMDB_API_KEY, OMDB_BASE_URL } from "../config";

const SOURCE_ICON = {
  "Internet Movie Database": "⭐️",
  "Rotten Tomatoes": "🍅",
  Metacritic: "🎯",
};

const SOURCE_LABEL = {
  "Internet Movie Database": "IMDb",
  "Rotten Tomatoes": "Rotten Tomatoes",
  Metacritic: "Metacritic",
};

export default function MovieDetails({
  selectedId,
  onClose,
  onAddToWatched,
  onRateMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const watchedMovie = watched.find((m) => m.imdbID === selectedId);
  const isWatched = Boolean(watchedMovie);
  const [userRating, setUserRating] = useState(watchedMovie?.userRating ?? 0);

  const {
    Title, Year, Poster, Runtime, imdbRating, imdbVotes,
    Plot, Released, Actors, Director, Writer,
    Genre, Rated, Awards, BoxOffice, Language, Country,
    Ratings = [],
  } = movie;

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!Title) return;
    document.title = `Movie | ${Title}`;
    return () => { document.title = "usePopcorn"; };
  }, [Title]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${selectedId}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        if (err.name === "AbortError") return;
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
    return () => controller.abort();
  }, [selectedId]);

  const handleRate = (rating) => {
    setUserRating(rating);
    if (isWatched) onRateMovie(selectedId, rating);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="details">
      <button className="btn-back" onClick={onClose}>
        <span>←</span>
      </button>

      <header>
        <img src={Poster} alt={`${Title} poster`} />
        <div className="details-overview">
          <h2>
            {Title}{" "}
            <span style={{ fontWeight: 400, fontSize: "1.6rem", color: "#adb5bd" }}>
              ({Year})
            </span>
          </h2>
          <p><span>📆</span><span>{Released}</span></p>
          <p>
            <span>⏱</span>
            <span>{Runtime}{Rated && Rated !== "N/A" ? ` · ${Rated}` : ""}</span>
          </p>
          {Language && Language !== "N/A" && <p><span>🌐</span><span>{Language}</span></p>}
          {Awards && Awards !== "N/A" && <p><span>🏆</span><span>{Awards}</span></p>}
          <p><em>{Genre}</em></p>
        </div>
      </header>

      <section>
        <div className="rating">
          <StarRating maxRating={10} initialRating={userRating} onRate={handleRate} />
          {isWatched ? (
            <p style={{ color: "#adb5bd", fontStyle: "italic", fontSize: "1.4rem", fontWeight: 400 }}>
              ✓ In your watched list
            </p>
          ) : (
            <button className="btn-add" onClick={() => onAddToWatched({ ...movie, userRating })}>
              + Add to Watched
            </button>
          )}
        </div>

        {Ratings.length > 0 && (
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {Ratings.map((r) => (
              <p key={r.Source}>
                <span>{SOURCE_ICON[r.Source] ?? "🎬"}</span>
                <span>{SOURCE_LABEL[r.Source] ?? r.Source}: <strong>{r.Value}</strong></span>
              </p>
            ))}
          </div>
        )}

        {imdbVotes && (
          <p style={{ color: "#adb5bd", fontSize: "1.3rem" }}>{imdbVotes} IMDb votes</p>
        )}

        {BoxOffice && BoxOffice !== "N/A" && (
          <p><span>💰</span><span>Box Office: <strong>{BoxOffice}</strong></span></p>
        )}

        <p style={{ lineHeight: "1.6" }}>{Plot}</p>
        <p><span>🎬</span><span>Director: {Director}</span></p>
        {Writer && Writer !== "N/A" && <p><span>✍️</span><span>Writer: {Writer}</span></p>}
        <p><span>🎭</span><span>Starring: {Actors}</span></p>
        {Country && Country !== "N/A" && <p><span>🌍</span><span>{Country}</span></p>}
      </section>
    </div>
  );
}
