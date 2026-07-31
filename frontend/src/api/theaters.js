import { client } from "./client.js";
import { mockTheaters, mockShowtimes, nextId } from "./mockData.js";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

/**
 * BACKEND CONTRACT
 * -----------------
 * GET    /theaters          -> Theater[]
 * POST   /theaters          { name, rows, seatsPerRow, description } -> Theater
 * DELETE /theaters/:id      -> 204
 *
 * Theater = { id, name, rows, seatsPerRow, description }
 * (capacity = rows * seatsPerRow, computed client-side for display)
 */

export async function listTheaters() {
  if (USE_MOCKS) return [...mockTheaters];
  const { data } = await client.get("/theaters");
  return data;
}

export async function createTheater(payload) {
  if (USE_MOCKS) {
    const theater = { id: nextId(), ...payload };
    mockTheaters.push(theater);
    return theater;
  }
  const { data } = await client.post("/theaters", payload);
  return data;
}

export async function deleteTheater(id) {
  if (USE_MOCKS) {
    const idx = mockTheaters.findIndex((t) => t.id === id);
    if (idx !== -1) mockTheaters.splice(idx, 1);
    for (let i = mockShowtimes.length - 1; i >= 0; i -= 1) {
      if (mockShowtimes[i].theaterId === id) mockShowtimes.splice(i, 1);
    }
    return;
  }
  await client.delete(`/theaters/${id}`);
}
