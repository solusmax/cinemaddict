import FilmCardView from '../view/film-card.js';
import FilmsListView from '../view/films-list.js';
import FullFilmCardView from '../view/full-film-card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortMenuView from '../view/sort-menu.js';
import NotificationPresenter from './notification.js';
import {
  filter,
  getCurrentDate,
  getFilmsSortedByComments,
  getFilmsSortedByDate,
  getFilmsSortedByRating,
  isEscEvent,
  isOnline,
  removeElement,
  renderElement,
  RenderPosition,
  replaceElement
} from '../utils';
import {
  FilmCardStateType,
  FilmsListType,
  FilterType,
  MainFilmsListTitleText,
  NotificationMessage,
  NotificationType,
  SortMethod,
  UpdateType,
  UserAction,
  ViewStateValue
} from '../constants.js';

const BODY_NO_SCROLL_CLASS_NAME = 'hide-overflow';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const FullFilmCardRenderUpdateType = {
  NO_UPDATE: 'NO_UPDATE',
  UPDATE: 'UPDATE',
  NEW: 'NEW',
};

export default class FilmsList {
  constructor(containerElement, filmsModel, commentsModel, filtersModel, api) {
    this._containerElement = containerElement;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filtersModel = filtersModel;

    this._component = this._createComponent();
    this._showMoreButtonComponent = null;
    this._sortMenuComponent = new SortMenuView();
    this._fullFilmCardComponent = null;

    this._api = api;

    this._isLoading = true;
    this._currentSortMethod = SortMethod.DEFAULT;
    this._currentFilterType = this._filtersModel.getCurrentFilter();
    this._renderedMainFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._renderedFilmCardComponents = [];
    this._updatingUserMetaFilmsIds = new Set();
    this._isFullFilmCardChanged = false;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortMethodClick = this._handleSortMethodClick.bind(this);
    this._onFullFilmCardEscKeydown = this._onFullFilmCardEscKeydown.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    renderElement(this._containerElement, this._component);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._updateCurrentFilterType();

    this._renderMainFilmCards();

    if (this._getAllFilmsCount() > 0) {
      this._renderExtraFilmsLists();
    }
  }

  destroy() {
    this._removeMainFilmCards();
    this._removeExtraFilmCards();
    this._removeExtraFilmLists([FilmsListType.TOP_RATED, FilmsListType.MOST_COMMENTED]);
    this._resetSortMethod();
    this._removeSortMenu();
    this._removeFullFilmCard();
    removeElement(this._component);
  }

  _createComponent() {
    return new FilmsListView(this._getCurrentFilms().length);
  }

  _getAllFilms() {
    return this._filmsModel.getFilms();
  }

  _getAllFilmsCount() {
    return this._getAllFilms().length;
  }

  _getCurrentFilms() {
    const films = this._getAllFilms();
    this._updateCurrentFilterType();
    const filteredFilms = filter[this._currentFilterType](films);

    switch(this._currentSortMethod) {
      case SortMethod.DATE:
        return getFilmsSortedByDate(filteredFilms);
      case SortMethod.RATING:
        return getFilmsSortedByRating(filteredFilms);
    }

    return filteredFilms;
  }

  _getCurrentFilmsCount() {
    return this._getCurrentFilms().length;
  }

  _updateFilm(film) {
    const updatedFilmCardComponents = [];

    for (let i = 0; i < this._renderedFilmCardComponents.length; i++) {
      if (this._renderedFilmCardComponents[i].filmId === film.id) {
        const previousFilmCardComponent = this._renderedFilmCardComponents[i];

        const newFilmCardComponent = new FilmCardView(film, this._updatingUserMetaFilmsIds);
        this._setFilmCardComponentListeners(newFilmCardComponent, film);

        this._removeFilmCardComponentListeners(previousFilmCardComponent);
        replaceElement(newFilmCardComponent, previousFilmCardComponent);
        removeElement(previousFilmCardComponent);
        this._renderedFilmCardComponents.splice(i--, 1);

        updatedFilmCardComponents.push(newFilmCardComponent);
      }
    }

    this._renderedFilmCardComponents = [...this._renderedFilmCardComponents, ...updatedFilmCardComponents];

    if (this._fullFilmCardComponent && this._fullFilmCardComponent.isElementRendered()) {
      this._renderFullFilmCard(film, false);
    }
  }

  _updateCurrentFilterType() {
    this._currentFilterType = this._filtersModel.getCurrentFilter();
  }

  // Карточка фильма ↓↓↓

