import StarRating from "./StarRating";

export default function MovieRatingPanel({ movie, onRate, onClose }) {
  return (
    <div className="details">
      <button className="btn-back" onClick={onClose}>
        &larr;
      </button>
      <header>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <div className="details-overview">
          <h2>{movie.Title}</h2>
          <p>
            <span>📆</span>
            <span>{movie.Year}</span>
          </p>
          {movie.userRating > 0 && (
            <p>
              <span>⭐</span>
              <span>Your rating: {movie.userRating}/10</span>
            </p>
          )}
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating
            maxRating={10}
            initialRating={movie.userRating}
            onRate={(rating) => onRate(movie.imdbID, rating)}
          />
        </div>
      </section>
    </div>
  );
}
