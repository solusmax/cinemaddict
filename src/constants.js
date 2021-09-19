export const EMOJIS = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

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
  INIT: 'INIT',
  FILM: 'FILM',
  FILM_AND_EXTRA: 'FILM_AND_EXTRA',
  FILM_AND_FILMS_LIST: 'FILM_AND_FILMS_LIST',
  FILMS_LIST_AND_SORT: 'FILMS_LIST_AND_SORT',
};

export const FilterTypes = {
  ALL_FILMS: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
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

export const StatsRanges = {
  ALL_TIME: 'All time',
  TODAY: 'Today',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
};

export const MainListTitleText = {
  DEFAULT: 'All movies. Upcoming',
  [FilterTypes.ALL_FILMS]: 'There are no movies in our database',
  [FilterTypes.WATCHLIST]: 'There are no movies to watch now',
  [FilterTypes.HISTORY]: 'There are no watched movies now',
  [FilterTypes.FAVORITES]: 'There are no favorite movies now',
  LOADING: 'Loading...',
};

export const FilmCardStateType = {
  COMMENT_ADDING: 'commentAdding',
  COMMENTS_IDS_TO_DELETE: 'commentsIdsToDelete',
  COMMENTS_LOADING: 'commentsLoading',
  META_UPDATING: 'metaUpdating',
};

export const ViewStateValue = {
  NO_PROCESSING: 'NO_PROCESSING',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
};

export const ErrorMessage = {
  COMMENTS_LOADING: 'Error loading comments',
  COMMENT_ADDING: 'Error adding comment',
  COMMENT_DELETING: 'Error deleting comment',
  FILMS_LOADING: 'Error loading films',
  FILM_UPDATING: 'Film update error',
};