  _renderFilmCard(container, film) {
    const filmCardComponent = new FilmCardView(film, this._updatingUserMetaFilmsIds);
    this._setFilmCardComponentListeners(filmCardComponent, film);

    renderElement(container, filmCardComponent);
    this._renderedFilmCardComponents.push(filmCardComponent);
  }

  _updateFilmCards(filmId) {
    this._renderedFilmCardComponents.forEach((filmCardComponent) => {
      if (filmCardComponent.filmId === filmId) {
        filmCardComponent.updateElement();
      }
    });
  }

  _clearLists(listTypes) {
    this._renderedFilmCardComponents = this._renderedFilmCardComponents
      .map((filmCardComponent) => {
        if (this._isFilmCardInLists(filmCardComponent, listTypes)) {
          this._removeFilmCardComponentListeners(filmCardComponent);
          removeElement(filmCardComponent);
          return null;
        }

        return filmCardComponent;
      })
      .filter((element) => element);
  }

  _isFilmCardInLists(component, listTypes) {
    const filmCardListType = component.getListType();

    for (const listType of listTypes) {
      if (listType === filmCardListType) {
        return true;
      }
    }
  }

  // Главный список фильмов ↓↓↓

  _renderMainFilmCards() {
    const films = this._getCurrentFilms();
    const currentFilmsCount = films.length;

    if (currentFilmsCount === 0) {
      this._renderNoFilms();
      this._removeSortMenu();
      return;
    }

    if (this._component.isMainFilmsListTitleTextShown()) {
      this._component.setMainFilmsListTitleText(MainFilmsListTitleText.DEFAULT);
      this._component.hideMainFilmsListTitleText();
    }

    films
      .slice(0, Math.min(currentFilmsCount, this._renderedMainFilmCardsCount))
      .forEach((film) => this._renderFilmCard(this._component.getMainListInnerContainerElement(), film));

    if (currentFilmsCount > this._renderedMainFilmCardsCount) {
      this._renderShowMoreButton();
    }

    if (!this._sortMenuComponent.isElementRendered()) {
      this._renderSortMenu();
    }
  }

  _removeMainFilmCards(resetRenderedMainFilmCardsCount = true) {
    const currentFilmsCount = this._getCurrentFilmsCount();

    this._clearLists([FilmsListType.MAIN]);

    if (this._showMoreButtonComponent && this._showMoreButtonComponent.isElementRendered()) {
      this._showMoreButtonComponent.removeClickListener();
      removeElement(this._showMoreButtonComponent);
    }

    this._renderedMainFilmCardsCount = resetRenderedMainFilmCardsCount
      ? FILMS_COUNT_PER_STEP
      : Math.ceil(Math.min(this._renderedMainFilmCardsCount, currentFilmsCount) / FILMS_COUNT_PER_STEP) * FILMS_COUNT_PER_STEP;
  }

  _setFilmCardComponentListeners(filmCardComponent, film) {
    filmCardComponent.setTitleClickListener(this._handleOpenFullFilmCardClick.bind(this, film));
    filmCardComponent.setPosterClickListener(this._handleOpenFullFilmCardClick.bind(this, film));
    filmCardComponent.setCommentsLinkClickListener(this._handleOpenFullFilmCardClick.bind(this, film));

    filmCardComponent.setAddToWatchlistButtonClickListener(this._handleAddToWatchlishButtonClick.bind(this, film));
    filmCardComponent.setMarkAsWatchedButtonClickListener(this._handleMarkAsWatchedButtonClick.bind(this, film));
    filmCardComponent.setMarkAsFavoriteButtonClickListener(this._handleMarkAsFavoriteButtonClick.bind(this, film));
  }

  _removeFilmCardComponentListeners(filmCardComponent) {
    filmCardComponent.removeCommentsLinkClickListener();
    filmCardComponent.removePosterClickListener();
    filmCardComponent.removeTitleClickListener();

    filmCardComponent.removeAddToWatchlistButtonClickListener();
    filmCardComponent.removeMarkAsWatchedButtonClickListener();
    filmCardComponent.removeMarkAsFavoriteButtonClickListener();
  }

  _renderNoFilms() {
    this._component.setMainFilmsListTitleText(MainFilmsListTitleText[this._currentFilterType]);
    this._component.showMainFilmsListTitleText();
  }

  _renderLoading() {
    this._component.setMainFilmsListTitleText(MainFilmsListTitleText.LOADING);
    this._component.showMainFilmsListTitleText();
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickListener(this._handleShowMoreButtonClick);
    renderElement(this._component.getMainListElement(), this._showMoreButtonComponent);
  }

  // Меню сортировки ↓↓↓

