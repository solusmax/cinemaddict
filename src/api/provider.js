import FilmsModel from '../model/films.js';
import { isOnline } from '../utils';

const createStoreStructure = (items) =>
  items
    .reduce((accumulator, currentItem) => Object.assign(
      {},
      accumulator,
      {
        [currentItem.id]: currentItem,
      }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    return this._api.getComments(filmId);
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));

          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(film, comment) {
    return this._api.addComment(film, comment);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const createdFilms = response.created || [];
          const updatedFilms = response.updated || [];

          const items = createStoreStructure([...createdFilms, ...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }

  cancelCurrentCommentsLoading() {
    this._api.cancelCurrentCommentsLoading();
  }
}
