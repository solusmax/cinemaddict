import AbstractView from './abstract.js';
import {
  addPluralEnding,
  getFormattedDuration,
  getYearFromDate,
  setActiveClass
} from '../utils';

const MAX_LETTERS_IN_SHORT_DESCRIPTION = 140;

const ClassNames = {
  CONTROL_ACTIVE_STATE: 'film-card__controls-item--active',
  COMMENTS_LINK: 'film-card__comments',
  POSTER: 'film-card__poster',
  TITLE: 'film-card__title',
  ADD_TO_WATCHLIST_CONTROL: 'film-card__controls-item--add-to-watchlist',
  MARK_AS_WATCHED_CONTROL: 'film-card__controls-item--mark-as-watched',
  MARK_AS_FAVORITE_CONTROL: 'film-card__controls-item--favorite',
};

const getShortDescription = (description) => description.length > MAX_LETTERS_IN_SHORT_DESCRIPTION
  ? `${description.slice(0, MAX_LETTERS_IN_SHORT_DESCRIPTION - 1).trim()}…`
  : description;

const createFilmCardTemplate = (film) => {
  const {
    comments: commentsIds,
    info: {
      poster,
      title,
      rating,
      releaseDate,
      duration,
      genres,
      description,
    },
    userMeta: {
      isWatched,
      isFavorite,
      isOnWatchlist,
    },
  } = film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getYearFromDate(releaseDate)}</span>
        <span class="film-card__duration">${getFormattedDuration(duration)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getShortDescription(description)}</p>
      <a class="film-card__comments">${commentsIds.length} comment${addPluralEnding(commentsIds.length)}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${ClassNames.ADD_TO_WATCHLIST_CONTROL} ${setActiveClass(isOnWatchlist, ClassNames.CONTROL_ACTIVE_STATE)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${ClassNames.MARK_AS_WATCHED_CONTROL} ${setActiveClass(isWatched, ClassNames.CONTROL_ACTIVE_STATE)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${ClassNames.MARK_AS_FAVORITE_CONTROL} ${setActiveClass(isFavorite, ClassNames.CONTROL_ACTIVE_STATE)}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._filmId = this._film.id;

    this._onCommentsLinkClick = this._onCommentsLinkClick.bind(this);
    this._onPosterClick = this._onPosterClick.bind(this);
    this._onTitleClick = this._onTitleClick.bind(this);
    this._onAddToWatchlistButtonClick = this._onAddToWatchlistButtonClick.bind(this);
    this._onMarkAsWatchedButtonClick = this._onMarkAsWatchedButtonClick.bind(this);
    this._onMarkAsFavoriteButtonClick = this._onMarkAsFavoriteButtonClick.bind(this);
  }

  _getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getFilmId() {
    return this._filmId;
  }

  // Геттеры элементов ↓↓↓

  _getCommentsLinkElement() {
    return this.getElement().querySelector(`.${ClassNames.COMMENTS_LINK}`);
  }

  _getPosterElement() {
    return this.getElement().querySelector(`.${ClassNames.POSTER}`);
  }

  _getTitleElement() {
    return this.getElement().querySelector(`.${ClassNames.TITLE}`);
  }

  _getAddToWatchlistButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.ADD_TO_WATCHLIST_CONTROL}`);
  }

  _getMarkAsWatchedButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.MARK_AS_WATCHED_CONTROL}`);
  }

  _getMarkAsFavoriteButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.MARK_AS_FAVORITE_CONTROL}`);
  }

  // Колбэки листенеров ↓↓↓

  _onCommentsLinkClick(evt) {
    evt.preventDefault();

    this._callback.commentsLinkClick();
  }

  _onPosterClick() {
    this._callback.posterClick();
  }

  _onTitleClick() {
    this._callback.titleClick();
  }

  _onAddToWatchlistButtonClick(evt) {
    evt.preventDefault();

    this._callback.addToWatchlistButtonClick();
  }

  _onMarkAsWatchedButtonClick(evt) {
    evt.preventDefault();

    this._callback.markAsWatchedButtonClick();
  }

  _onMarkAsFavoriteButtonClick(evt) {
    evt.preventDefault();

    this._callback.markAsFavoriteButtonClick();
  }

  // Сеттеры листенеров ↓↓↓

  setCommentsLinkClickListener(cb) {
    this._callback.commentsLinkClick = cb;
    this._getCommentsLinkElement().addEventListener('click', this._onCommentsLinkClick);
  }

  setPosterClickListener(cb) {
    this._callback.posterClick = cb;
    this._getPosterElement().addEventListener('click', this._onPosterClick);
  }

  setTitleClickListener(cb) {
    this._callback.titleClick = cb;
    this._getTitleElement().addEventListener('click', this._onTitleClick);
  }

  setAddToWatchlistButtonClickListener(cb) {
    this._callback.addToWatchlistButtonClick = cb;
    this._getAddToWatchlistButtonElement().addEventListener('click', this._onAddToWatchlistButtonClick);
  }

  setMarkAsWatchedButtonClickListener(cb) {
    this._callback.markAsWatchedButtonClick = cb;
    this._getMarkAsWatchedButtonElement().addEventListener('click', this._onMarkAsWatchedButtonClick);
  }

  setMarkAsFavoriteButtonClickListener(cb) {
    this._callback.markAsFavoriteButtonClick = cb;
    this._getMarkAsFavoriteButtonElement().addEventListener('click', this._onMarkAsFavoriteButtonClick);
  }

  // Удаляторы листенеров ↓↓↓

  removeCommentsLinkClickListener() {
    this._getCommentsLinkElement().removeEventListener('click', this._onCommentsLinkClick);
  }

  removePosterClickListener() {
    this._getPosterElement().removeEventListener('click', this._onPosterClick);
  }

  removeTitleClickListener() {
    this._getTitleElement().removeEventListener('click', this._onTitleClick);
  }

  removeAddToWatchlistButtonClickListener() {
    this._getAddToWatchlistButtonElement().removeEventListener('click', this._onAddToWatchlistButtonClick);
  }

  removeMarkAsWatchedButtonClickListener() {
    this._getMarkAsWatchedButtonElement().removeEventListener('click', this._onMarkAsWatchedButtonClick);
  }

  removeMarkAsFavoriteButtonClickListener() {
    this._getMarkAsFavoriteButtonElement().removeEventListener('click', this._onMarkAsFavoriteButtonClick);
  }
}
