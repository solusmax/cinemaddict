import AbstractFilmCardView from './abstract-film-card.js';
import he from 'he';
import {
  addPluralEnding,
  getFormattedDuration,
  humanizeCommentDate,
  humanizeFilmDate,
  isEnterEvent,
  setActiveClass
} from '../utils';

const ClassNames = {
  FORM: 'film-details__inner',
  CONTROL_ACTIVE_STATE: 'film-details__control-button--active',
  CLOSE_BUTTON: 'film-details__close-btn',
  ADD_TO_WATCHLIST_CONTROL: 'film-details__control-button--watchlist',
  MARK_AS_WATCHED_CONTROL: 'film-details__control-button--watched',
  MARK_AS_FAVORITE_CONTROL: 'film-details__control-button--favorite',
  COMMENTS_LIST: 'film-details__comments-list',
  COMMENT_DELETE_BUTTON: 'film-details__comment-delete',
  NEW_COMMENT_EMOJI_LIST: 'film-details__emoji-list',
  NEW_COMMENT_FIELD: 'film-details__comment-input',
};

const NewCommentError = {
  BORDER_STYLE: '2px red solid',
  EMOJI_MESSAGE: 'Please choose emoji.',
  TEXT_MESSAGE: 'Please enter comment text',
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
    `<li class="film-details__comment" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
          <button class="${ClassNames.COMMENT_DELETE_BUTTON}" data-comment-id="${id}">Delete</button>
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
    <form class="${ClassNames.FORM}" action="" method="get">
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

          <ul class="${ClassNames.COMMENTS_LIST}">
            ${commentsIds.map((commentId) => createCommentTemplate(comments, commentId)).join(' ')}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${createSelectedEmojiTemplate(newComment.isEmojiSelected, newComment.emoji)}
            </div>

            <label class="film-details__comment-label">
              <textarea class="${ClassNames.NEW_COMMENT_FIELD}" placeholder="Select reaction below and write comment here" name="comment">${newComment.text}</textarea>
            </label>

            <div class="${ClassNames.NEW_COMMENT_EMOJI_LIST}">
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

    this._defaultNewCommentFieldBorderStyle = this._getNewCommentFieldElement().style.border;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onNewCommentFieldInput = this._onNewCommentFieldInput.bind(this);
    this._onNewCommentEmojiListClick = this._onNewCommentEmojiListClick.bind(this);
    this._onCommentsListClick = this._onCommentsListClick.bind(this);
    this._onNewCommentFieldSubmit = this._onNewCommentFieldSubmit.bind(this);
  }

  init(film, isNewModal, comments) {
    this._comments = comments;

    const currentNewComment = !isNewModal
      ? Object.assign({}, {
        newComment: this._data.newComment,
      })
      : null;

    this._film = film;
    this.filmId = this._film.id;
    this._resetData();
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

  _resetData() {
    this._data = FullFilmCard.parseFilmToData(this._film);
  }

  _getCurrentNewCommentText () {
    return this._data.newComment.text.trim();
  }

  _getCurrentNewCommentEmoji () {
    return this._data.newComment.emoji;
  }

  _checkNewComment() {
    return this._checkNewCommentField(true) && this._checkNewCommentEmoji();
  }

  _checkNewCommentField(whetherShowError) {
    if (!this._getCurrentNewCommentText()) {
      if (whetherShowError) {
        this._showNewCommentValidationError(NewCommentError.TEXT_MESSAGE, NewCommentError.BORDER_STYLE);
      }

      return false;
    }

    if (this._hasNewCommentValidationError()) {
      this._hideNewCommentValidationError();
    }

    return true;
  }

  _checkNewCommentEmoji() {
    if (!this._getCurrentNewCommentEmoji()) {
      this._showNewCommentValidationError(NewCommentError.EMOJI_MESSAGE, NewCommentError.BORDER_STYLE);
      return false;
    }

    if (this._hasNewCommentValidationError()) {
      this._hideNewCommentValidationError();
    }

    return true;
  }

  _showNewCommentValidationError(message, borderStyle) {
    this._getNewCommentFieldElement().style.border = borderStyle;
    this._getNewCommentFieldElement().setCustomValidity(message);
    this._getNewCommentFieldElement().reportValidity();
  }

  _hideNewCommentValidationError() {
    this._showNewCommentValidationError('', this._defaultNewCommentFieldBorderStyle);
  }

  _hasNewCommentValidationError() {
    return this._getNewCommentFieldElement().validity.customError;
  }

  // Геттеры элементов ↓↓↓

  _getFormElement() {
    return this.getElement().querySelector(`.${ClassNames.FORM}`);
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

  _getCloseButtonElement() {
    return this.getElement().querySelector(`.${ClassNames.CLOSE_BUTTON}`);
  }

  _getCommentsListElement() {
    return this.getElement().querySelector(`.${ClassNames.COMMENTS_LIST}`);
  }

  _getNewCommentFieldElement() {
    return this.getElement().querySelector(`.${ClassNames.NEW_COMMENT_FIELD}`);
  }

  _getNewCommentEmojiListElement() {
    return this.getElement().querySelector(`.${ClassNames.NEW_COMMENT_EMOJI_LIST}`);
  }

  // Колбэки листенеров ↓↓↓

  _onCloseButtonClick(evt) {
    evt.preventDefault();

    this._callback.closeButtonClick();
  }

  _onCommentsListClick(evt) {
    if (!evt.target.classList.contains(ClassNames.COMMENT_DELETE_BUTTON)) {
      return;
    }

    evt.preventDefault();

    const commentId = Number(evt.target.dataset.commentId);

    this._callback.commentsListClick(commentId);
  }

  _onNewCommentFieldInput(evt) {
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

    this._checkNewCommentField(false);
  }

  _onNewCommentEmojiListClick(evt) {
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

  _onNewCommentFieldSubmit(evt) {
    if (!(evt.ctrlKey && isEnterEvent(evt))) {
      return;
    }

    evt.preventDefault();

    if (!this._checkNewComment()) {
      return;
    }

    const commentText = this._getCurrentNewCommentText();
    const commentEmoji = this._getCurrentNewCommentEmoji();

    this._resetData();

    this._callback.newCommentFieldSubmit({ commentText, commentEmoji });
  }

  // Сеттеры листенеров ↓↓↓

  setCloseButtonClickListener(cb) {
    this._callback.closeButtonClick = cb;
    this._getCloseButtonElement().addEventListener('click', this._onCloseButtonClick);
  }

  setCommentsListClickListener(cb) {
    this._callback.commentsListClick = cb;
    this._getCommentsListElement().addEventListener('click', this._onCommentsListClick);
  }

  _setNewCommentFieldInputListener() {
    this._getNewCommentFieldElement().addEventListener('input', this._onNewCommentFieldInput);
  }

  _setNewCommentEmojiListClickListener() {
    this._getNewCommentEmojiListElement().addEventListener('click', this._onNewCommentEmojiListClick);
  }

  setNewCommentFieldSubmitListener(cb) {
    this._callback.newCommentFieldSubmit = cb;
    this._getFormElement().addEventListener('keydown', this._onNewCommentFieldSubmit);
  }

  _setInnerListeners() {
    this._setNewCommentEmojiListClickListener();
    this._setNewCommentFieldInputListener();

  }

  _restoreListeners() {
    this._setInnerListeners();

    this.setCloseButtonClickListener(this._callback.closeButtonClick);
    this.setAddToWatchlistButtonClickListener(this._callback.addToWatchlistButtonClick);
    this.setMarkAsWatchedButtonClickListener(this._callback.markAsWatchedButtonClick);
    this.setMarkAsFavoriteButtonClickListener(this._callback.markAsFavoriteButtonClick);
    this.setCommentsListClickListener(this._callback.commentsListClick);
    this.setNewCommentFieldSubmitListener(this._callback.newCommentFieldSubmit);
  }

  // Удаляторы листенеров ↓↓↓

  removeCloseButtonClickListener() {
    this._getCloseButtonElement().removeEventListener('click', this._onCloseButtonClick);
  }

  removeCommentsListClickListener() {
    this._getCommentsListElement().removeEventListener('click', this._onCommentsListClick);
  }

  removeNewCommentFieldSubmitListener() {
    this._getFormElement().removeEventListener('keydown', this._onNewCommentFieldSubmit);
  }
}
