import FilmCardView from '../view/film-card.js';
import FilmsListView from '../view/films-list.js';
import FullFilmCardView from '../view/full-film-card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortMenuView from '../view/sort-menu.js';
import ErrorAlertPresenter from './error-alert.js';
import {
  filter,
  getCurrentDate,
  getFilmsSortedByComments,
  getFilmsSortedByDate,
  getFilmsSortedByRating,
  isEscEvent,
  removeElement,
  renderElement,
  RenderPosition,
  replaceElement
} from '../utils';
import {
  SortMethods,
  UserActions,
  UpdateTypes,
  FilterTypes,
  MainListTitleText,
  FilmCardStateType,
  ViewStateValue,
  ErrorMessage
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
  constructor(filmsListContainer, filmsModel, commentsModel, filtersModel, api) {
    this._filmsListContainer = filmsListContainer;

    this._isLoading = true;

    this._renderedMainFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._renderedFilmCardComponents = [];
    this._currentSortMethod = SortMethods.DEFAULT;
    this._isFullFilmCardChanged = false;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filtersModel = filtersModel;

    this._filmsListComponent = this._createFilmsListComponent();
    this._showMoreButtonComponent = null;
    this._sortMenuComponent = new SortMenuView();
    this._fullFilmCardComponent = null;

    this._api = api;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._onFullFilmCardEscKeydown = this._onFullFilmCardEscKeydown.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortMethodClick = this._handleSortMethodClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    renderElement(this._filmsListContainer, this._filmsListComponent);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._updateCurrentFilterType();

    this._renderMainFilmCards();

    if (this._getAllFilmsCount() > 0) {
      this._renderTopRatedFilmsList();
      this._renderMostCommentedFilmsList();
      this._renderExtraFilmCards();
    }
  }

  destroy() {
    this._removeMainFilmCards();
    this._removeExtraFilmCards();
    this._removeMostCommentedFilmsList();
    this._removeTopRatedFilmsList();
    this._resetSortMethod();
    this._removeSortMenu();
    this._removeFullFilmCard();
    removeElement(this._filmsListComponent);
  }

  _createFilmsListComponent() {
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
      case SortMethods.DATE:
        return getFilmsSortedByDate(filteredFilms);
      case SortMethods.RATING:
        return getFilmsSortedByRating(filteredFilms);
    }

    return filteredFilms;
  }

  _getCurrentFilmsCount() {
    return this._getCurrentFilms().length;
  }

  _updateFilm(updatedFilm) {
    const newRenderedFilmCardComponents = [];

    for (let i = 0; i < this._renderedFilmCardComponents.length; i++) {
      if (this._renderedFilmCardComponents[i].filmId === updatedFilm.id) {
        const newFilmCardComponent = new FilmCardView(updatedFilm);
        this._setFilmCardComponentListeners(newFilmCardComponent, updatedFilm);

        this._removeFilmCardComponentListeners(this._renderedFilmCardComponents[i]);

        replaceElement(newFilmCardComponent, this._renderedFilmCardComponents[i]);

        this._renderedFilmCardComponents[i].removeElement();
        this._renderedFilmCardComponents.splice(i--, 1);
        newRenderedFilmCardComponents.push(newFilmCardComponent);
      }
    }

    this._renderedFilmCardComponents = [...this._renderedFilmCardComponents, ...newRenderedFilmCardComponents];

    if (this._fullFilmCardComponent !== null && this._fullFilmCardComponent.isElementRendered()) {
      this._renderFullFilmCard(updatedFilm, false);
    }
  }

  _updateCurrentFilterType() {
    this._currentFilterType = this._filtersModel.getCurrentFilter();
  }

  // Карточка фильма ↓↓↓

  _renderFilmCard(container, film) {
    const filmCardComponent = new FilmCardView(film);
    this._setFilmCardComponentListeners(filmCardComponent, film);

    renderElement(container, filmCardComponent);
    this._renderedFilmCardComponents.push(filmCardComponent);
  }

  _disableFilmCardMetaButtons(film, isElementUpdating) {
    this._renderedFilmCardComponents.forEach((filmCardComponent) => {
      if (filmCardComponent.filmId === film.id) {
        filmCardComponent.setViewState(FilmCardStateType.META_UPDATING, ViewStateValue.PROCESSING, isElementUpdating);
      }
    });
  }

  _enableFilmCardMetaButtons(film, isElementUpdating) {
    this._renderedFilmCardComponents.forEach((filmCardComponent) => {
      if (filmCardComponent.filmId === film.id) {
        filmCardComponent.setViewState(FilmCardStateType.META_UPDATING, ViewStateValue.NO_PROCESSING, isElementUpdating);
      }
    });
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

    if (this._filmsListComponent.isMainListTitleTextShown()) {
      this._filmsListComponent.setMainListTitleText(MainListTitleText.DEFAULT);
      this._filmsListComponent.hideMainListTitleText();
    }

    films
      .slice(0, Math.min(currentFilmsCount, this._renderedMainFilmCardsCount))
      .forEach((film) => this._renderFilmCard(this._filmsListComponent.getMainListContainerElement(), film));

    if (currentFilmsCount > this._renderedMainFilmCardsCount) {
      this._renderShowMoreButton();
    }

    if (!this._sortMenuComponent.isElementRendered()) {
      this._renderSortMenu();
    }
  }

  _removeMainFilmCards(resetRenderedMainFilmCardsCount = true) {
    const currentFilmsCount = this._getCurrentFilmsCount();

    this._renderedFilmCardComponents = this._renderedFilmCardComponents
      .map((filmCardComponent) => {
        if (this._isFilmCardInMainList(filmCardComponent)) {
          this._removeFilmCardComponentListeners(filmCardComponent);
          removeElement(filmCardComponent);
          return null;
        }

        return filmCardComponent;
      })
      .filter((el) => el);

    if (this._showMoreButtonComponent !== null && this._showMoreButtonComponent.isElementRendered()) {
      this._showMoreButtonComponent.removeClickListener();
      removeElement(this._showMoreButtonComponent);
    }

    if (resetRenderedMainFilmCardsCount) {
      this._renderedMainFilmCardsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedMainFilmCardsCount = Math.ceil(Math.min(this._renderedMainFilmCardsCount, currentFilmsCount) / FILMS_COUNT_PER_STEP) * FILMS_COUNT_PER_STEP;
    }
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

  _isFilmCardInMainList(component) {
    return component.getElement().parentElement.parentElement.id === this._filmsListComponent.getMainListContainerId();
  }

  _renderNoFilms() {
    this._filmsListComponent.setMainListTitleText(MainListTitleText[this._currentFilterType]);
    this._filmsListComponent.showMainListTitleText();
  }

  _renderLoading() {
    this._filmsListComponent.setMainListTitleText(MainListTitleText.LOADING);
    this._filmsListComponent.showMainListTitleText();
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickListener(this._handleShowMoreButtonClick);
    renderElement(this._filmsListComponent.getMainListElement(), this._showMoreButtonComponent);
  }

  // Меню сортировки ↓↓↓

  _renderSortMenu() {
    renderElement(this._filmsListComponent, this._sortMenuComponent, RenderPosition.BEFOREBEGIN);
    this._sortMenuComponent.setSortButtonClickListener(this._handleSortMethodClick);
  }

  _removeSortMenu() {
    if (this._sortMenuComponent.isElementRendered()) {
      this._sortMenuComponent.removeSortButtonClickListener();
      removeElement(this._sortMenuComponent);
    }
  }

  _resetSortMethod() {
    this._currentSortMethod = SortMethods.DEFAULT;
    this._sortMenuComponent.setDefaultSortMethod();
  }

  // Экстра-списки ↓↓↓

  _renderExtraFilmCards() {
    this._updateCurrentFilterType();

    if (this._currentFilterType === null) {
      return;
    }

    if (this._filmsModel.hasNonZeroRating()) {
      if (!this._filmsListComponent.isTopRatedListElementRendered()) {
        this._renderTopRatedFilmsList();
      }

      getFilmsSortedByRating(this._getAllFilms())
        .slice(0, EXTRA_FILMS_COUNT)
        .forEach((film) => this._renderFilmCard(this._filmsListComponent.getTopRatedListContainerElement(), film));
    } else {
      this._removeTopRatedFilmsList();
    }

    if (this._filmsModel.hasComments()) {
      if (!this._filmsListComponent.isMostCommentedListElementRendered()) {
        this._renderMostCommentedFilmsList();
      }

      getFilmsSortedByComments(this._getAllFilms())
        .slice(0, EXTRA_FILMS_COUNT)
        .forEach((film) => this._renderFilmCard(this._filmsListComponent.getMostCommentedListContainerElement(), film));
    } else {
      this._removeMostCommentedFilmsList();
    }
  }

  _removeExtraFilmCards() {
    this._renderedFilmCardComponents = this._renderedFilmCardComponents
      .map((filmCardComponent) => {
        if (!this._isFilmCardInMainList(filmCardComponent)) {
          this._removeFilmCardComponentListeners(filmCardComponent);
          removeElement(filmCardComponent);
          return null;
        }

        return filmCardComponent;
      })
      .filter((el) => el);
  }

  _renderMostCommentedFilmsList() {
    if (this._filmsListComponent.isMostCommentedListElementRendered()) {
      return;
    }

    renderElement(this._filmsListComponent, this._filmsListComponent.getMostCommentedListElement());
  }

  _removeMostCommentedFilmsList() {
    if (!this._filmsListComponent.isMostCommentedListElementRendered()) {
      return;
    }

    this._filmsListComponent.getMostCommentedListElement().remove();
    this._filmsListComponent.removeMostCommentedListElement();
  }

  _renderTopRatedFilmsList() {
    if (this._filmsListComponent.isTopRatedListElementRendered()) {
      return;
    }

    renderElement(this._filmsListComponent, this._filmsListComponent.getTopRatedListElement());
  }

  _removeTopRatedFilmsList() {
    if (!this._filmsListComponent.isTopRatedListElementRendered()) {
      return;
    }

    this._filmsListComponent.getTopRatedListElement().remove();
    this._filmsListComponent.removeTopRatedListElement();
  }

  // Модалка ↓↓↓

  _renderFullFilmCard(film, isNewModal) {
    if (this._fullFilmCardComponent === null) {
      this._fullFilmCardComponent = new FullFilmCardView(film, this._commentsModel.comments);
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
    renderElement(document.body, this._fullFilmCardComponent);
    document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);

    if (!isNewModal) {
      this._fullFilmCardComponent.restoreScrollPosition();
    }

    this._fullFilmCardComponent.setAddToWatchlistButtonClickListener(this._handleAddToWatchlishButtonClick.bind(this, film));
    this._fullFilmCardComponent.setMarkAsWatchedButtonClickListener(this._handleMarkAsWatchedButtonClick.bind(this, film));
    this._fullFilmCardComponent.setMarkAsFavoriteButtonClickListener(this._handleMarkAsFavoriteButtonClick.bind(this, film));

    this._fullFilmCardComponent.setCloseButtonClickListener(this._removeFullFilmCard.bind(this));
    window.addEventListener('keydown', this._onFullFilmCardEscKeydown);

    this._fullFilmCardComponent.setCommentsListClickListener(this._handleCommentDeleteButtonClick.bind(this, film));

    this._fullFilmCardComponent.setNewCommentFieldSubmitListener(this._handleNewCommentFieldSubmit.bind(this, film));
  }

  _removeFullFilmCard() {
    if (this._fullFilmCardComponent === null) {
      return;
    }

    if (!this._fullFilmCardComponent.isElementRendered()) {
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
    return this._fullFilmCardComponent !== null && this._fullFilmCardComponent.isElementRendered()
      ? this._fullFilmCardComponent.filmId
      : null;
  }

  _updateFullFilmCardState(stateType, updatedState, renderUpdateType, options) {
    if (this._fullFilmCardComponent === null) {
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

  // Хэндлеры и колбэки ↓↓↓

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserActions.UPDATE_FILM:
        this._disableFilmCardMetaButtons(update, true);
        this._updateFullFilmCardState(FilmCardStateType.META_UPDATING, ViewStateValue.PROCESSING, FullFilmCardRenderUpdateType.UPDATE);

        this._api.updateFilm(update)
          .then((film) => {
            let latestUpdateType;
            this._updateCurrentFilterType();

            switch (this._currentFilterType) {
              case null:
                latestUpdateType = null;
                break;
              case updateType:
                latestUpdateType = UpdateTypes.FILM_AND_FILMS_LIST;
                break;
              default:
                latestUpdateType = UpdateTypes.FILM;
            }
            this._enableFilmCardMetaButtons(film, false);
            this._updateFullFilmCardState(FilmCardStateType.META_UPDATING, ViewStateValue.NO_PROCESSING, FullFilmCardRenderUpdateType.NO_UPDATE);
            this._filmsModel.updateFilm(latestUpdateType, film);
          })
          .catch(() => {
            this._enableFilmCardMetaButtons(update, true);
            this._updateFullFilmCardState(FilmCardStateType.META_UPDATING, ViewStateValue.NO_PROCESSING, FullFilmCardRenderUpdateType.UPDATE);
            ErrorAlertPresenter.renderErrorAlert(ErrorMessage.FILM_UPDATING);
          });
        break;

      case UserActions.ADD_COMMENT:
        this._updateFullFilmCardState(FilmCardStateType.COMMENT_ADDING, ViewStateValue.PROCESSING, FullFilmCardRenderUpdateType.UPDATE);

        this._api.addComment(...update)
          .then(({film, comments}) => {
            this._fullFilmCardComponent.resetNewCommentData();
            this._updateFullFilmCardState(FilmCardStateType.COMMENT_ADDING, ViewStateValue.NO_PROCESSING, FullFilmCardRenderUpdateType.NO_UPDATE);
            this._commentsModel.addComment(updateType, film, comments);
          })
          .catch(() => {
            this._updateFullFilmCardState(FilmCardStateType.COMMENT_ADDING, ViewStateValue.PROCESSING, FullFilmCardRenderUpdateType.UPDATE);
            this._fullFilmCardComponent.shakeNewCommentForm();
            ErrorAlertPresenter.renderErrorAlert(ErrorMessage.COMMENT_ADDING);
          });
        break;

      case UserActions.DELETE_COMMENT:
        this._isFullFilmCardChanged = false;
        this._updateFullFilmCardState(null, null, FullFilmCardRenderUpdateType.UPDATE, { commentIdToDelete: update[1] });

        this._api.deleteComment(update[1])
          .then(() => {
            this._updateFullFilmCardState(null, null, FullFilmCardRenderUpdateType.NO_UPDATE);
            this._commentsModel.deleteComment(updateType, !this._isFullFilmCardChanged, ...update);
            this._fullFilmCardComponent.removeIdFromCommentsToDeleteState(update[1]);
          })
          .catch(() => {
            this._fullFilmCardComponent.removeIdFromCommentsToDeleteState(update[1]);
            this._updateFullFilmCardState(null, null, FullFilmCardRenderUpdateType.UPDATE);
            this._fullFilmCardComponent.shakeComment(update[1]);
            ErrorAlertPresenter.renderErrorAlert(ErrorMessage.COMMENT_DELETING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateTypes.INIT: {
        this._isLoading = false;
        removeElement(this._filmsListComponent);
        this._filmsListComponent = this._createFilmsListComponent();
        this._filmsListComponent.setMainListTitleText(MainListTitleText.DEFAULT);
        this._filmsListComponent.hideMainListTitleText();
        this.init();
        break;
      }
      case UpdateTypes.FILM:
        this._updateFilm(data);
        break;
      case UpdateTypes.FILM_AND_FILMS_LIST:
        this._updateFilm(data);
        this._removeMainFilmCards(false);
        this._renderMainFilmCards();
        break;
      case UpdateTypes.FILM_AND_EXTRA:
        this._updateFilm(data);
        this._removeExtraFilmCards();
        this._renderExtraFilmCards();
        break;
      case UpdateTypes.FILMS_LIST_AND_SORT:
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

    films.forEach((film) => this._renderFilmCard(this._filmsListComponent.getMainListContainerElement(), film));

    this._renderedMainFilmCardsCount = newRenderedFilmsCount;

    if (this._renderedMainFilmCardsCount >= currentFilmsCount) {
      this._showMoreButtonComponent.removeClickListener();
      removeElement(this._showMoreButtonComponent);
    }
  }

  _handleAddToWatchlishButtonClick(film) {
    this._handleViewAction(
      UserActions.UPDATE_FILM,
      FilterTypes.WATCHLIST,
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
      UserActions.UPDATE_FILM,
      FilterTypes.HISTORY,
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
      UserActions.UPDATE_FILM,
      FilterTypes.FAVORITES,
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

    this._api.cancelCurrentLoadingComments();
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
        ErrorAlertPresenter.renderErrorAlert(ErrorMessage.COMMENTS_LOADING);
      });
  }

  _onFullFilmCardEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._removeFullFilmCard();
    }
  }

  _handleCommentDeleteButtonClick(film, commentId) {
    this._handleViewAction(
      UserActions.DELETE_COMMENT,
      UpdateTypes.FILM_AND_EXTRA,
      [film, commentId],
    );
  }

  _handleNewCommentFieldSubmit(film, newComment) {
    this._handleViewAction(
      UserActions.ADD_COMMENT,
      UpdateTypes.FILM_AND_EXTRA,
      [film, newComment],
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
}
