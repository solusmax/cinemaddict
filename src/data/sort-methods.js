import {
  getMostRecentDate
} from '../utils.js';

const getFilmDate = (film) => film.info.releaseDate;

const getFilmCommentsCount = (film) => film.comments.length;

const getFilmRating = (film) => film.info.rating;

const compareFilmsByDate = (filmA, filmB) => {
  const dateA = getFilmDate(filmA);
  const dateB = getFilmDate(filmB);

  switch (getMostRecentDate(dateA, dateB)) {
    case dateA:
      return -1;
    case dateB:
      return 1;
    default:
      return 0;
  }
};

const compareFilmsByComments = (filmA, filmB) => {
  const commentsCountA = getFilmCommentsCount(filmA);
  const commentsCountB = getFilmCommentsCount(filmB);

  return commentsCountB - commentsCountA;
};

const compareFilmsByRating = (filmA, filmB) => {
  const ratingA = getFilmRating(filmA);
  const ratingB = getFilmRating(filmB);

  return ratingB - ratingA;
};

export const getFilmsSortedByDate = (films) => films
  .slice()
  .sort(compareFilmsByDate);

export const getFilmsSortedByComments = (films) => films
  .slice()
  .sort(compareFilmsByComments);

export const getFilmsSortedByRating = (films) => films
  .slice()
  .sort(compareFilmsByRating);

const filmSortMethods = {
  default: (films) => films,
  date: getFilmsSortedByDate,
  rating: getFilmsSortedByRating,
};

const filmSortMethodsTitles = {
  default: 'Sort by default',
  date: 'Sort by date',
  rating: 'Sort by rating',
};

export const generateSortMethods = (films) => {
  const sortMethods = [];

  for (const [sortMethodName, sort] of Object.entries(filmSortMethods)) {
    sortMethods.push ({
      id: sortMethodName,
      title: filmSortMethodsTitles[sortMethodName],
      sortedFilms: sort(films),
    });
  }

  return sortMethods;
};
