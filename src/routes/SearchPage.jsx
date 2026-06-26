import React, { useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from '../components/SearchForm';
import BookCard from '../components/BookCard';
import { searchBooks, PAGE_SIZE } from '../Constance';
import { SEARCH_START, SEARCH_SUCCESS, SEARCH_ERROR, SEARCH_CLEAR } from '../redux/actions';

function SkeletonCard() {
  return (
    <div className="book-card" aria-hidden="true">
      <div className="skeleton" style={{ height: '180px' }} />
      <div className="p-3 d-flex flex-column gap-2">
        <div className="skeleton" style={{ height: '14px', width: '80%' }} />
        <div className="skeleton" style={{ height: '12px', width: '55%' }} />
        <div className="skeleton" style={{ height: '10px', width: '40%' }} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  const dispatch = useDispatch();
  const {
    books = [],
    loading = false,
    error = null,
    totalItems = 0,
    page = 0,
    lastFields = null,
  } = useSelector((state) => state.search ?? {});
  const abortRef = useRef(null);

  const totalPages = Math.ceil(Math.min(totalItems, 200) / PAGE_SIZE);
  const hasSearched = totalItems > 0 || books.length > 0 || (error && !loading);
  const bookList = useMemo(() => books, [books]);

  /* ── Async fetch → Redux ── */
  const search = useCallback(async (fields, pageIndex = 0) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: SEARCH_START, resetBooks: pageIndex === 0 });

    try {
      const result = await searchBooks(fields, pageIndex * PAGE_SIZE, PAGE_SIZE);
      if (!controller.signal.aborted) {
        dispatch({
          type: SEARCH_SUCCESS,
          payload: {
            books: result.items,
            totalItems: result.totalItems,
            page: pageIndex,
            lastFields: fields,
          },
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        dispatch({ type: SEARCH_ERROR, payload: err.message });
      }
    }
  }, [dispatch]);

  const handleSearch = useCallback((fields) => search(fields, 0), [search]);

  const goToPage = useCallback(
    (pageIndex) => { if (lastFields) search(lastFields, pageIndex); },
    [lastFields, search]
  );

  const clearSearch = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    dispatch({ type: SEARCH_CLEAR });
  }, [dispatch]);

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="be-hero" aria-label="Welcome banner">
        <div className="container position-relative">
          <h1 className="mb-3">
            Discover Millions of <span className="gradient-text">Books</span>
          </h1>
          <p className="lead">
            Explore the Google Books library — search by title, author, or genre.
            Save your favorites and build your personal reading list.
          </p>
          <div className="hero-stats" aria-label="Platform stats">
            <div>
              <div className="hero-stat-num">15M+</div>
              <div className="hero-stat-label">Books</div>
            </div>
            <div className="hero-stat-divider" aria-hidden="true" />
            <div>
              <div className="hero-stat-num">Free</div>
              <div className="hero-stat-label">Access</div>
            </div>
            <div className="hero-stat-divider" aria-hidden="true" />
            <div>
              <div className="hero-stat-num">Instant</div>
              <div className="hero-stat-label">Results</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-5">
        <SearchForm
          onSearch={handleSearch}
          loading={loading}
          onClear={clearSearch}
          initialFields={lastFields}
        />

        {/* Error */}
        {error && !loading && (
          <div className="alert text-center py-4" role="alert" style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', color: '#fca5a5', borderRadius: '14px' }}>
            <div style={{ fontSize: '2rem' }}>⚠️</div>
            <h5 className="mt-2">Something went wrong</h5>
            <p className="mb-0" style={{ color: 'var(--be-muted)' }}>{error}</p>
          </div>
        )}

        {/* Skeleton */}
        {loading && books.length === 0 && (
          <div className="row g-3 row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="col"><SkeletonCard /></div>
            ))}
          </div>
        )}

        {/* Results header */}
        {bookList.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0" style={{ fontSize: '.85rem', color: 'var(--be-muted)' }}>
              Showing <strong style={{ color: 'var(--be-text)' }}>{books.length}</strong> of{' '}
              <strong style={{ color: 'var(--be-text)' }}>{totalItems.toLocaleString()}</strong> results
            </p>
            {loading && (
              <svg className="spin-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" aria-label="Loading">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
          </div>
        )}

        {/* Book grid */}
        {bookList.length > 0 && (
          <div className="row g-3 row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {bookList.map((book) => (
              <div key={book.id} className="col">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <nav className="pagination-wrap d-flex justify-content-center mt-4" aria-label="Search results pages">
            <ul className="pagination">
              <li className={`page-item${page === 0 ? ' disabled' : ''}`}>
                <button className="page-link" style={{ background: 'var(--be-surface)', borderColor: 'var(--be-border)', color: 'var(--be-text)' }} onClick={() => goToPage(page - 1)} aria-label="Previous page">‹</button>
              </li>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                return (
                  <li key={p} className={`page-item${page === p ? ' active' : ''}`}>
                    <button
                      className="page-link"
                      style={page === p ? { background: '#8b5cf6', borderColor: '#8b5cf6', color: '#fff' } : { background: 'var(--be-surface)', borderColor: 'var(--be-border)', color: 'var(--be-text)' }}
                      onClick={() => goToPage(p)}
                      aria-label={`Go to page ${p + 1}`}
                      aria-current={page === p ? 'page' : undefined}
                    >
                      {p + 1}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item${page >= totalPages - 1 ? ' disabled' : ''}`}>
                <button className="page-link" style={{ background: 'var(--be-surface)', borderColor: 'var(--be-border)', color: 'var(--be-text)' }} onClick={() => goToPage(page + 1)} aria-label="Next page">›</button>
              </li>
            </ul>
          </nav>
        )}

        {/* Empty state */}
        {!loading && hasSearched && books.length === 0 && !error && (
          <div className="empty-state glass-card mx-auto" style={{ maxWidth: '400px' }}>
            <div className="icon">🔍</div>
            <h5>No books found</h5>
            <p style={{ color: 'var(--be-muted)', fontSize: '.9rem' }}>Try adjusting your search terms.</p>
          </div>
        )}

        {/* Initial prompt */}
        {!hasSearched && !loading && (
          <div className="text-center">
            <span className='text-secondary'>Use the search form above to explore books.</span>
          </div>
        )}
      </div>
    </main>
  );
}
