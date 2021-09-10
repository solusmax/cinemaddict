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
}
