import {
  getFilmCommentsCount,
  getFilmDate,
  getFilmRating,
  getMostRecentDate
} from '.';

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
