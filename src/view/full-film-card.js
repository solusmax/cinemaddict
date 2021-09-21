import he from 'he';
import AbstractFilmCardView from './abstract-film-card.js';
import {
  getActivityClass,
  getFormattedDuration,
  getHumanizedCommentDate,
  getHumanizedFilmDate,
  getPluralEnding,
  isEnterEvent
} from '../utils';
import {
  EMOJIS,
  FilmCardStateType,
  NotificationMessage,
  ViewStateValue
} from '../constants.js';

const SHAKE_ANIMATION_DURATION = 600;

const NEW_COMMENT_ERROR_BORDER_STYLE = '2px red solid';

const COMMENTS_LOADING_TEXT = 'Loading...';

const ClassName = {
  MAIN: 'film-details',
  FORM: 'film-details__inner',
  CONTROL_ACTIVE_STATE: 'film-details__control-button--active',
  CLOSE_BUTTON: 'film-details__close-btn',
  ADD_TO_WATCHLIST_CONTROL: 'film-details__control-button--watchlist',
  MARK_AS_WATCHED_CONTROL: 'film-details__control-button--watched',
  MARK_AS_FAVORITE_CONTROL: 'film-details__control-button--favorite',
  COMMENTS_LIST: 'film-details__comments-list',
  COMMENT: 'film-details__comment',
  COMMENT_DELETE_BUTTON: 'film-details__comment-delete',
  NEW_COMMENT_FORM: 'film-details__new-comment',
  NEW_COMMENT_SELECTED_EMOJI_DISABLED_STATE: 'film-details__add-emoji-label--disabled',
  NEW_COMMENT_EMOJI_LIST: 'film-details__emoji-list',
  NEW_COMMENT_FIELD: 'film-details__comment-input',
};

const NewCommentStateType = {
  EMOJI: 'emoji',
  IS_EMOJI_SELECTED: 'isEmojiSelected',
  TEXT: 'text',
};

const NewCommentErrorText = {
  EMOJI: 'Please choose emoji.',
  TEXT: 'Please enter comment text.',
};

const CommentDeleteButtonText = {
  DELETING: 'Deleting...',
  DELETE: 'Delete',
};

