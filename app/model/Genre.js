const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: true }
);

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
