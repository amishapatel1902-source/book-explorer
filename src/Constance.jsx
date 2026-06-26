/**
 * Constance.jsx
 * Central constants and Google Books API utilities for Book Explorer.
 */

// ── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
export const PAGE_SIZE = 20;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
// ── Query builder ───────────────────────────────────────────────────────────
export function buildQuery({ title, author, genre }) {
  const parts = [];
  if (title?.trim()) parts.push(`intitle:${title.trim()}`);
  if (author?.trim()) parts.push(`inauthor:${author.trim()}`);
  if (genre?.trim()) parts.push(genre.trim());
  return parts.join('+');
}

// ── Search books ─────────────────────────────────────────────────────────────
export async function searchBooks(fields, startIndex = 0, maxResults = PAGE_SIZE) {
  const q = buildQuery(fields);
  if (!q) throw new Error('Please fill at least one search field.');

  const url = `${API_BASE_URL}?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${maxResults}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

  const data = await res.json();
  return {
    totalItems: data.totalItems ?? 0,
    items: (data.items ?? []).map(normalizeBook),
  };
}

// ── Fetch single book ────────────────────────────────────────────────────────
export async function getBook(id) {
  const res = await fetch(`${API_BASE_URL}/${id}?key=${API_KEY}`);
  if (!res.ok) throw new Error(`Book not found (${res.status})`);
  const data = await res.json();
  return normalizeBook(data);
}

// ── Normalize raw API item → flat shape ──────────────────────────────────────
export function normalizeBook(item) {
  const v = item.volumeInfo ?? {};
  return {
    id: item.id,
    title: v.title ?? 'Unknown Title',
    authors: v.authors ?? [],
    description: v.description ?? '',
    thumbnail:
      v.imageLinks?.thumbnail?.replace('http://', 'https://') ??
      v.imageLinks?.smallThumbnail?.replace('http://', 'https://') ??
      null,
    // thumbnail:
    //   v.imageLinks?.thumbnail?.replace('http://', 'https://')?.replace(/zoom=\d/, 'zoom=3')?.replace('&edge=curl', '') ??
    //   v.imageLinks?.smallThumbnail?.replace('http://', 'https://')?.replace(/zoom=\d/, 'zoom=3')?.replace('&edge=curl', '') ??
    //   null,
    publishedDate: v.publishedDate ?? '',
    pageCount: v.pageCount ?? null,
    categories: v.categories ?? [],
    publisher: v.publisher ?? '',
    language: v.language ?? '',
    previewLink: v.previewLink ?? '',
    infoLink: v.infoLink ?? '',
    averageRating: v.averageRating ?? null,
    ratingsCount: v.ratingsCount ?? null,
  };
}
