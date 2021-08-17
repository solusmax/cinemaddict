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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${setActiveClass(isOnWatchlist, ClassNames.CONTROL_ACTIVE_STATE)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${setActiveClass(isWatched, ClassNames.CONTROL_ACTIVE_STATE)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${setActiveClass(isFavorite, ClassNames.CONTROL_ACTIVE_STATE)}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();

    this._film = film;

    this._onCommentsLinkClick = this._onCommentsLinkClick.bind(this);
    this._onPosterClick = this._onPosterClick.bind(this);
    this._onTitleClick = this._onTitleClick.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _getCommentsLinkElement() {
    return this.getElement().querySelector(`.${ClassNames.COMMENTS_LINK}`);
  }

  _getPosterElement() {
    return this.getElement().querySelector(`.${ClassNames.POSTER}`);
  }

  _getTitleElement() {
    return this.getElement().querySelector(`.${ClassNames.TITLE}`);
  }

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
}
