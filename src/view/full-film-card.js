import AbstractFilmCardView from './abstract-film-card';
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
  EMOJI_LIST: 'film-details__emoji-list',
  COMMENT_FIELD: 'film-details__comment-input',
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

const createSelectedEmojiTemplate = (isEmojiSelected, emoji) => isEmojiSelected ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : '';

const createEmojiTemplate = (emoji, isSelected) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isSelected ? 'checked' : ''}>
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
    newComment,
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
            <div class="film-details__add-emoji-label">
              ${createSelectedEmojiTemplate(newComment.isEmojiSelected, newComment.emoji)}
            </div>

            <label class="film-details__comment-label">
              <textarea class="${ClassNames.COMMENT_FIELD}" placeholder="Select reaction below and write comment here" name="comment">${newComment.text}</textarea>
            </label>

            <div class="${ClassNames.EMOJI_LIST}">
              ${emojis.map((emoji) => createEmojiTemplate(emoji, emoji === newComment.emoji)).join(' ')}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FullFilmCard extends AbstractFilmCardView {
  constructor(film, comments, emojis) {
    super(film);

    this._data = FullFilmCard.parseFilmToData(this._film);

    this._comments = comments;
    this._emojis = emojis;

    this._scrollPosition = 0;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onCommentFieldInput = this._onCommentFieldInput.bind(this);
    this._onEmojiListClick = this._onEmojiListClick.bind(this);
  }

  init(film) {
    const isFilmNew = film.id !== this.filmId;
    const currentNewComment = !isFilmNew
      ? Object.assign({}, {
        newComment: this._data.newComment,
      })
      : null;

    this._film = film;
    this.filmId = this._film.id;
    this._data = FullFilmCard.parseFilmToData(this._film);
    this._updateData(currentNewComment, false);

    this._setInnerListeners();
  }

  _getTemplate() {
    return createFullFilmCardTemplate(this._data, this._comments, this._emojis);
  }

  isElementRendered() {
    return Boolean(this._element);
  }

  saveScrollPosition() {
    this._scrollPosition = this.getElement().scrollTop;
  }

  restoreScrollPosition() {
    this.getElement().scrollTop = this._scrollPosition;
  }

  updateElement() {
    this.saveScrollPosition();
    super.updateElement();
    this.restoreScrollPosition();
  }

  // Геттеры элементов ↓↓↓

  _getAddToWatchlistButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.ADD_TO_WATCHLIST_CONTROL}`);
  }

  _getMarkAsWatchedButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.MARK_AS_WATCHED_CONTROL}`);
  }

  _getMarkAsFavoriteButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.MARK_AS_FAVORITE_CONTROL}`);
  }

  _getCloseButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.CLOSE_BUTTON}`);
  }

  _getCommentFieldElement() {
    return this.getElement().querySelector(`.${ClassNames.COMMENT_FIELD}`);
  }

  _getEmojiListElement() {
    return this.getElement().querySelector(`.${ClassNames.EMOJI_LIST}`);
  }

  // Колбэки листенеров ↓↓↓

  _onCloseButtonClick(evt) {
    evt.preventDefault();

    this._callback.closeButtonClick();
  }

  _onCommentFieldInput(evt) {
    evt.preventDefault();

    this._updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          text: evt.target.value,
        },
      ),
    }, false);
  }

  _onEmojiListClick(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    const selectedEmoji = evt.target.value;

    if (selectedEmoji === this._data.newComment.emoji) {
      return;
    }

    if (!this._data.newComment.isEmojiSelected) {
      this._updateData({
        newComment: Object.assign(
          {},
          this._data.newComment,
          {
            isEmojiSelected: true,
          },
        ),
      }, false);
    }

    this._updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          emoji: selectedEmoji,
        },
      ),
    }, true);
  }

  // Сеттеры листенеров ↓↓↓

  setCloseButtonClickListener(cb) {
    this._callback.closeButtonClick = cb;
    this._getCloseButtonElement().addEventListener('click', this._onCloseButtonClick);
  }

  _setCommentFieldInputListener() {
    this._getCommentFieldElement().addEventListener('input', this._onCommentFieldInput);
  }

  _setEmojiListClickListener() {
    this._getEmojiListElement().addEventListener('click', this._onEmojiListClick);
  }

  // Удаляторы листенеров ↓↓↓

  removeCloseButtonClickListener() {
    this._getCloseButtonElement().removeEventListener('click', this._onCloseButtonClick);
  }

  // =========================

  _setInnerListeners() {
    this._setEmojiListClickListener();
    this._setCommentFieldInputListener();
  }

  _restoreListeners() {
    this._setInnerListeners();

    this.setAddToWatchlistButtonClickListener(this._callback.addToWatchlistButtonClick);
    this.setMarkAsWatchedButtonClickListener(this._callback.markAsWatchedButtonClick);
    this.setMarkAsFavoriteButtonClickListener(this._callback.markAsFavoriteButtonClick);
    this.setCloseButtonClickListener(this._callback.closeButtonClick);
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        newComment: {
          text: '',
          isEmojiSelected: false,
          emoji: '',
        },
      },
    );
  }

  static parseDataToFilm(data) {
    const currentData = Object.assign(
      {},
      data,
    );

    delete currentData.newComment;

    return currentData;
  }
}
