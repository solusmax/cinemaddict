import AbstractView from './abstract';
import {
  addPluralEnding,
  getFormattedDuration,
  humanizeCommentDate,
  humanizeFilmDate,
  setActiveClass
} from '../utils';

const ClassNames = {
  CONTROL_ACTIVE_STATE: 'film-details__control-button--active',
  CLOSE_BUTTON: 'film-details__close-btn',
  ADD_TO_WATCHLIST_CONTROL: 'film-details__control-button--watchlist',
  MARK_AS_WATCHED_CONTROL: 'film-details__control-button--watched',
  MARK_AS_FAVORITE_CONTROL: 'film-details__control-button--favorite',
};

const createCommentTemplate = (comments, id) => {
  const currentComment = comments.find((comment) => comment.id === id);

  const {
    text,
    emoji,
    author,
    date,
  } = currentComment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createEmojiTemplate = (emoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createFullFilmCardTemplate = (film, comments, emojis) => {
  const {
    comments: commentsIds,
    info: {
      poster,
      title,
      originalTitle,
      rating,
      director,
      screenwriters,
      actors,
      releaseDate,
      duration,
      releaseCountry,
      genres,
      description,
      ageRating,
    },
    userMeta: {
      isWatched,
      isFavorite,
      isOnWatchlist,
    },
  } = film;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="${ClassNames.CLOSE_BUTTON}" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${screenwriters.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${humanizeFilmDate(releaseDate)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getFormattedDuration(duration)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genre${addPluralEnding(genres.length)}</td>
                <td class="film-details__cell">${genres.map((genre) => createGenreTemplate(genre)).join(' ')}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${ClassNames.ADD_TO_WATCHLIST_CONTROL} ${setActiveClass(isOnWatchlist, ClassNames.CONTROL_ACTIVE_STATE)}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${ClassNames.MARK_AS_WATCHED_CONTROL} ${setActiveClass(isWatched, ClassNames.CONTROL_ACTIVE_STATE)}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${ClassNames.MARK_AS_FAVORITE_CONTROL} ${setActiveClass(isFavorite, ClassNames.CONTROL_ACTIVE_STATE)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsIds.length}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsIds.map((commentId) => createCommentTemplate(comments, commentId)).join(' ')}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emojis.map((emoji) => createEmojiTemplate(emoji)).join(' ')}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FullFilmCard extends AbstractView {
  constructor(film, comments, emojis) {
    super();

    this._film = film;
    this._filmId = this._film.id;
    this._comments = comments;
    this._emojis = emojis;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onAddToWatchlistButtonClick = this._onAddToWatchlistButtonClick.bind(this);
    this._onMarkAsWatchedButtonClick = this._onMarkAsWatchedButtonClick.bind(this);
    this._onMarkAsFavoriteButtonClick = this._onMarkAsFavoriteButtonClick.bind(this);
  }

  _getTemplate() {
    return createFullFilmCardTemplate(this._film, this._comments, this._emojis);
  }

  setFilm(newFilm) {
    this._film = newFilm;
    this._filmId = this._film.id;
  }

  isElementRendered() {
    return Boolean(this._element);
  }

  getFilmId() {
    return this._filmId;
  }

  // Геттеры элементов ↓↓↓

  _getCloseButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.CLOSE_BUTTON}`);
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

  // Колбэки для листенеров ↓↓↓

  _onCloseButtonClick(evt) {
    evt.preventDefault();

    this._callback.closeButtonClick();
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

  setCloseButtonClickListener(cb) {
    this._callback.closeButtonClick = cb;
    this._getCloseButtonElement().addEventListener('click', this._onCloseButtonClick);
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

  removeCloseButtonClickListener() {
    this._getCloseButtonElement().removeEventListener('click', this._onCloseButtonClick);
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
