export const getFilmCommentsCount = (film) => film.comments.length;

export const getFilmDate = (film) => film.info.releaseDate;

export const getFilmGenres = (film) => film.info.genres;

export const getFilmDuration = (film) => film.info.duration;

export const getFilmRating = (film) => film.info.rating;
