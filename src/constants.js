export const RANDOM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

export const MINUTES_IN_ONE_DAY = 1440;

export const SortMethods = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserActions = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateTypes = {
  FILM: 'FILM',
  FILM_AND_EXTRA: 'FILM_AND_EXTRA',
  FILMS_LIST: 'FILMS_LIST',
  FILMS_LIST_AND_SORT: 'FILMS_LIST_AND_SORT',
};

export const FilterTypes = {
  ALL_FILMS: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'histoty',
  FAVORITES: 'favorites',
};

export const UserRanks = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const UserRanksRanges = {
  [UserRanks.NOVICE]: [1, 10],
  [UserRanks.FAN]: [11, 20],
  [UserRanks.MOVIE_BUFF]: [21, Infinity],
};
