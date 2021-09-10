import { FilterTypes } from '../constants.js';

export const filter = {
  [FilterTypes.ALL_FILMS]: (films) => films.slice(),
  [FilterTypes.WATCHLIST]: (films) => films.filter((film) => film.userMeta.isOnWatchlist),
  [FilterTypes.HISTORY]: (films) => films.filter((film) => film.userMeta.isWatched),
  [FilterTypes.FAVORITES]: (films) => films.filter((film) => film.userMeta.isFavorite),
};