  _renderSortMenu() {
    this._sortMenuComponent.setSortButtonClickListener(this._handleSortMethodClick);
    renderElement(this._component, this._sortMenuComponent, RenderPosition.BEFOREBEGIN);
  }

  _removeSortMenu() {
    if (this._sortMenuComponent.isElementRendered()) {
      this._sortMenuComponent.removeSortButtonClickListener();
      removeElement(this._sortMenuComponent);
    }
  }

  _resetSortMethod() {
    if (this._currentSortMethod !== SortMethod.DEFAULT) {
      this._currentSortMethod = SortMethod.DEFAULT;
      this._sortMenuComponent.setDefaultSortMethod();
    }
  }

  // Экстра-списки ↓↓↓

  _renderExtraFilmsLists() {
    this._updateCurrentFilterType();

    if (!this._currentFilterType) {
      return;
    }

    if (this._filmsModel.hasNonZeroRating()) {
      this._renderExtraFilmsList(FilmsListType.TOP_RATED, getFilmsSortedByRating(this._getAllFilms()));
    } else {
      this._removeExtraFilmLists([FilmsListType.TOP_RATED]);
    }

    if (this._filmsModel.hasComments()) {
      this._renderExtraFilmsList(FilmsListType.MOST_COMMENTED, getFilmsSortedByComments(this._getAllFilms()));
    } else {
      this._removeExtraFilmLists([FilmsListType.MOST_COMMENTED]);
    }
  }

  _renderExtraFilmsList(listType, films) {
    if (!this._component.isExtraListRendered(listType)) {
      renderElement(this._component, this._component.getExtraListElement(listType));
    }

    this._renderExtraFilmCards(films, this._component.getExtraListInnerContainerElement(listType));
  }

  _removeExtraFilmLists(listTypes) {
    for (const listType of listTypes) {
      this._component.removeExtraListElement(listType);
    }
  }

