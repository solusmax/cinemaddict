export const getSortedGenres = (films) => {
  const genres = {};
  const sortedGenres = [];

  films.forEach((film) => {
    film.info.genres.forEach((genre) => {
      genres[genre] = genres[genre] ? ++genres[genre] : 1;
    });
  });

  for (const [genre, count] of Object.entries(genres)) {
    sortedGenres.push([genre, count]);
  }

  return sortedGenres.sort((a, b) => b[1] - a[1]);
};

export const getTotalDurationInMinutes = (films) => films.reduce((totalDuration, film) => totalDuration + film.info.duration, 0);
