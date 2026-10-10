import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

// Every watchlist route needs a valid token
router.use(authenticate);

// Any logged-in user can read any watchlist
router.get("/:userId", (req, res) => {
  const watchlist = getWatchlist(Number(req.params.userId));

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found." });
  }

  res.status(200).json(watchlist);
});

// Add a movie
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = addMovie(Number(req.params.userId), req.body);

  if (movie === null) {
    return res.status(404).json({ error: "User not found." });
  }

  res.status(201).json(movie);
});

// Update a movie
router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    req.body,
  );

  if (movie === null) {
    return res.status(404).json({ error: "Movie or user not found." });
  }

  res.status(200).json(movie);
});

// Delete a movie
router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const result = deleteMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
  );

  if (result === null) {
    return res.status(404).json({ error: "Movie or user not found." });
  }

  res.status(200).json({ message: "Movie removed." });
});

export default router;