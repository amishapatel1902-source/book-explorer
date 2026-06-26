import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './routes/SearchPage';
import FavoritesPage from './routes/FavoritesPage';

const BookDetails = lazy(() => import('./routes/BookDetails'));

function PageLoader() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5" role="status" aria-label="Loading page">
      <svg className="spin-icon mb-2" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <p style={{ color: 'var(--be-muted)', fontSize: '.85rem' }}>Loading…</p>
    </div>
  );
}

function NotFound() {
  return (
    <main className="container py-5" aria-label="Page not found">
      <div className="empty-state glass-card mx-auto" style={{ maxWidth: 380 }}>
        <div className="icon">📭</div>
        <h4>Page not found</h4>
        <p style={{ color: 'var(--be-muted)' }}>The page you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-accent mt-2">Go to Search</a>
      </div>
    </main>
  );
}

function AppInner() {
  return (
    <>
      <a href="#main-content" className="visually-hidden-focusable position-absolute">
        Skip to main content
      </a>

      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <footer className="be-footer" role="contentinfo">
        Book Explorer — Powered by{' '}
        <a href="https://developers.google.com/books" target="_blank" rel="noopener noreferrer">
          Google Books API
        </a>
      </footer>

    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
