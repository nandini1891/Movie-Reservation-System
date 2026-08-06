<<<<<<< HEAD
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    rating: {
      type: String,
      default: "PG-13",
    },
    year: {
      type: Number,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    cast: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    poster: {
      type: String,
    },
    banner: {
      type: String,
    },
    showTimes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
=======
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: [String], required: true },
    duration: { type: Number, required: true }, // in minutes
    description: { type: String, required: true },
    posterUrl: { type: String, default: "" },
    rating: { type: String, default: "NR" }, // e.g. PG-13, R
    releaseDate: { type: Date },
    isActive: { type: Boolean, default: true }, // soft-delete / "now showing" toggle
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
>>>>>>> 7d52a8b1d71d4059e80c43015346320a9d5672e0
