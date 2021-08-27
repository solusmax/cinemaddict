export const updateFilmData = (films, updatedFilm) => {
  const filmIndex = films.findIndex((film) => film.id === updatedFilm.id);

  return filmIndex === -1
    ? films
    : [...films.slice(0, filmIndex), updatedFilm, ...films.slice(filmIndex + 1)];
};
