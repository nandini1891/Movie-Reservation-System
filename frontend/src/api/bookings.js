import { client } from "./client.js";
import { mockBookings } from "./mockData.js";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

/**
 * BACKEND CONTRACT
 * -----------------
 * GET /bookings   -> Booking[]   (admin sees all bookings; members see only their own)
 *
 * Booking = {
 *   id, movieTitle, theaterName, showtime (ISO), seats: string[],
 *   totalCost, status: "confirmed" | "cancelled", userName, userEmail, createdAt (ISO)
 * }
 */

export async function listBookings() {
  if (USE_MOCKS) return [...mockBookings];
  const { data } = await client.get("/bookings");
  return data;
}
