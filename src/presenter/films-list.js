import {
  getFilmsSortedByComments,
  getFilmsSortedByDate,
  getFilmsSortedByRating,
  isEscEvent,
  removeElement,
  renderElement,
  replaceElement,
  updateFilmData
} from '../utils';
import { SortMethods } from '../constants.js';
import FilmCardView from '../view/film-card.js';
import FilmsListView from '../view/films-list.js';
import FullFilmCardView from '../view/full-film-card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortMenuView from '../view/sort-menu.js';

const BODY_NO_SCROLL_CLASS_NAME = 'hide-overflow';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

export default class FilmsList {
  constructor(filmsListContainer, films, comments, emojis) {
    this._filmsListContainer = filmsListContainer;

    this._initialFilms = films.slice();
    this._currentFilms = films.slice();
    this._comments = comments.slice();
    this._emojis = emojis.slice();

    this._renderedMainFilmCardsCount = 0;
    this._currentSortMethod = SortMethods.DEFAULT;
    this._renderedFilmCardComponents = [];

    this._filmsListComponent = new FilmsListView(this._currentFilms.length);
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._sortMenuComponent = new SortMenuView();

    if (this._initialFilms.length > 0) {
      this._fullFilmCardComponent = new FullFilmCardView(this._initialFilms[0], this._comments, this._emojis);
    }

    this._onFullFilmCardEscKeydown = this._onFullFilmCardEscKeydown.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortMethodClick = this._handleSortMethodClick.bind(this);
  }

  init() {
    this._renderSortMenu();
    renderElement(this._filmsListContainer, this._filmsListComponent);

    if (this._currentFilms.length > 0) {
      this._renderMainFilmsList();
      this._renderExtraFilmsLists();
    }
  }

  _sortFilms(sortMethod) {
    switch (sortMethod) {
      case SortMethods.DATE:
        this._currentFilms = getFilmsSortedByDate(this._currentFilms);
        break;
      case SortMethods.RATING:
        this._currentFilms = getFilmsSortedByRating(this._currentFilms);
        break;
      default:
        this._currentFilms = this._initialFilms;
    }

    this._currentSortMethod = sortMethod;
  }

  _handleSortMethodClick(sortMethod) {
    if (sortMethod === this._currentSortMethod) {
      return;
    }

    this._sortFilms(sortMethod);
    this._clearMainFilmsList();
    this._renderMainFilmsList();
  }

  _renderSortMenu() {
    renderElement(this._filmsListContainer, this._sortMenuComponent);
    this._sortMenuComponent.setSortButtonClickListener(this._handleSortMethodClick);
  }

  _clearMainFilmsList() {
    this._renderedFilmCardComponents = this._renderedFilmCardComponents.map((filmCardComponent) => {
      const isFilmCardComponentInMainList = filmCardComponent.getElement().parentElement.parentElement.id === this._filmsListComponent.getMainListContainerId();

      if (isFilmCardComponentInMainList) {
        this._removeFilmCardComponentListeners(filmCardComponent);
        removeElement(filmCardComponent);
        return null;
      }

      return filmCardComponent;
    });

    this._renderedFilmCardComponents = this._renderedFilmCardComponents.filter((el) => el);

    this._renderedMainFilmCardsCount = 0;

    removeElement(this._showMoreButtonComponent);
  }

