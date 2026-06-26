import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite } from '../redux/actions';
import BookCard from '../components/BookCard';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="be-hero" aria-label="Favorites header">
        <div className="container position-relative">
          <div style={{ fontSize: '3.2rem', marginBottom: '.5rem', filter: 'drop-shadow(0 0 16px rgba(248,113,113,.5))' }} aria-hidden="true">❤️</div>
          <h1 className="mb-2">Your <span className="gradient-text">Favorites</span></h1>
          <p className="lead" style={{ marginBottom: 0 }}>
            {favorites.length === 0
              ? 'Start adding books you love to build your reading list.'
              : `${favorites.length} book${favorites.length !== 1 ? 's' : ''} saved to your collection`}
          </p>
        </div>
      </section>

      <div className="container pb-5">
        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="empty-state glass-card mx-auto fade-in-up" style={{ maxWidth: 400 }} role="status">
            <div className="icon">📚</div>
            <h5>No favorites yet</h5>
            <p style={{ color: 'var(--be-muted)', fontSize: '.9rem' }}>
              Search for books and click the ❤️ icon to save them here.
            </p>
            <Link to="/" className="btn btn-accent mt-2">🔍 Browse Books</Link>
          </div>
        ) : (
          <>
            {/* Favorites Grid */}
            <div className="row g-3 row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
              {favorites.map((fav) => (
                <div key={fav.id} className="col">
                  <div className="d-flex flex-column gap-2 h-100">
                    <BookCard book={fav} />

                    {/* Remove button */}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm w-100"
                      style={{ borderRadius: 8, fontSize: '.8rem', minHeight: 36 }}
                      onClick={() => dispatch(removeFavorite(fav.id))}
                      aria-label={`Remove ${fav.title} from favorites`}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
