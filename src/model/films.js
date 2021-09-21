import AbstractObserver from '../utils/abstract-observer.js';
import {
  getArrayWithoutElement,
  getFilmCommentsCount,
  getFilmRating,
  getIndexById
} from '../utils';

export default class Films extends AbstractObserver {
  constructor() {
    super();

    this._films = [];
  }

  getFilms() {
    return this._films;
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  updateFilm(updateType, updatedFilm) {
    const filmIndex = getIndexById(this._films, updatedFilm.id);

    if (filmIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, filmIndex),
      updatedFilm,
      ...this._films.slice(filmIndex + 1),
    ];

    this._notify(updateType, updatedFilm);
  }

  addComment(updateType, filmToUpdate, updatedComments) {
    const filmIndex = getIndexById(this._films, filmToUpdate.id);

    if (filmIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const updatedCommentsIds = updatedComments.map((comment) => comment.id);

    this._films[filmIndex].comments = updatedCommentsIds;

    this._notify(updateType, filmToUpdate);
  }

  deleteComment(updateType, filmToUpdate, commentToDeleteId) {
    const filmIndex = getIndexById(this._films, filmToUpdate.id);

    if (filmIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const commentIndex = getIndexById(this._films[filmIndex].comments, commentToDeleteId, true);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._films[filmIndex].comments = getArrayWithoutElement(this._films[filmIndex].comments, commentIndex);

    this._notify(updateType, this._films[filmIndex]);
  }

  hasComments() {
    return Boolean(this._films.reduce((commentCount, film) => commentCount + getFilmCommentsCount(film), 0));
  }

  hasNonZeroRating() {
    return Boolean(this._films.filter((film) => getFilmRating(film)).length > 0);
  }

  static adaptToClient(film) {
    const info = Object.assign({}, film['film_info']);
    const userMeta = Object.assign({}, film['user_details']);

    const adaptedInfo = Object.assign(
      {},
      info,
      {
        ageRating: info['age_rating'],
        duration: info['runtime'],
        genres: info['genre'],
        originalTitle: info['alternative_title'],
        rating: info['total_rating'],
        releaseCountry: info['release']['release_country'],
        releaseDate: info['release']['date'],
        screenwriters: info['writers'],
      },
    );

    delete adaptedInfo['age_rating'];
    delete adaptedInfo['alternative_title'];
    delete adaptedInfo['genre'];
    delete adaptedInfo['release'];
    delete adaptedInfo['runtime'];
    delete adaptedInfo['total_rating'];
    delete adaptedInfo['writers'];

    const adaptedUserMeta = Object.assign(
      {},
      userMeta,
      {
        isFavorite: userMeta['favorite'],
        isOnWatchlis: userMeta['watchlist'],
        isWatched: userMeta['already_watched'],
        watchingDate: userMeta['watching_date'],
      },
    );

    delete adaptedUserMeta['already_watched'];
    delete adaptedUserMeta['favorite'];
    delete adaptedUserMeta['watching_date'];
    delete adaptedUserMeta['watchlist'];

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        id: Number(film['id']),
        info: adaptedInfo,
        userMeta: adaptedUserMeta,
        comments: film['comments'].map((commentId) => Number(commentId)),
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const info = Object.assign({}, film.info);
    const userMeta = Object.assign({}, film.userMeta);

    const adaptedInfo = Object.assign(
      {},
      info,
      {
        'age_rating': info.ageRating,
        'alternative_title': info.originalTitle,
        'genre': info.genres,
        'release': {
          'release_country': info.releaseCountry,
          'date': info.releaseDate,
        },
        'runtime': info.duration,
        'total_rating': info.rating,
        'writers': info.screenwriters,
      },
    );

    delete adaptedInfo.ageRating;
    delete adaptedInfo.duration;
    delete adaptedInfo.genres;
    delete adaptedInfo.originalTitle;
    delete adaptedInfo.rating;
    delete adaptedInfo.releaseCountry;
    delete adaptedInfo.releaseDate;
    delete adaptedInfo.screenwriters;

    const adaptedUserMeta = Object.assign(
      {},
      userMeta,
      {
        'favorite': userMeta.isFavorite,
        'watchlist': userMeta.isOnWatchlis,
        'already_watched': userMeta.isWatched,
        'watching_date': userMeta.watchingDate,
      },
    );

    delete adaptedUserMeta.isFavorite;
    delete adaptedUserMeta.isOnWatchlis;
    delete adaptedUserMeta.isWatched;
    delete adaptedUserMeta.watchingDate;

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'id': String(film.id),
        'film_info': adaptedInfo,
        'user_details': adaptedUserMeta,
        'comments': film.comments.map((commentId) => String(commentId)),
      },
    );

    delete adaptedFilm.info;
    delete adaptedFilm.userMeta;

    return adaptedFilm;
  }
}
