const logger = require('../middleware/logger');
const { tmdb_api_key } = require('../config/config');
const { tmdbToMovie, tmdbDetailsToMovie } = require('../utils/mapper');

const tmdbLogger = logger.setTopic('TMDB_SERVICE');
const TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/movie/';
const req_options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${tmdb_api_key}`,
  },
};

exports.getMovieById = async (id) => {
  const tmdb_url = `${TMDB_MOVIE_URL}${id}`;

  const [movieResponse, credits] = await Promise.all([
    fetch(tmdb_url, req_options),
    getMovieCredits(id),
  ]);

  if (!movieResponse.ok) {
    tmdbLogger.error(
      `Failed to fetch movie from TMDB: ${movieResponse.statusText}`
    );
    throw new Error(
      `Failed to fetch movie from TMDB: ${movieResponse.statusText}`
    );
  }

  const tmdbMovie = await movieResponse.json();
  return tmdbDetailsToMovie(tmdbMovie, credits);
};

exports.getTop5Movies = async () => {
  const tmdb_url = `${TMDB_MOVIE_URL}top_rated`;

  const res = await fetch(tmdb_url, req_options);
  const json = await res.json();

  const movies = await Promise.all(
    (json.results || []).slice(0, 5).map(async (tmdb) => {
      const credits = await getMovieCredits(tmdb.id);
      const reviews = await getMovieReviews(tmdb.id);
      return tmdbDetailsToMovie(tmdb, credits, reviews);
    })
  );
  return movies;
};

const getMovieCredits = async (id) => {
  const tmdb_url = `${TMDB_MOVIE_URL}${id}/credits`;

  const response = await fetch(tmdb_url, req_options);
  if (!response.ok) {
    tmdbLogger.error(
      `Failed to fetch movie credits from TMDB: ${response.statusText}`
    );
    throw new Error(
      `Failed to fetch movie credits from TMDB: ${response.statusText}`
    );
  }

  const tmdbCredits = await response.json();
  return tmdbCredits;
};

const getMovieReviews = async (id) => {
  const tmdb_url = `${TMDB_MOVIE_URL}${id}/reviews`;

  const response = await fetch(tmdb_url, req_options);
  if (!response.ok) {
    tmdbLogger.error(
      `Failed to fetch movie reviews from TMDB: ${response.statusText}`
    );
    throw new Error(
      `Failed to fetch movie reviews from TMDB: ${response.statusText}`
    );
  }

  const tmdbReviews = await response.json();
  return tmdbReviews.results || [];
};
