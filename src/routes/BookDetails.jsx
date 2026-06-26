import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/actions';
import { getBook } from '../Constance';

/* ── Star Rating ── */
function Stars({ rating, count }) {
  if (!rating) return null;
  const filled = Math.round(rating);
  return (
    <div className="bd-stars-row">
      <span className="bd-stars" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`star${i < filled ? ' filled' : ''}`}>★</span>
        ))}
      </span>
      <span className="bd-rating-num">{rating.toFixed(1)}</span>
      {count > 0 && <span className="bd-rating-count">({count.toLocaleString()} ratings)</span>}
    </div>
  );
}

/* ── Info Row ── */
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="bd-info-row">
      <span className="bd-info-row__icon">{icon}</span>
      <span className="bd-info-row__label">{label}</span>
      <span className="bd-info-row__value">{value}</span>
    </div>
  );
}

/* ── Main Component ── */
export default function BookDetails() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const favorites   = useSelector((state) => state.favorites);

  const [book, setBook]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(false);

  const favorited = book ? favorites.some((f) => f.id === book.id) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true); setError(null); setExpanded(false);
    getBook(id)
      .then(setBook)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFav = useCallback(() => {
    if (!book) return;
    favorited ? dispatch(removeFavorite(book.id)) : dispatch(addFavorite(book));
  }, [book, favorited, dispatch]);

  const BackBtn = () => (
    <button className="bd-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      Back
    </button>
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="bd-page">
        <div className="bd-full-screen">
          <div className="bd-hero__overlay" />
          <div className="container bd-layout">
            <div className="skeleton" style={{ height: 36, width: 80, borderRadius: 99, marginBottom: '1.25rem' }} />
            <div className="bd-card">
              <div className="bd-cover-col">
                <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 18 }} />
                <div className="skeleton" style={{ height: 40, borderRadius: 10, marginTop: 12 }} />
              </div>
              <div className="bd-info-col" style={{ gap: '.85rem' }}>
                <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 99 }} />
                <div className="skeleton" style={{ height: 42, width: '88%', borderRadius: 8 }} />
                <div className="skeleton" style={{ height: 18, width: '55%', borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 18, width: '35%', borderRadius: 6 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  {[70, 90, 60].map((w, i) => <div key={i} className="skeleton" style={{ height: 28, width: w, borderRadius: 99 }} />)}
                </div>
                <div className="skeleton" style={{ height: 1, marginTop: 4 }} />
                <div className="skeleton" style={{ height: 14, width: '30%', borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 100, borderRadius: 8 }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <main className="bd-page" role="alert">
        <div className="container py-5 text-center">
          <div className="empty-state glass-card mx-auto" style={{ maxWidth: 420 }}>
            <div className="icon">⚠️</div>
            <h5>Book not found</h5>
            <p style={{ color: 'var(--be-muted)' }}>{error}</p>
            <Link to="/" className="btn btn-accent mt-2">← Back to Search</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!book) return null;

  const categories = Array.isArray(book.categories) ? book.categories : [];
  const authors    = Array.isArray(book.authors)    ? book.authors    : [];
  const cleanDesc  = book.description?.replace(/<[^>]+>/g, '') || null;
  const DESC_LIMIT = 380;
  const descShort  = cleanDesc && cleanDesc.length > DESC_LIMIT && !expanded
    ? cleanDesc.slice(0, DESC_LIMIT) + '…'
    : cleanDesc;

  return (
    <main className="bd-page fade-in-up" aria-label={`Details for ${book.title}`}>
      <div className="bd-full-screen">

        {/* Blurred backdrop */}
        {book.thumbnail && (
          <div className="bd-hero__bg" style={{ backgroundImage: `url(${book.thumbnail})` }} aria-hidden="true" />
        )}
        <div className="bd-hero__overlay" aria-hidden="true" />

        <div className="container bd-layout">
          <BackBtn />

          {/* ── Single unified card ── */}
          <div className="bd-card">

            {/* Left: Cover + fav */}
            <div className="bd-cover-col">
              <div className="bd-hero-card__cover">
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail}
                    alt={`Cover of ${book.title}`}
                    className="bd-cover-img"
                    onError={(e) => {
                      if (book.thumbnailFallback && e.target.src !== book.thumbnailFallback)
                        e.target.src = book.thumbnailFallback;
                    }}
                  />
                ) : (
                  <div className="bd-cover-placeholder">📚</div>
                )}
              </div>

              <button
                className={`bd-fav-btn${favorited ? ' active' : ''}`}
                onClick={toggleFav}
                aria-pressed={favorited}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favorited ? 'Saved ✓' : 'Save to Favorites'}
              </button>

              {book.previewLink && (
                <a href={book.previewLink} target="_blank" rel="noopener noreferrer" className="bd-preview-btn">
                  🔍 Preview
                </a>
              )}
            </div>

            {/* Right: All info */}
            <div className="bd-info-col">

              {/* Category + kicker */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="bd-card-kicker">📚 Book</span>
                {categories.slice(0, 2).map((c) => (
                  <span key={c} className="badge-cat badge px-2 py-1">{c}</span>
                ))}
              </div>

              {/* Title */}
              <h1 className="bd-title">{book.title}</h1>

              {/* Authors */}
              {authors.length > 0 && (
                <p className="bd-authors">by <strong>{authors.join(', ')}</strong></p>
              )}

              {/* Stars */}
              <Stars rating={book.averageRating} count={book.ratingsCount} />

              {/* Meta pills */}
              <div className="bd-meta-pills">
                {book.publishedDate && <span className="bd-pill">📅 {book.publishedDate.slice(0, 4)}</span>}
                {book.pageCount     && <span className="bd-pill">📄 {book.pageCount} pages</span>}
                {book.language      && <span className="bd-pill">🌐 {book.language.toUpperCase()}</span>}
              </div>

              {/* Publisher + Published — fills empty space between pills and overview */}
              {(book.publisher || book.publishedDate) && (
                <div className="bd-info-rows bd-info-rows--compact">
                  <InfoRow icon="🏢" label="Publisher" value={book.publisher} />
                  <InfoRow icon="📅" label="Published" value={book.publishedDate?.slice(0, 4)} />
                </div>
              )}

              {/* Divider */}
              <div className="bd-divider" />

              {/* Overview */}
              {cleanDesc ? (
                <div className="bd-overview">
                  <div className="bd-section-kicker mb-2">Overview</div>
                  <p className="bd-desc">{descShort}</p>
                  {cleanDesc.length > DESC_LIMIT && (
                    <button className="bd-expand-btn" onClick={() => setExpanded((p) => !p)} aria-expanded={expanded}>
                      {expanded ? 'Show less ▲' : 'Read more ▼'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="bd-desc" style={{ opacity: .5 }}>No description available.</p>
              )}



            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
