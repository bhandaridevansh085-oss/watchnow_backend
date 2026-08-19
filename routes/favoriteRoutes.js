const express = require("express");
const Favorite = require("../models/Favorite");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// GET USER FAVORITES
// ========================================

router.get("/", authMiddleware, async (req, res) => {
  try {

    const favorites = await Favorite.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });


    res.json(favorites);

  } catch (error) {

    console.error(
      "Failed to fetch favorites:",
      error
    );


    res.status(500).json({
      message: "Failed to fetch favorites",
    });

  }
});


// ========================================
// ADD FAVORITE
// ========================================

router.post("/", authMiddleware, async (req, res) => {
  try {

    const {
      movieId,
      title,
      poster,
      year,
      rating,
      type,
    } = req.body;


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (
      movieId === undefined ||
      movieId === null ||
      !title ||
      !type
    ) {

      return res.status(400).json({
        message:
          "movieId, title and type are required",
      });

    }


    if (
      type !== "movie" &&
      type !== "tv"
    ) {

      return res.status(400).json({
        message:
          "Type must be movie or tv",
      });

    }


    // ----------------------------------------
    // CHECK EXISTING FAVORITE
    // ----------------------------------------

    const existingFavorite =
      await Favorite.findOne({
        user: req.user.id,
        movieId,
        type,
      });


    if (existingFavorite) {

      return res.status(400).json({
        message: "Already in favorites",
      });

    }


    // ----------------------------------------
    // CREATE FAVORITE
    // ----------------------------------------

    const favorite =
      await Favorite.create({

        user: req.user.id,

        movieId,

        title,

        poster,

        year,

        rating,

        type,

      });


    res.status(201).json(
      favorite
    );

  } catch (error) {

    console.error(
      "Failed to add favorite:",
      error
    );


    // Duplicate index protection
    if (
      error.code === 11000
    ) {

      return res.status(400).json({
        message:
          "Already in favorites",
      });

    }


    res.status(500).json({
      message: "Failed to add favorite",
    });

  }
});


// ========================================
// REMOVE FAVORITE
// ========================================
//
// Example:
//
// DELETE /api/favorites/550?type=movie
//
// DELETE /api/favorites/1399?type=tv
//
// ========================================

router.delete(
  "/:movieId",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        movieId,
      } = req.params;


      const {
        type,
      } = req.query;


      // ----------------------------------------
      // VALIDATE TYPE
      // ----------------------------------------

      if (
        type !== "movie" &&
        type !== "tv"
      ) {

        return res.status(400).json({
          message:
            "Type must be movie or tv",
        });

      }


      // ----------------------------------------
      // DELETE
      // ----------------------------------------

      const favorite =
        await Favorite.findOneAndDelete({

          user: req.user.id,

          movieId,

          type,

        });


      // ----------------------------------------
      // NOT FOUND
      // ----------------------------------------

      if (!favorite) {

        return res.status(404).json({
          message:
            "Favorite not found",
        });

      }


      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      res.json({
        message:
          "Favorite removed",
      });

    } catch (error) {

      console.error(
        "Failed to remove favorite:",
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