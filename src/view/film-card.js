import {
  addPluralEnding,
  createElement,
  getFormattedDuration,
  getYearFromDate,
  setActiveClass
} from '../utils.js';

const MAX_LETTERS_IN_SHORT_DESCRIPTION = 140;

const CONTROL_ACTIVE_STATE_CLASS_NAME = 'film-card__controls-item--active';

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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${setActiveClass(isOnWatchlist, CONTROL_ACTIVE_STATE_CLASS_NAME)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${setActiveClass(isWatched, CONTROL_ACTIVE_STATE_CLASS_NAME)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${setActiveClass(isFavorite, CONTROL_ACTIVE_STATE_CLASS_NAME)}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCard {
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
