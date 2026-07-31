import { client } from "./client.js";
import { mockMovies, mockShowtimes, nextId } from "./mockData.js";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

/**
 * BACKEND CONTRACT
 * -----------------
 * GET    /movies           -> Movie[]
 * POST   /movies           { title, genre, durationMinutes, rating, description, posterUrl } -> Movie
 * PUT    /movies/:id        (same body, partial ok)                                          -> Movie
 * DELETE /movies/:id        -> 204
 *
 * Movie = { id, title, genre, durationMinutes, rating, description, posterUrl }
 */

export async function listMovies() {
  if (USE_MOCKS) return [...mockMovies];
  const { data } = await client.get("/movies");
  return data;
}

export async function createMovie(payload) {
  if (USE_MOCKS) {
    const movie = { id: nextId(), ...payload };
    mockMovies.push(movie);
    return movie;
  }
  const { data } = await client.post("/movies", payload);
  return data;
}

export async function updateMovie(id, payload) {
  if (USE_MOCKS) {
    const idx = mockMovies.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Movie not found");
    mockMovies[idx] = { ...mockMovies[idx], ...payload };
    return mockMovies[idx];
  }
  const { data } = await client.put(`/movies/${id}`, payload);
  return data;
}

export async function deleteMovie(id) {
  if (USE_MOCKS) {
    const idx = mockMovies.findIndex((m) => m.id === id);
    if (idx !== -1) mockMovies.splice(idx, 1);
    // Keep mock showtimes consistent with the movie list.
    for (let i = mockShowtimes.length - 1; i >= 0; i -= 1) {
      if (mockShowtimes[i].movieId === id) mockShowtimes.splice(i, 1);
    }
    return;
  }
  await client.delete(`/movies/${id}`);
}
