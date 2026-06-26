# 📚 Book Explorer

A React + Vite application for searching the Google Books , viewing detailed book information, and managing a personal favorites list.

---

## ✨ Features

- Multi-field search by title, author, and/or genre/keyword
- Dedicated book details route at /book/:id
- Global favorites management with Redux and persisted state
- Semantic HTML and ARIA attributes
- Code-splitting for the details page and memoized cards

---

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone <your-repo-url>
cd book-explorer
npm install
```

### Run locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

---

## Routing

The app uses React Router with these routes:

- / — search page
- /book/:id — details page
- /favorites — favorites page
- * — not found fallback

---

## 🗂️ State Management

Favorites are managed with Redux and stored in a global store.

- Actions, Reducer, Store

---

## ⚡ Performance Notes

- Book details are lazy-loaded with React.lazy + Suspense
- Book cards are memoized with React.memo
- Search results and favorites lists use memoized derived values

---

## 🧪 Testing

Core flows are covered with Vitest and React Testing Library:

- Search form validation and submission
- Favorites interaction on the card

---

## 🛠️ Tech Stack

- React 19
- Vite 8
- React Router 7
- Redux 5
- Bootstrap 5
- Vitest + Testing Library
