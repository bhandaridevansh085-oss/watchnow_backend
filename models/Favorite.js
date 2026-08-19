const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER
    // =====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // =====================================================
    // MOVIE / TV ID
    // =====================================================

    movieId: {
      type: Number,
      required: true,
    },


    // =====================================================
    // TITLE
    // =====================================================

    title: {
      type: String,
      required: true,
    },


    // =====================================================
    // POSTER
    // =====================================================

    poster: {
      type: String,
      default: null,
    },


    // =====================================================
    // YEAR
    // =====================================================

    year: {
      type: String,
      default: "",
    },


    // =====================================================
    // RATING
    // =====================================================

    rating: {
      type: Number,
      default: 0,
    },


    // =====================================================
    // TYPE
    // movie OR tv
    // =====================================================

    type: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// =========================================================
// PREVENT DUPLICATE FAVORITES
//
// Same user + same TMDB ID + same type
//
// Example:
//
// User A + movie 550 + movie
// User A + movie 550 + tv
//
// These are treated as different favorites.
// =========================================================

favoriteSchema.index(
  {
    user: 1,
    movieId: 1,
    type: 1,
  },
  {
    unique: true,
  }
);


module.exports = mongoose.model(
  "Favorite",
  favoriteSchema
);