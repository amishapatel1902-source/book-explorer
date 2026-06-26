import React, { useState, useCallback } from 'react';

const EMPTY = { title: '', author: '', genre: '' };

export default function SearchForm({ onSearch, loading, onClear, initialFields }) {
  const [fields, setFields] = useState(() => initialFields ?? EMPTY);
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const anyFilled = Object.values(fields).some((v) => v.trim());
    if (!anyFilled) {
      setError('Please fill in at least one field to search.');
      return;
    }
    onSearch(fields);
  };

  const handleClear = () => {
    setFields(EMPTY);
    setError('');
    onClear?.();   // also clear Redux search results
  };

  const hasContent = Object.values(fields).some((v) => v.trim());

  return (
    <div className="be-search-card mb-5" role="search" aria-label="Search for books">
      <h2 className="text-center fw-bold mb-1 gradient-text fs-4">Find Your Next Book</h2>
      <p className="text-center mb-4" style={{ color: 'var(--be-muted)', fontSize: '.9rem' }}>
        Search by title, author, or genre — fill in any combination.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3 mb-3">
          {/* Title */}
          <div className="col-md-4">
            <label htmlFor="search-title" className="form-label">📖 Book Title</label>
            <input
              id="search-title"
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. The Great Gatsby"
              value={fields.title}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              aria-describedby={error ? 'sf-error' : undefined}
            />
          </div>

          {/* Author */}
          <div className="col-md-4">
            <label htmlFor="search-author" className="form-label">👤 Author</label>
            <input
              id="search-author"
              type="text"
              name="author"
              className="form-control"
              placeholder="e.g. F. Scott Fitzgerald"
              value={fields.author}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              aria-describedby={error ? 'sf-error' : undefined}
            />
          </div>

          {/* Genre */}
          <div className="col-md-4">
            <label htmlFor="search-genre" className="form-label">🏷️ Genre / Keyword</label>
            <input
              id="search-genre"
              type="text"
              name="genre"
              className="form-control"
              placeholder="e.g. science fiction"
              value={fields.genre}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              aria-describedby={error ? 'sf-error' : undefined}
            />
          </div>
        </div>

        {/* Validation error */}
        {error && (
          <div id="sf-error" className="alert alert-danger py-2 px-3 mb-3" role="alert" aria-live="polite" style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.3)', color: '#fca5a5', borderRadius: '10px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
          <button
            type="submit"
            className="btn btn-accent px-4 py-2"
            disabled={loading}
            aria-label="Search for books"
          >
            {loading ? (
              <><svg className="spin-icon me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Searching…</>
            ) : (
              <>🔍 Search Books</>
            )}
          </button>
          {hasContent && !loading && (
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              onClick={handleClear}
              style={{ borderColor: 'var(--be-border)', color: 'var(--be-muted)', borderRadius: '10px' }}
              aria-label="Clear search fields"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
