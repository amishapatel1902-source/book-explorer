import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/actions';

function Stars({ rating, count }) {
  if (!rating) return null;
  const filled = Math.round(rating);
  return (
    <span className="stars" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`star${i < filled ? ' filled' : ''}`}>★</span>
      ))}
      {count != null && <span className="rating-count ms-1">({count})</span>}
    </span>
  );
}

const BookCard = memo(function BookCard({ book }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const favorited = favorites.some((item) => item.id === book.id);

  const toggleFav = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      favorited ? dispatch(removeFavorite(book.id)) : dispatch(addFavorite(book));
    },
    [favorited, book, addFavorite, removeFavorite]
  );

  const shortDesc = book.description
    ? book.description.replace(/<[^>]+>/g, '').slice(0, 110) + (book.description.length > 110 ? '…' : '')
    : null;

  return (
    <article className={`book-card fade-in-up${favorited ? ' is-favorite' : ''}`}>
      {/* Cover */}
      <Link to={`/book/${book.id}`} aria-label={`View details for ${book.title}`} className="text-decoration-none">
        <div className="book-card__cover">
          {book.thumbnail ? (
            <img
              // src={book.thumbnail.replace('zoom=1', 'zoom=2')} 
              src={book.thumbnail}
              alt={`Cover of ${book.title}`} loading="lazy" />
          ) : (
            <div className="book-card__no-cover">
              📚<span>No cover</span>
            </div>
          )}
          <div className="book-card__cover-overlay" aria-hidden="true">View Details</div>
        </div>
      </Link>

      {/* Body */}
      <div className="book-card__body">
        {/* Title row */}
        <div className="d-flex align-items-start gap-1">
          <Link to={`/book/${book.id}`} className="text-decoration-none flex-grow-1">
            <p className="book-card__title mb-0">{book.title}</p>
          </Link>
          <button
            className={`fav-btn${favorited ? ' active' : ''}`}
            onClick={toggleFav}
            aria-label={favorited ? `Remove ${book.title} from favorites` : `Add ${book.title} to favorites`}
            aria-pressed={favorited}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {book.authors.length > 0 && (
          <p className="book-card__author mb-0">by {book.authors.join(', ')}</p>
        )}

        <Stars rating={book.averageRating} count={book.ratingsCount} />

        {/* Badges */}
        <div className="d-flex flex-wrap gap-1">
          {book.publishedDate && (
            <span className="badge-year badge px-2">{book.publishedDate.slice(0, 4)}</span>
          )}
          {book.categories.slice(0, 1).map((c) => (
            <span key={c} className="badge-cat badge px-2">{c}</span>
          ))}
        </div>

        {shortDesc && <p className="book-card__desc mb-0">{shortDesc}</p>}
      </div>
    </article>
  );
});

export default BookCard;
