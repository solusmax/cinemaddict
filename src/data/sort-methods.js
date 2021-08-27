import {
  getFilmsSortedByDate,
  getFilmsSortedByRating
} from '../utils';

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
