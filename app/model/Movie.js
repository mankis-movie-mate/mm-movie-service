const mongoose = require('mongoose');
const Genre = require('./Genre');

const castSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { _id: false }
);

const directorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { _id: false }
);

const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0.0 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genres: [{ type: String, ref: 'Genre' }],
  posterUrl: { type: String },
  director: directorSchema,
  casts: [castSchema],
  synopsis: { type: String },
  releaseDate: { type: Date },
  language: { type: String },
  rating: { type: ratingSchema, default: () => ({ average: 0.0, count: 0 }) },
  reviews: { type: [reviewSchema], default: [] },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
