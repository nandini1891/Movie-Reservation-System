# CinéVault — Admin Dashboard (Frontend)

React + Tailwind implementation of the **Admin** side of the movie reservation
system: Overview stats, Films, Theaters, and Showtimes management, plus the
Sign In / Create Account modal. Built to match the supplied CinéVault theme
(dark background, gold accent, serif "CinéVault" wordmark).

This is a **frontend-only** deliverable. It currently runs against realistic
**in-memory mock data** (see "Switching to the real backend" below) so it's
fully clickable today, and swaps to real HTTP calls with a one-line change.

---

## 1. Opening this in VS Code

1. Unzip the project and open the folder in VS Code:
   ```bash
   code cinevault-admin
   ```
2. Open a terminal inside VS Code (`` Ctrl+` `` / `` Cmd+` ``) and install
   dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and adjust if needed:
   ```bash
   cp .env.example .env
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Vite will print a local URL (typically `http://localhost:5173`). Open it
   in your browser.

Other commands:
```bash
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

### Signing in during development
Click **Sign In** in the top right. The modal has two demo accounts you can
click to autofill:
- **Member** — alex.rivera@example.com
- **Admin** — morgan.adeyemi@example.com (use this one to see `/admin`)

No password is required in this mock build — see the note in `src/api/auth.js`.

---

## 2. Folder & file structure

```
cinevault-admin/
├── .env.example              # documents required env vars
├── index.html                # Vite HTML entry (loads Google Fonts)
├── package.json
├── postcss.config.js
├── tailwind.config.js        # CinéVault color tokens (ink/gold/ivory) + fonts
├── vite.config.js
└── src/
    ├── main.jsx               # ReactDOM root, wraps App in Router + AuthProvider
    ├── App.jsx                # Routes: "/", "/my-bookings", "/admin"
    ├── styles/
    │   └── index.css          # Tailwind layers + reusable classes (.card, .btn-primary, .label, .tab…)
    │
    ├── api/                   # <-- BACKEND INTEGRATION LIVES HERE
    │   ├── client.js          # Axios instance: base URL + auth token header
    │   ├── auth.js            # login / register / logout / getStoredSession
    │   ├── movies.js          # CRUD for films
    │   ├── theaters.js        # CRUD for theaters
    │   ├── showtimes.js       # CRUD for showtimes + seat map fetch
    │   ├── bookings.js        # list bookings (for Overview tab)
    │   └── mockData.js        # in-memory mock dataset (dev-only)
    │
    ├── context/
    │   └── AuthContext.jsx    # current user, role, sign-in modal state
    │
    ├── components/
    │   ├── Navbar.jsx
    │   ├── AuthModal.jsx      # Sign In / Create Account dialog
    │   ├── OverviewTab.jsx    # "All Bookings" table
    │   ├── common/
    │   │   ├── Modal.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── StatCard.jsx
    │   ├── movies/
    │   │   ├── MoviesTab.jsx
    │   │   └── MovieFormModal.jsx
    │   ├── theaters/
    │   │   ├── TheatersTab.jsx
    │   │   └── TheaterFormModal.jsx
    │   └── showtimes/
    │       ├── ShowtimesTab.jsx
    │       ├── ShowtimeFormModal.jsx
    │       └── SeatMapModal.jsx   # read-only seat grid (available/reserved/blocked)
    │
    └── pages/
        ├── AdminDashboard.jsx     # the main screen from the screenshots
        ├── FilmsPage.jsx          # placeholder public browse page
        └── MyBookingsPage.jsx     # placeholder member bookings page
```

`FilmsPage` and `MyBookingsPage` are intentionally minimal stubs — only the
**Admin** experience was in scope for this build, but they're there so the
nav bar and routing don't dead-end while the member-facing screens are built
separately.

---

## 3. Switching to the real backend

Everything a backend developer needs to know is written directly above each
function in `src/api/*.js` as a "BACKEND CONTRACT" comment, listing the exact
method, path, request body, and response shape expected, e.g.:

```js
// GET    /movies           -> Movie[]
// POST   /movies           { title, genre, durationMinutes, rating, description, posterUrl } -> Movie
// PUT    /movies/:id        (same body, partial ok)                                          -> Movie
// DELETE /movies/:id        -> 204
```

To connect the real API:

1. In `.env`, set:
   ```
   VITE_API_BASE_URL=https://your-api-host/api
   VITE_USE_MOCKS=false
   ```
2. That's it for most cases — every function in `src/api/*.js` already has a
   real `axios` call written and ready; it's just skipped while
   `VITE_USE_MOCKS` is true. No component code needs to change.
3. Auth: `src/api/client.js` attaches `Authorization: Bearer <token>` from
   `localStorage` to every request automatically. If the backend uses
   cookies/sessions instead, remove the interceptor in that one file and set
   `withCredentials: true` on the Axios instance.
4. Login currently only sends `{ email }` — add a `password` field to
   `AuthModal.jsx` and pass it through `api/auth.js` once the backend
   requires one.

### Data shapes expected from the backend

```ts
Movie     = { id, title, genre, durationMinutes, rating, description, posterUrl }
Theater   = { id, name, rows, seatsPerRow, description }
Showtime  = { id, movieId, theaterId, startTime /* ISO */, price, capacity, bookedSeats: string[] }
Booking   = { id, movieTitle, theaterName, showtime /* ISO */, seats: string[],
              totalCost, status: "confirmed" | "cancelled", userName, userEmail, createdAt }
User      = { id, name, email, role: "member" | "admin" }
```

### Concurrency note
The seat grid in the Admin build (`SeatMapModal.jsx`) is **read-only** — it
just visualizes booked vs. available seats per showtime for admins. The
actual hold/confirm booking flow with locking to prevent double-booking
belongs on the member-facing booking screen (out of scope here), and should
hit something like `POST /showtimes/:id/hold` then `POST /bookings`.

---

## 4. Theme reference

Defined in `tailwind.config.js` and used via Tailwind utility classes:

| Token         | Hex       | Usage                         |
|---------------|-----------|--------------------------------|
| `ink-950`     | `#0a0a0c` | Page background                |
| `ink-900`     | `#101012` | Card / panel background        |
| `ink-800`     | `#18181b` | Inputs, hover surfaces         |
| `ink-700`     | `#232327` | Borders / dividers             |
| `gold-500`    | `#e2a53c` | Primary accent, buttons, links |
| `ivory`       | `#f5f1e8` | Headline text                  |
| `muted`       | `#8b8b94` | Secondary / label text         |

Fonts: **Playfair Display** (headlines, brand wordmark) + **Inter** (body/UI),
loaded via Google Fonts in `index.html`.