  _renderExtraFilmCards(films, container) {
    return films
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(container, film));
  }

  _removeExtraFilmCards() {
    this._clearLists([FilmsListType.TOP_RATED, FilmsListType.MOST_COMMENTED]);
  }

  // Модалка ↓↓↓

  _renderFullFilmCard(film, isNewModal) {
    if (!this._fullFilmCardComponent) {
      this._fullFilmCardComponent = new FullFilmCardView(film, this._commentsModel.comments, this._updatingUserMetaFilmsIds);
    }

    if (!isNewModal) {
      if (film.id !== this._getCurrentFullFilmCardId()) {
        return;
      }

      this._fullFilmCardComponent.saveScrollPosition();
    }

    if (this._fullFilmCardComponent.isElementRendered()) {
      this._removeFullFilmCard();
    }

    this._fullFilmCardComponent.init(film, isNewModal, this._commentsModel.comments);

    this._fullFilmCardComponent.setAddToWatchlistButtonClickListener(this._handleAddToWatchlishButtonClick.bind(this, film));
    this._fullFilmCardComponent.setMarkAsWatchedButtonClickListener(this._handleMarkAsWatchedButtonClick.bind(this, film));
    this._fullFilmCardComponent.setMarkAsFavoriteButtonClickListener(this._handleMarkAsFavoriteButtonClick.bind(this, film));

    this._fullFilmCardComponent.setCommentsListClickListener(this._handleCommentDeleteButtonClick.bind(this, film));
    this._fullFilmCardComponent.setNewCommentFieldSubmitListener(this._handleNewCommentFieldSubmit.bind(this, film));

    this._fullFilmCardComponent.setCloseButtonClickListener(this._removeFullFilmCard.bind(this));
    window.addEventListener('keydown', this._onFullFilmCardEscKeydown);

    renderElement(document.body, this._fullFilmCardComponent);

    document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);

    if (!isNewModal) {
      this._fullFilmCardComponent.restoreScrollPosition();
    }
  }

  _removeFullFilmCard() {
    if (!this._fullFilmCardComponent || !this._fullFilmCardComponent.isElementRendered()) {
      return;
    }

    this._fullFilmCardComponent.removeAddToWatchlistButtonClickListener();
    this._fullFilmCardComponent.removeMarkAsWatchedButtonClickListener();
    this._fullFilmCardComponent.removeMarkAsFavoriteButtonClickListener();

    this._fullFilmCardComponent.removeCloseButtonClickListener();
    window.removeEventListener('keydown', this._onFullFilmCardEscKeydown);

    this._fullFilmCardComponent.removeCommentsListClickListener();

    this._fullFilmCardComponent.removeNewCommentFieldSubmitListener();

    removeElement(this._fullFilmCardComponent);

    document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
  }

  _getCurrentFullFilmCardId() {
    return this._fullFilmCardComponent && this._fullFilmCardComponent.isElementRendered()
      ? this._fullFilmCardComponent.filmId
      : null;
  }

  _updateFullFilmCardState(stateType, updatedState, renderUpdateType, options) {
    if (!this._fullFilmCardComponent) {
      return;
    }

    switch (renderUpdateType) {
      case FullFilmCardRenderUpdateType.NO_UPDATE:
        this._fullFilmCardComponent.setViewState(stateType, updatedState, false, options);
        break;
      case FullFilmCardRenderUpdateType.UPDATE:
        this._fullFilmCardComponent.setViewState(stateType, updatedState, true, options);
        break;
      case FullFilmCardRenderUpdateType.NEW:
        this._fullFilmCardComponent.setViewState(stateType, updatedState, false, options);
        this._renderFullFilmCard(options.film, true);
    }
  }

  // Хэндлы и колбэки ↓↓↓

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._updatingUserMetaFilmsIds.add(update.id);
        this._updateFilmCards(update.id);
        this._updateFullFilmCardState(null, null, FullFilmCardRenderUpdateType.UPDATE);

        this._api.updateFilm(update)
          .then((film) => {
            let latestUpdateType;
            this._updateCurrentFilterType();

            switch (this._currentFilterType) {
              case null:
                latestUpdateType = null;
                break;
              case updateType:
                latestUpdateType = UpdateType.FILM_AND_FILMS_LIST;
                break;
              default:
                latestUpdateType = UpdateType.FILM;
            }

            this._updatingUserMetaFilmsIds.delete(film.id);
            this._filmsModel.updateFilm(latestUpdateType, film);
          })
          .catch(() => {
            this._updatingUserMetaFilmsIds.delete(update.id);
            this._updateFilmCards(update.id);
            this._updateFullFilmCardState(null, null, FullFilmCardRenderUpdateType.UPDATE);
            NotificationPresenter.renderNotification(NotificationMessage.ERROR_FILM_UPDATING);
          });
        break;

      case UserAction.ADD_COMMENT:
        this._updateFullFilmCardState(FilmCardStateType.COMMENT_ADDING, ViewStateValue.PROCESSING, FullFilmCardRenderUpdateType.UPDATE);

        this._api.addComment(update.film, update.newComment)
          .then(({ film, comments }) => {
            this._fullFilmCardComponent.resetNewCommentData();
            this._updateFullFilmCardState(FilmCardStateType.COMMENT_ADDING, ViewStateValue.NO_PROCESSING, FullFilmCardRenderUpdateType.NO_UPDATE);
            this._commentsModel.addComment(updateType, film, comments);
          })
          .catch(() => {
            this._updateFullFilmCardState(FilmCardStateType.COMMENT_ADDING, ViewStateValue.NO_PROCESSING, FullFilmCardRenderUpdateType.UPDATE);
            this._fullFilmCardComponent.shakeNewCommentForm();

            if (isOnline()) {
              NotificationPresenter.renderNotification(NotificationMessage.ERROR_COMMENT_ADDING);
            } else {
              NotificationPresenter.renderNotification(NotificationMessage.WARNING_COMMENT_ADDING_OFFLINE, NotificationType.WARNING);
            }
          });
        break;

      case UserAction.DELETE_COMMENT:
        this._isFullFilmCardChanged = false;
        this._updateFullFilmCardState(null, null, FullFilmCardRenderUpdateType.UPDATE, { commentToDeleteId: update.commentId });

        this._api.deleteComment(update.commentId)
          .then(() => {
            this._commentsModel.deleteComment(updateType, !this._isFullFilmCardChanged, update.film, update.commentId);
            this._fullFilmCardComponent.removeIdFromCommentsToDeleteState(update.commentId);
          })
          .catch(() => {
            this._fullFilmCardComponent.removeIdFromCommentsToDeleteState(update.commentId);
            this._updateFullFilmCardState(null, null, FullFilmCardRenderUpdateType.UPDATE);
            this._fullFilmCardComponent.shakeComment(update.commentId);

            if (isOnline()) {
              NotificationPresenter.renderNotification(NotificationMessage.ERROR_COMMENT_DELETING);
            } else {
              NotificationPresenter.renderNotification(NotificationMessage.WARNING_COMMENT_DELETING_OFFLINE, NotificationType.WARNING);
            }
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.INIT: {
        this._isLoading = false;
        removeElement(this._component);
        this._component = this._createComponent();
        this._component.setMainFilmsListTitleText(MainFilmsListTitleText.DEFAULT);
        this._component.hideMainFilmsListTitleText();
        this.init();
        break;
      }
      case UpdateType.FILM:
        this._updateFilm(data);
        break;
      case UpdateType.FILM_AND_FILMS_LIST:
        this._updateFilm(data);
        this._removeMainFilmCards(false);
        this._renderMainFilmCards();
        break;
      case UpdateType.FILM_AND_EXTRA:
        this._updateFilm(data);
        this._removeExtraFilmCards();
        this._renderExtraFilmsLists();
        break;
      case UpdateType.FILMS_LIST_AND_SORT:
        this._resetSortMethod();
        this._removeMainFilmCards();
        this._renderMainFilmCards();
        break;
    }
  }

  _handleShowMoreButtonClick() {
    const currentFilmsCount = this._getCurrentFilmsCount();
    const newRenderedFilmsCount = Math.min(currentFilmsCount, this._renderedMainFilmCardsCount + FILMS_COUNT_PER_STEP);
    const films = this._getCurrentFilms().slice(this._renderedMainFilmCardsCount, newRenderedFilmsCount);

    films.forEach((film) => this._renderFilmCard(this._component.getMainListInnerContainerElement(), film));

    this._renderedMainFilmCardsCount = newRenderedFilmsCount;

    if (this._renderedMainFilmCardsCount >= currentFilmsCount) {
      this._showMoreButtonComponent.removeClickListener();
      removeElement(this._showMoreButtonComponent);
    }
  }

  _handleAddToWatchlishButtonClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      FilterType.WATCHLIST,
      Object.assign(
        {},
        film,
        {
          userMeta: Object.assign(
            {},
            film.userMeta,
            {
              isOnWatchlist: !film.userMeta.isOnWatchlist,
            },
          ),
        },
      ),
    );
  }

  _handleMarkAsWatchedButtonClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      FilterType.HISTORY,
      Object.assign(
        {},
        film,
        {
          userMeta: Object.assign(
            {},
            film.userMeta,
            {
              isWatched: !film.userMeta.isWatched,
              watchingDate: !film.userMeta.isWatched ? getCurrentDate() : null,
            },
          ),
        },
      ),
    );
  }

  _handleMarkAsFavoriteButtonClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_FILM,
      FilterType.FAVORITES,
      Object.assign(
        {},
        film,
        {
          userMeta: Object.assign(
            {},
            film.userMeta,
            {
              isFavorite: !film.userMeta.isFavorite,
            },
          ),
        },
      ),
    );
  }

  _handleOpenFullFilmCardClick(film) {
    this._isFullFilmCardChanged = true;

    this._api.cancelCurrentCommentsLoading();
    this._commentsModel.comments = [];

    if (this._fullFilmCardComponent) {
      this._updateFullFilmCardState(FilmCardStateType.COMMENTS_LOADING, ViewStateValue.PROCESSING, FullFilmCardRenderUpdateType.NEW, { film });
    } else {
      this._renderFullFilmCard(film, true);
    }

    this._api.getComments(film.id)
      .then((comments) => {
        this._commentsModel.comments = comments;

        this._updateFullFilmCardState(FilmCardStateType.COMMENTS_LOADING, ViewStateValue.NO_PROCESSING, FullFilmCardRenderUpdateType.UPDATE, { comments: this._commentsModel.comments });
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          return;
        }

        this._updateFullFilmCardState(FilmCardStateType.COMMENTS_LOADING, ViewStateValue.ERROR, FullFilmCardRenderUpdateType.UPDATE);

        if (isOnline()) {
          NotificationPresenter.renderNotification(NotificationMessage.ERROR_COMMENTS_LOADING);
        } else {
          NotificationPresenter.renderNotification(NotificationMessage.WARNING_COMMENTS_LOADING_OFFLINE, NotificationType.WARNING);
        }
      });
  }

  _handleCommentDeleteButtonClick(film, commentId) {
    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.FILM_AND_EXTRA,
      { film, commentId },
    );
  }

  _handleNewCommentFieldSubmit(film, newComment) {
    this._handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.FILM_AND_EXTRA,
      { film, newComment },
    );
  }

  _handleSortMethodClick(sortMethod) {
    if (sortMethod === this._currentSortMethod) {
      return;
    }

    this._currentSortMethod = sortMethod;
    this._removeMainFilmCards();
    this._renderMainFilmCards();
  }

  _onFullFilmCardEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._removeFullFilmCard();
    }
  }
}
