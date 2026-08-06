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