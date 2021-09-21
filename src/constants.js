export const EMOJIS = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  INIT: 'INIT',
  FILM: 'FILM',
  FILM_AND_EXTRA: 'FILM_AND_EXTRA',
  FILM_AND_FILMS_LIST: 'FILM_AND_FILMS_LIST',
  FILMS_LIST_AND_SORT: 'FILMS_LIST_AND_SORT',
};

export const FilterType = {
  ALL_FILMS: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const SortMethod = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const UserRankRange = {
  [UserRank.NOVICE]: [1, 10],
  [UserRank.FAN]: [11, 20],
  [UserRank.MOVIE_BUFF]: [21, Infinity],
};

export const StatisticsRange = {
  ALL_TIME: 'All time',
  TODAY: 'Today',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
};

export const CalendarUnit = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const FilmsListType = {
  MAIN: 'films-list-main',
  TOP_RATED: 'films-list-top-rated',
  MOST_COMMENTED: 'films-list-most-commented',
};

export const FilmCardStateType = {
  COMMENT_ADDING: 'commentAdding',
  COMMENTS_TO_DELETE_IDS: 'commentsToDeleteIds',
  COMMENTS_LOADING: 'commentsLoading',
};

export const ViewStateValue = {
  NO_PROCESSING: 'NO_PROCESSING',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
};

export const NotificationType = {
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

export const NotificationMessage = {
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

export const MainFilmsListTitleText = {
  DEFAULT: 'All movies. Upcoming',
  LOADING: 'Loading...',
  [FilterType.ALL_FILMS]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};
