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

const extractGenres = (tmdb) => {
  const fromIds = (tmdb.genre_ids || []).map(
    (id) => tmdb_genres[id] || 'Unknown'
  );
  const fromObjects = (tmdb.genres || []).map((g) => g.name);
  return Array.from(new Set([...fromIds, ...fromObjects]));
};

const extractDirector = (credits) => {
  const directors = credits?.crew
    ?.filter((c) => c.job === 'Director')
    .map((d) => ({
      firstName: d.name.split(' ')[0],
      lastName: d.name.split(' ').slice(1).join(' '),
    })) || [];
  return directors[0] || { firstName: '', lastName: '' };
};

const extractCast = (credits) => {
  return (
    credits?.cast
      ?.filter((c) => c.known_for_department === 'Acting')
      .slice(0, 3)
      .map((c) => ({
        firstName: c.name.split(' ')[0],
        lastName: c.name.split(' ').slice(1).join(' '),
      })) || []
  );
};

const extractReviews = (tmdbReviews) => {
  return tmdbReviews.map((r) => ({
    user: r.author,
    comment: r.content,
    rating: r.author_details?.rating || 0,
    dateCreated: r.created_at ? new Date(r.created_at) : new Date(),
  }));
};

exports.tmdbDetailsToMovie = (tmdb, credits, reviews) => ({
  title: tmdb.title,
  genres: extractGenres(tmdb),
  posterUrl: tmdb.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
    : undefined,
  director: extractDirector(credits),
  casts: extractCast(credits),
  synopsis: tmdb.overview,
  releaseDate: tmdb.release_date ? new Date(tmdb.release_date) : undefined,
  language: tmdb.original_language,
  rating: {
    average: tmdb.vote_average || 0.0,
    count: tmdb.vote_count || 0,
  },
  reviews: reviews ? extractReviews(reviews) : [],
});