const createCommentTemplate = (comments, id, commentsToDeleteIds) => {
  const currentComment = comments.find((comment) => comment.id === id);

  const {
    text,
    emoji,
    author,
    date,
  } = currentComment;

  const isDeleting = commentsToDeleteIds.has(id);

  return (
    `<li class="${ClassName.COMMENT}" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getHumanizedCommentDate(date)}</span>
          <button class="${ClassName.COMMENT_DELETE_BUTTON}" data-comment-id="${id}" ${isDeleting ? 'disabled' : ''}>${isDeleting ? CommentDeleteButtonText.DELETING : CommentDeleteButtonText.DELETE}</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsTemplate = (comments, commentsIds, commentsLoadingState, commentsToDeleteIds) => {
  switch (commentsLoadingState) {
    case ViewStateValue.NO_PROCESSING:
      return `<ul class="${ClassName.COMMENTS_LIST}">
          ${commentsIds.map((commentId) => createCommentTemplate(comments, commentId, commentsToDeleteIds)).join(' ')}
        </ul>`;
    case ViewStateValue.PROCESSING:
      return `<ul class="${ClassName.COMMENTS_LIST}">${COMMENTS_LOADING_TEXT}</ul>`;
    case ViewStateValue.ERROR:
      return `<ul class="${ClassName.COMMENTS_LIST}">${NotificationMessage.ERROR_COMMENTS_LOADING}</ul>`;
  }
};

const createSelectedEmojiTemplate = (isSelected, emoji) => isSelected ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : '';

const createEmojiTemplate = (emoji, isSelected, isDisabled) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createNewCommentTemplate = (newComment, commentAddingState) => {
  const {
    [NewCommentStateType.EMOJI]: selectedEmoji,
    [NewCommentStateType.IS_EMOJI_SELECTED]: isEmojiSelected,
    [NewCommentStateType.TEXT]: text,
  } = newComment;

  const isAdding = commentAddingState === ViewStateValue.PROCESSING;

  return `<div class="${ClassName.NEW_COMMENT_FORM}">
    <div class="film-details__add-emoji-label ${isAdding ? ClassName.NEW_COMMENT_SELECTED_EMOJI_DISABLED_STATE : ''}">
      ${createSelectedEmojiTemplate(isEmojiSelected, selectedEmoji)}
    </div>

    <label class="film-details__comment-label">
      <textarea class="${ClassName.NEW_COMMENT_FIELD}" placeholder="Select reaction below and write comment here" name="comment" ${isAdding ? 'disabled' : ''}>${text}</textarea>
    </label>

    <div class="${ClassName.NEW_COMMENT_EMOJI_LIST}">
      ${EMOJIS.map((emoji) => createEmojiTemplate(emoji, emoji === selectedEmoji, isAdding)).join(' ')}
    </div>
  </div>`;
};

const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createFullFilmCardTemplate = (data, comments, updatingUserMetaFilmsIds) => {
  const {
    id,
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
    viewState: {
      [FilmCardStateType.COMMENTS_LOADING]: commentsLoadingState,
      [FilmCardStateType.COMMENT_ADDING]: commentAddingState,
      [FilmCardStateType.COMMENTS_TO_DELETE_IDS]: commentsToDeleteIds,
    },
  } = data;

  const hasUserMetaUpdating = updatingUserMetaFilmsIds.has(id);

  return `<section class="${ClassName.MAIN}">
    <form class="${ClassName.FORM}" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="${ClassName.CLOSE_BUTTON}" type="button">close</button>
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
                <td class="film-details__cell">${getHumanizedFilmDate(releaseDate)}</td>
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
                <td class="film-details__term">Genre${getPluralEnding(genres.length)}</td>
                <td class="film-details__cell">${genres.map((genre) => createGenreTemplate(genre)).join(' ')}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${ClassName.ADD_TO_WATCHLIST_CONTROL} ${getActivityClass(isOnWatchlist, ClassName.CONTROL_ACTIVE_STATE)}" id="watchlist" name="watchlist" ${hasUserMetaUpdating ? 'disabled' : ''}>Add to watchlist</button>
          <button type="button" class="film-details__control-button ${ClassName.MARK_AS_WATCHED_CONTROL} ${getActivityClass(isWatched, ClassName.CONTROL_ACTIVE_STATE)}" id="watched" name="watched" ${hasUserMetaUpdating ? 'disabled' : ''}>Already watched</button>
          <button type="button" class="film-details__control-button ${ClassName.MARK_AS_FAVORITE_CONTROL} ${getActivityClass(isFavorite, ClassName.CONTROL_ACTIVE_STATE)}" id="favorite" name="favorite" ${hasUserMetaUpdating ? 'disabled' : ''}>Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsIds.length}</span></h3>

          ${createCommentsTemplate(comments, commentsIds, commentsLoadingState, commentsToDeleteIds)}

          ${createNewCommentTemplate(newComment, commentAddingState)}
        </section>
      </div>
    </form>
  </section>`;
};

export default class FullFilmCard extends AbstractFilmCardView {
  constructor(film, comments, updatingUserMetaFilmsIds) {
    super(film, updatingUserMetaFilmsIds);

    this._data = this._getDefaultData();
    this._comments = comments;
    this._scrollPosition = 0;
    this._defaultNewCommentFieldBorderStyle = this._getNewCommentFieldElement().style.border;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onNewCommentFieldInput = this._onNewCommentFieldInput.bind(this);
    this._onNewCommentEmojiListClick = this._onNewCommentEmojiListClick.bind(this);
    this._onCommentsListClick = this._onCommentsListClick.bind(this);
    this._onNewCommentFieldSubmit = this._onNewCommentFieldSubmit.bind(this);
  }

  init(film, isNewModal, comments) {
    if (comments) {
      this._comments = comments;
    }

    this._film = film;
    this.filmId = this._film.id;
    this._resetFilmData();

    if (isNewModal) {
      this.resetNewCommentData();
      this._resetViewStateData(false, [
        FilmCardStateType.COMMENT_ADDING,
        FilmCardStateType.COMMENTS_TO_DELETE_IDS,
      ]);
    }

    this._setInnerListeners();
  }

  _getTemplate() {
    return createFullFilmCardTemplate(this._data, this._comments, this._updatingUserMetaFilmsIds);
  }

  isElementRendered() {
    return Boolean(document.querySelector(`.${ClassName.MAIN}`));
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

  _shake(element) {
    if (!element) {
      return;
    }

    element.style.animation = `shake ${SHAKE_ANIMATION_DURATION / 1000}s`;

    setTimeout(() => {
      element.style.animation = '';
    }, SHAKE_ANIMATION_DURATION);
  }

  shakeNewCommentForm() {
    this._shake(this._getNewCommentFormElement());
  }

  shakeComment(commentId) {
    this._shake(this._getCommentElement(commentId));
  }

  _getDefaultData() {
    return Object.assign(
      {},
      this._film,
      {
        newComment: Object.assign({}, this._getDefaultNewCommentStructure()),
        viewState: Object.assign({}, this._getDefaultViewStateStructure()),
      },
    );
  }

  _getDefaultNewCommentStructure() {
    return {
      [NewCommentStateType.TEXT]: '',
      [NewCommentStateType.IS_EMOJI_SELECTED]: false,
      [NewCommentStateType.EMOJI]: '',
    };
  }

  _getDefaultViewStateStructure() {
    return {
      [FilmCardStateType.COMMENTS_LOADING]: ViewStateValue.PROCESSING,
      [FilmCardStateType.COMMENT_ADDING]: ViewStateValue.NO_PROCESSING,
      [FilmCardStateType.COMMENTS_TO_DELETE_IDS]: new Set(),
    };
  }

  setViewState(stateType, updatedState, isElementUpdating, options = {}) {
    if (options.comments) {
      this._comments = options.comments;
    }

    if (options.commentToDeleteId) {
      this._data.viewState[FilmCardStateType.COMMENTS_TO_DELETE_IDS].add(options.commentToDeleteId);
    }

    const newData = stateType && updatedState
      ? {
        viewState: Object.assign(
          {},
          this._data.viewState,
          {
            [stateType]: updatedState,
          },
        ),
      }
      : {};

    this._updateData(newData, isElementUpdating);
  }

  removeIdFromCommentsToDeleteState(commentId) {
    this._data.viewState[FilmCardStateType.COMMENTS_TO_DELETE_IDS].delete(commentId);
  }

  _setNewCommentState(stateType, updatedState, isElementUpdating) {
    const newData = {
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          [stateType]: updatedState,
        },
      ),
    };

    this._updateData(newData, isElementUpdating);
  }

  _resetFilmData(isElementUpdating) {
    const defaultData = Object.assign({}, this._film);

    this._updateData(defaultData, isElementUpdating);
  }

  resetNewCommentData(isElementUpdating) {
    const defaultData = {
      newComment: this._getDefaultNewCommentStructure(),
    };

    this._updateData(defaultData, isElementUpdating);
  }

  _resetViewStateData(isElementUpdating, excludedFromResetStateTypes = []) {
    const defaultData = {
      viewState: this._getDefaultViewStateStructure(),
    };

    excludedFromResetStateTypes.forEach((stateType) => {
      defaultData.viewState[stateType] = this._data.viewState[stateType];
    });

    this._updateData(defaultData, isElementUpdating);
  }

  _getCurrentNewCommentData() {
    return {
      newComment: Object.assign(
        {},
        this._data.newComment,
      ),
    };
  }

  _getCurrentNewCommentText() {
    return this._data.newComment[NewCommentStateType.TEXT].trim();
  }

  _getCurrentNewCommentEmoji() {
    return this._data.newComment[NewCommentStateType.EMOJI];
  }

  _checkNewComment() {
    return this._checkNewCommentField(true) && this._checkNewCommentEmoji();
  }

  _checkNewCommentField(whetherShowError) {
    if (!this._getCurrentNewCommentText()) {
      if (whetherShowError) {
        this._showNewCommentValidationError(NewCommentErrorText.TEXT, NEW_COMMENT_ERROR_BORDER_STYLE);
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
      this._showNewCommentValidationError(NewCommentErrorText.EMOJI, NEW_COMMENT_ERROR_BORDER_STYLE);
      return false;
    }

    if (this._hasNewCommentValidationError()) {
      this._hideNewCommentValidationError();
    }

    return true;
  }

  _showNewCommentValidationError(message, borderStyle) {
    const newCommentFieldElement = this._getNewCommentFieldElement();

    newCommentFieldElement.style.border = borderStyle;
    newCommentFieldElement.setCustomValidity(message);
    newCommentFieldElement.reportValidity();
  }

  _hideNewCommentValidationError() {
    this._showNewCommentValidationError('', this._defaultNewCommentFieldBorderStyle);
  }

  _hasNewCommentValidationError() {
    return this._getNewCommentFieldElement().validity.customError;
  }

  // Геттеры элементов ↓↓↓

  _getFormElement() {
    return this.getElement().querySelector(`.${ClassName.FORM}`);
  }

  _getAddToWatchlistButtonElement() {
    return this.getElement().querySelector(`.${ClassName.ADD_TO_WATCHLIST_CONTROL}`);
  }

  _getMarkAsWatchedButtonElement() {
    return this.getElement().querySelector(`.${ClassName.MARK_AS_WATCHED_CONTROL}`);
  }

  _getMarkAsFavoriteButtonElement() {
    return this.getElement().querySelector(`.${ClassName.MARK_AS_FAVORITE_CONTROL}`);
  }

  _getCloseButtonElement() {
    return this.getElement().querySelector(`.${ClassName.CLOSE_BUTTON}`);
  }

  _getCommentsListElement() {
    return this.getElement().querySelector(`.${ClassName.COMMENTS_LIST}`);
  }

  _getCommentElement(commentId) {
    return this.getElement().querySelector(`.${ClassName.COMMENT}[data-comment-id="${commentId}"]`);
  }

  _getNewCommentFormElement() {
    return this.getElement().querySelector(`.${ClassName.NEW_COMMENT_FORM}`);
  }

  _getNewCommentFieldElement() {
    return this.getElement().querySelector(`.${ClassName.NEW_COMMENT_FIELD}`);
  }

  _getNewCommentEmojiListElement() {
    return this.getElement().querySelector(`.${ClassName.NEW_COMMENT_EMOJI_LIST}`);
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

  // Колбэки листенеров ↓↓↓

  _onCloseButtonClick(evt) {
    evt.preventDefault();

    this._callback.closeButtonClick();
  }

  _onCommentsListClick(evt) {
    if (!evt.target.classList.contains(ClassName.COMMENT_DELETE_BUTTON)) {
      return;
    }

    evt.preventDefault();

    const commentId = Number(evt.target.dataset.commentId);

    this._callback.commentsListClick(commentId);
  }

  _onNewCommentFieldInput(evt) {
    evt.preventDefault();

    this._setNewCommentState(NewCommentStateType.TEXT, evt.target.value, false);

    this._checkNewCommentField(false);
  }

  _onNewCommentEmojiListClick(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    if (this._data.viewState[FilmCardStateType.COMMENT_ADDING] === ViewStateValue.PROCESSING) {
      return;
    }

    const selectedEmoji = evt.target.value;

    if (selectedEmoji === this._data.newComment[NewCommentStateType.EMOJI]) {
      return;
    }

    if (!this._data.newComment[NewCommentStateType.IS_EMOJI_SELECTED]) {
      this._setNewCommentState(NewCommentStateType.IS_EMOJI_SELECTED, true, false);
    }

    this._setNewCommentState(NewCommentStateType.EMOJI, selectedEmoji, true);
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

    this._callback.newCommentFieldSubmit({ text: commentText, emoji: commentEmoji });
  }
}
