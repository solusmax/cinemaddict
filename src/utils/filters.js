import { FilterType } from '../constants.js';

export const filter = {
  [FilterType.ALL_FILMS]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userMeta.isOnWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userMeta.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userMeta.isFavorite),
};
