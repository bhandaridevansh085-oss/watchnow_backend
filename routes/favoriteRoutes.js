const express = require("express");
const Favorite = require("../models/Favorite");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// GET USER FAVORITES
// ========================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      const favorites = await Favorite.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

      res.json(favorites);

    } catch (error) {

      console.error(
        "GET FAVORITES ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch favorites",
      });

    }
  }
);


// ========================================
// ADD FAVORITE
// ========================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      const {
        movieId,
        title,
        poster,
        year,
        rating,
        type,
      } = req.body;


      // Validate movie ID

      if (!movieId) {

        return res.status(400).json({
          message: "Movie ID is required",
        });

      }


      // Validate type

      if (
        type !== "movie" &&
        type !== "tv"
      ) {

        return res.status(400).json({
          message:
            "Type must be movie or tv",
        });

      }


      // Check existing favorite

      const existingFavorite =
        await Favorite.findOne({
          user: req.user.id,
          movieId: movieId,
          type: type,
        });


      if (existingFavorite) {

        return res.status(400).json({
          message:
            "Already in favorites",
        });

      }


      // Create favorite

      const favorite =
        await Favorite.create({

          user:
            req.user.id,

          movieId:
            movieId,

          title:
            title || "",

          poster:
            poster || null,

          year:
            year || "",

          rating:
            Number(rating) || 0,

          type:
            type,

        });


      res.status(201).json(
        favorite
      );

    } catch (error) {

      console.error(
        "ADD FAVORITE ERROR:",
        error
      );


      // MongoDB duplicate key

      if (
        error.code === 11000
      ) {

        return res.status(400).json({
          message:
            "Already in favorites",
        });

      }


      res.status(500).json({
        message:
          error.message ||
          "Failed to add favorite",
      });

    }
  }
);


// ========================================
// REMOVE FAVORITE
// ========================================
//
// DELETE:
// /api/favorites/:movieId/:type
//
// Example:
// /api/favorites/1084244/movie
//
// ========================================

router.delete(
  "/:movieId/:type",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        movieId,
        type,
      } = req.params;


      // Validate type

      if (
        type !== "movie" &&
        type !== "tv"
      ) {

        return res.status(400).json({
          message:
            "Type must be movie or tv",
        });

      }


      const favorite =
        await Favorite.findOneAndDelete({

          user:
            req.user.id,

          movieId:
            movieId,

          type:
            type,

        });


      if (!favorite) {

        return res.status(404).json({
          message:
            "Favorite not found",
        });

      }


      res.json({
        message:
          "Favorite removed",
      });

    } catch (error) {

      console.error(
        "REMOVE FAVORITE ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to remove favorite",
      });

    }
  }
);


module.exports = router;