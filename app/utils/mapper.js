const tmdb_genres = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

exports.tmdbToMovie = (tmdb, localMovie) => ({
  title: tmdb.title,
  genres: (tmdb.genre_ids || []).map((id => {
    const genre = tmdb_genres[id];
    return genre ? genre : 'Unknown';
  })),
  posterUrl: tmdb.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
    : undefined,
  director: localMovie ? localMovie.director : undefined,
  casts: localMovie ? localMovie.casts : [],
  synopsis: tmdb.overview,
  releaseDate: tmdb.release_date ? new Date(tmdb.release_date) : undefined,
  language: tmdb.original_language,
  rating: {
    average: tmdb.vote_average || 0.0,
    count: tmdb.vote_count || 0,
  },
  reviews: [],
});