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
};

export const ViewStateValue = {
  NO_PROCESSING: 'NO_PROCESSING',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
};

export const AlertMessage = {
  ERROR_COMMENTS_LOADING: 'Error loading comments',
  ERROR_COMMENT_ADDING: 'Error adding comment',
  ERROR_COMMENT_DELETING: 'Error deleting comment',
  ERROR_FILMS_LOADING: 'Error loading films',
  ERROR_FILM_UPDATING: 'Film update error',
  OFFLINE_ON: 'Offline mode is enabled',
  ONLINE_ON: 'Back online',
  WARNING_COMMENTS_LOADING_OFFLINE: 'Comments are not available offline',
  WARNING_COMMENT_ADDING_OFFLINE: 'You can\'t comment offline',
  WARNING_COMMENT_DELETING_OFFLINE: 'You can\'t delete comment offline',
};

export const AlertType = {
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};
