import AbstractFilmCardView from './abstract-film-card.js';
import {
  getActivityClass,
  getFormattedDuration,
  getPluralEnding,
  getYearFromDate
} from '../utils';

const MAX_LETTERS_IN_DESCRIPTION = 140;

const ClassName = {
  CONTROL_ACTIVE_STATE: 'film-card__controls-item--active',
  COMMENTS_LINK: 'film-card__comments',
  POSTER: 'film-card__poster',
  TITLE: 'film-card__title',
  ADD_TO_WATCHLIST_CONTROL: 'film-card__controls-item--add-to-watchlist',
  MARK_AS_WATCHED_CONTROL: 'film-card__controls-item--mark-as-watched',
  MARK_AS_FAVORITE_CONTROL: 'film-card__controls-item--favorite',
};

const getShortDescription = (description) => description.length > MAX_LETTERS_IN_DESCRIPTION
  ? `${description.slice(0, MAX_LETTERS_IN_DESCRIPTION - 1).trim()}…`
  : description;

const createFilmCardTemplate = (film, updatingUserMetaFilmsIds) => {
  const {
    id,
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

  const hasUserMetaUpdating = updatingUserMetaFilmsIds.has(id);

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
      <a class="film-card__comments">${commentsIds.length} comment${getPluralEnding(commentsIds.length)}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${ClassName.ADD_TO_WATCHLIST_CONTROL} ${getActivityClass(isOnWatchlist, ClassName.CONTROL_ACTIVE_STATE)}" type="button" ${hasUserMetaUpdating ? 'disabled' : ''}>Add to watchlist</button>
        <button class="film-card__controls-item ${ClassName.MARK_AS_WATCHED_CONTROL} ${getActivityClass(isWatched, ClassName.CONTROL_ACTIVE_STATE)}" type="button" ${hasUserMetaUpdating ? 'disabled' : ''}>Mark as watched</button>
        <button class="film-card__controls-item ${ClassName.MARK_AS_FAVORITE_CONTROL} ${getActivityClass(isFavorite, ClassName.CONTROL_ACTIVE_STATE)}" type="button" ${hasUserMetaUpdating ? 'disabled' : ''}>Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCard extends AbstractFilmCardView {
  constructor(film, updatingUserMetaFilmsIds) {
    super(film, updatingUserMetaFilmsIds);

    this._onCommentsLinkClick = this._onCommentsLinkClick.bind(this);
    this._onPosterClick = this._onPosterClick.bind(this);
    this._onTitleClick = this._onTitleClick.bind(this);
  }

  _getTemplate() {
    return createFilmCardTemplate(this._film, this._updatingUserMetaFilmsIds);
  }

  getListType() {
    return this.getElement().parentElement.parentElement.id;
  }

  // Геттеры элементов ↓↓↓

  _getAddToWatchlistButtonElement() {
    return this.getElement().querySelector(`.${ClassName.ADD_TO_WATCHLIST_CONTROL}`);
  }

  _getMarkAsWatchedButtonElement() {
    return this.getElement().querySelector(`.${ClassName.MARK_AS_WATCHED_CONTROL}`);
  }

  _getMarkAsFavoriteButtonElement() {
    return this.getElement().querySelector(`.${ClassName.MARK_AS_FAVORITE_CONTROL}`);
  }

  _getCommentsLinkElement() {
    return this.getElement().querySelector(`.${ClassName.COMMENTS_LINK}`);
  }

  _getPosterElement() {
    return this.getElement().querySelector(`.${ClassName.POSTER}`);
  }

  _getTitleElement() {
    return this.getElement().querySelector(`.${ClassName.TITLE}`);
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

  _restoreListeners() {
    this.setAddToWatchlistButtonClickListener(this._callback.addToWatchlistButtonClick);
    this.setMarkAsWatchedButtonClickListener(this._callback.markAsWatchedButtonClick);
    this.setMarkAsFavoriteButtonClickListener(this._callback.markAsFavoriteButtonClick);

    this.setCommentsLinkClickListener(this._callback.commentsLinkClick);
    this.setPosterClickListener(this._callback.posterClick);
    this.setTitleClickListener(this._callback.titleClick);
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
}
