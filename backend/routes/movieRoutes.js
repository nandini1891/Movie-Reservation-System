import express from "express";
import {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

// Get all movies
router.get("/", getMovies);

// Get single movie
router.get("/:id", getMovieById);

// Add movie
router.post("/", addMovie);

// Update movie
router.put("/:id", updateMovie);

// Delete movie
router.delete("/:id", deleteMovie);

export default router;