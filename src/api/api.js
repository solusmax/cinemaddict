import CommentsModel from '../model/comments.js';
import FilmsModel from '../model/films.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;

    this._commentsLoadingAbortController = null;
  }

  getFilms() {
    return this._load({ url: 'movies' })
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    this._commentsLoadingAbortController = new AbortController();

    return this._load({
      url: `comments/${filmId}`,
      signal: this._commentsLoadingAbortController.signal,
    })
      .then(Api.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addComment(film, comment) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then((response) => ({
        film: FilmsModel.adaptToClient(response.movie),
        comments: response.comments.map(CommentsModel.adaptToClient),
      }));
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  sync(data) {
    return this._load({
      url: 'movies/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
    signal = null,
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      { method, body, headers, signal },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  cancelCurrentCommentsLoading() {
    if (!this._commentsLoadingAbortController) {
      return;
    }

    this._commentsLoadingAbortController.abort();
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
