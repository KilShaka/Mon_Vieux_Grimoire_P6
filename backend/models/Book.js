const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  ratings: [
    {
      userId: {
        type: String,
        required: true,
      },
      grade: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

// CALCUL DE LA NOTE MOYENNE
bookSchema.methods.getAverageRating = function () {
  this.averageRating =
    Math.round(
      (this.ratings.reduce((avg, rating) => avg + rating.grade, 0) /
        this.ratings.length || 0) * 10
    ) / 10;
};

module.exports = mongoose.model("Book", bookSchema);