  _handleAddToWatchlishButtonClick(film) {
    this._updateFilm(
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
    this._updateFilm(
      Object.assign(
        {},
        film,
        {
          userMeta: Object.assign(
            {},
            film.userMeta,
            {
              isWatched: !film.userMeta.isWatched,
            },
          ),
        },
      ),
    );
  }

  _handleMarkAsFavoriteButtonClick(film) {
    this._updateFilm(
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

  _onFullFilmCardEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._removeFullFilmCard();
    }
  }

  _removeFullFilmCard() {
    this._fullFilmCardComponent.removeAddToWatchlistButtonClickListener();
    this._fullFilmCardComponent.removeMarkAsWatchedButtonClickListener();
    this._fullFilmCardComponent.removeMarkAsFavoriteButtonClickListener();

    this._fullFilmCardComponent.removeCloseButtonClickListener();
    window.removeEventListener('keydown', this._onFullFilmCardEscKeydown);

    removeElement(this._fullFilmCardComponent);

    document.body.classList.remove(BODY_NO_SCROLL_CLASS_NAME);
  }

  _renderFullFilmCard(film) {
    if (this._fullFilmCardComponent.isElementRendered()) {
      this._removeFullFilmCard();
    }

    this._fullFilmCardComponent.init(film);
    renderElement(document.body, this._fullFilmCardComponent);
    document.body.classList.add(BODY_NO_SCROLL_CLASS_NAME);

    this._fullFilmCardComponent.setAddToWatchlistButtonClickListener(this._handleAddToWatchlishButtonClick.bind(this, film));
    this._fullFilmCardComponent.setMarkAsWatchedButtonClickListener(this._handleMarkAsWatchedButtonClick.bind(this, film));
    this._fullFilmCardComponent.setMarkAsFavoriteButtonClickListener(this._handleMarkAsFavoriteButtonClick.bind(this, film));

    this._fullFilmCardComponent.setCloseButtonClickListener(this._removeFullFilmCard.bind(this));
    window.addEventListener('keydown', this._onFullFilmCardEscKeydown);
  }

  _updateFilm(updatedFilm) {
    this._initialFilms = updateFilmData(this._initialFilms, updatedFilm);
    this._currentFilms = updateFilmData(this._currentFilms, updatedFilm);

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

    if (this._fullFilmCardComponent.isElementRendered() && this._fullFilmCardComponent.filmId === updatedFilm.id) {
      this._fullFilmCardComponent.saveScrollPosition();
      this._renderFullFilmCard(updatedFilm);
      this._fullFilmCardComponent.restoreScrollPosition();
    }
  }

  _setFilmCardComponentListeners(filmCardComponent, film) {
    filmCardComponent.setTitleClickListener(this._renderFullFilmCard.bind(this, film));
    filmCardComponent.setPosterClickListener(this._renderFullFilmCard.bind(this, film));
    filmCardComponent.setCommentsLinkClickListener(this._renderFullFilmCard.bind(this, film));

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

  _renderFilmCard(container, film) {
    const filmCardComponent = new FilmCardView(film);
    this._setFilmCardComponentListeners(filmCardComponent, film);

    renderElement(container, filmCardComponent);
    this._renderedFilmCardComponents.push(filmCardComponent);
  }

  _handleShowMoreButtonClick() {
    this._currentFilms
      .slice(this._renderedMainFilmCardsCount, this._renderedMainFilmCardsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this._renderFilmCard(this._filmsListComponent.getMainListContainerElement(), film));

    this._renderedMainFilmCardsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedMainFilmCardsCount >= this._currentFilms.length) {
      this._showMoreButtonComponent.removeClickListener();
      removeElement(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    renderElement(this._filmsListComponent.getMainListElement(), this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickListener(this._handleShowMoreButtonClick);
  }

  _renderMainFilmsList() {
    for (let i = 0; i < Math.min(this._currentFilms.length, FILMS_COUNT_PER_STEP); i++) {
      this._renderFilmCard(this._filmsListComponent.getMainListContainerElement(), this._currentFilms[i]);
    }

    this._renderedMainFilmCardsCount += FILMS_COUNT_PER_STEP;

    if (this._currentFilms.length > this._renderedMainFilmCardsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderExtraFilmsLists() {
    getFilmsSortedByComments(this._currentFilms)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(this._filmsListComponent.getMostCommentedListContainerElement(), film));

    getFilmsSortedByRating(this._currentFilms)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(this._filmsListComponent.getTopRatedListContainerElement(), film));
  }
}
