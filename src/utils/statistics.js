import {
  getFilmDuration,
  getFilmGenres,
  isDateBetweenNowAndNAgo,
  isDateToday
} from '.';

export const getSortedGenres = (films) => {
  const genres = {};
  const sortedGenres = [];

  films.forEach((film) => {
    getFilmGenres(film).forEach((genre) => {
      genres[genre] = genres[genre] ? ++genres[genre] : 1;
    });
  });

  for (const [genre, count] of Object.entries(genres)) {
    sortedGenres.push([genre, count]);
  }

  return sortedGenres.sort((a, b) => b[1] - a[1]);
};

export const getTotalDurationInMinutes = (films) => films.reduce((totalDuration, film) => totalDuration + getFilmDuration(film), 0);

export const getFilmsWatchedToday = (films) => films.filter((film) => isDateToday(film.userMeta.watchingDate));

export const getFilmsWatchedWithinN = (films, calendarUnit) => films.filter((film) => isDateBetweenNowAndNAgo(film.userMeta.watchingDate, calendarUnit));
