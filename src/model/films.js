import AbstractObserver from '../utils/abstract-observer.js';
import {
  findIndexById,
  getArrayWithoutElement
} from '../utils';

export default class Films extends AbstractObserver {
  constructor() {
    super();

    this._films = [];
  }

  get films() {
    return this._films;
  }

  set films(films) {
    this._films = films.slice();
  }

  updateFilm(updateType, updatedFilm) {
    const filmIndex = findIndexById(this._films, updatedFilm.id);

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

  addComment(updateType, filmToUpdate, newCommentId) {
    const filmIndex = findIndexById(this._films, filmToUpdate.id);

    if (filmIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films[filmIndex].comments.push(newCommentId);

    this._notify(updateType, filmToUpdate);
  }

  deleteComment(updateType, [filmToUpdate, commentIdToDelete]) {
    const filmIndex = findIndexById(this._films, filmToUpdate.id);

    if (filmIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const commentIndex = findIndexById(this._films[filmIndex].comments, commentIdToDelete, true);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._films[filmIndex].comments = getArrayWithoutElement(this._films[filmIndex].comments, commentIndex);

    this._notify(updateType, filmToUpdate);
  }

  hasComments() {
    return Boolean(this._films.reduce((commentCount, film) => commentCount + film.comments.length, 0));
  }

  hasNonZeroRating() {
    return Boolean(this._films.filter((film) => Boolean(Number(film.info.rating))).length > 0);
  }

  static adaptToClient(film) {
    const filmInfo = Object.assign({},film['film_info']);
    const userDetails = Object.assign({},film['user_details']);

    const adaptedFilmInfo = Object.assign(
      {},
      filmInfo,
      {
        ageRating: filmInfo['age_rating'],
        duration: filmInfo['runtime'],
        genres: filmInfo['genre'],
        originalTitle: filmInfo['alternative_title'],
        rating: filmInfo['total_rating'],
        releaseCountry: filmInfo['release']['release_country'],
        releaseDate: filmInfo['release']['date'],
        screenwriters: filmInfo['writers'],
      },
    );

    delete adaptedFilmInfo['age_rating'];
    delete adaptedFilmInfo['alternative_title'];
    delete adaptedFilmInfo['genre'];
    delete adaptedFilmInfo['release'];
    delete adaptedFilmInfo['runtime'];
    delete adaptedFilmInfo['total_rating'];
    delete adaptedFilmInfo['writers'];

    const adaptedUserDetials = Object.assign(
      {},
      userDetails,
      {
        isFavorite: userDetails['favorite'],
        isOnWatchlis: userDetails['watchlist'],
        isWatched: userDetails['already_watched'],
        watchingDate: userDetails['watching_date'],
      },
    );

    delete adaptedUserDetials['already_watched'];
    delete adaptedUserDetials['favorite'];
    delete adaptedUserDetials['watching_date'];
    delete adaptedUserDetials['watchlist'];

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        info: adaptedFilmInfo,
        userMeta: adaptedUserDetials,
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const info = Object.assign({},film.info);
    const userMeta = Object.assign({},film.userMeta);

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
        'film_info': adaptedInfo,
        'user_details': adaptedUserMeta,

        info: adaptedInfo,
        userMeta: adaptedUserMeta,
      },
    );

    delete adaptedFilm.info;
    delete adaptedFilm.userMeta;

    return adaptedFilm;
  }
}
