const getFilmsOnWatchlist = (films) => films.filter((film) => film.userMeta.isOnWatchlist);

export const getWatchedFilms = (films) => films.filter((film) => film.userMeta.isWatched);

const getFavoriteFilms = (films) => films.filter((film) => film.userMeta.isFavorite);

const filmFilters = {
  all: (films) => films,
  watchlist: getFilmsOnWatchlist,
  history: getWatchedFilms,
  favorites: getFavoriteFilms,
};

const filmFiltersTitles = {
  all: 'All movies',
  watchlist: 'Watchlist',
  history: 'History',
  favorites: 'Favorites',
};

export const generateFilters = (films) => {
  const filters = [];

  for (const [filterId, filter] of Object.entries(filmFilters)) {
    const filteredFilms = filter(films);

    filters.push ({
      id: filterId,
      title: filmFiltersTitles[filterId],
      films: filteredFilms,
      filmsCount: filteredFilms.length,
    });
  }

  return filters;
};
