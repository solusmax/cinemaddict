import { FilterTypes } from '../constants.js';
import { createElement } from '../utils';
import AbstractView from './abstract.js';

const ListIds = {
  MAIN: 'films-list-main',
  TOP_RATED: 'films-list-top-rated',
  MOST_COMMENTED: 'films-list-most-commented',
};

const ClassNames = {
  FILMS_LIST: 'films-list',
  FILMS_LIST_CONTAINER: 'films-list__container',
  FILMS_LIST_TITLE: 'films-list__title',
  VISUALLY_HIDDEN: 'visually-hidden',
};

const EmptyMainListText = {
  [FilterTypes.ALL_FILMS]: 'There are no movies in our database',
  [FilterTypes.WATCHLIST]: 'There are no movies to watch now',
  [FilterTypes.HISTORY]: 'There are no watched movies now',
  [FilterTypes.FAVORITES]: 'There are no favorite movies now',
};

const MAIN_LIST_TITLE = 'All movies. Upcoming';

const createMainListInnerTemplate = () => (
  `<h2 class="${ClassNames.FILMS_LIST_TITLE} ${ClassNames.VISUALLY_HIDDEN}">${MAIN_LIST_TITLE}</h2>

  <div class="${ClassNames.FILMS_LIST_CONTAINER}">
  </div>`
);

const createEmptyMainListInnerTemplate = () => `<h2 class="${ClassNames.FILMS_LIST_TITLE}">${EmptyMainListText[FilterTypes.ALL_FILMS]}</h2>`;

const createTopRatedListTemplate = () => (
  `<section class="${ClassNames.FILMS_LIST} films-list--extra" id="${ListIds.TOP_RATED}">
    <h2 class="${ClassNames.FILMS_LIST_TITLE}">Top rated</h2>

    <div class="${ClassNames.FILMS_LIST_CONTAINER}">
    </div>
  </section>`
);

const createMostCommentedListTemplate = () => (
  `<section class="${ClassNames.FILMS_LIST} films-list--extra" id="${ListIds.MOST_COMMENTED}">
    <h2 class="${ClassNames.FILMS_LIST_TITLE}">Most commented</h2>

    <div class="${ClassNames.FILMS_LIST_CONTAINER}">
    </div>
  </section>`
);

const createFilmsListTemplate = (isEmpty) => (
  `<section class="films">
    <section class="${ClassNames.FILMS_LIST}" id="${ListIds.MAIN}">
      ${isEmpty ? createEmptyMainListInnerTemplate() : createMainListInnerTemplate()}
    </section>
  </section>`
);

export default class FilmsList extends AbstractView {
  constructor(filmsCount) {
    super();

    this._topRatedListElement = null;
    this._mostCommentedListElement = null;

    this._filmsCount = filmsCount;
  }

  _getTemplate() {
    return createFilmsListTemplate(this._filmsCount === 0);
  }

  _getTopRatedListTemplate() {
    return createTopRatedListTemplate();
  }

  _getMostCommentedListTemplate() {
    return createMostCommentedListTemplate();
  }

  isTopRatedListElementRendered() {
    return Boolean(document.querySelector(`#${ListIds.TOP_RATED}`));
  }

  isMostCommentedListElementRendered() {
    return Boolean(document.querySelector(`#${ListIds.MOST_COMMENTED}`));
  }

  getMainListContainerId() {
    return ListIds.MAIN;
  }

  showEmptyMainListText(filterType) {
    const mainListTitleElement = this._getMainListTitleElement();

    mainListTitleElement.innerText = EmptyMainListText[filterType];
    mainListTitleElement.classList.remove(ClassNames.VISUALLY_HIDDEN);
  }

  hideEmptyMainListText() {
    const mainListTitleElement = this._getMainListTitleElement();

    mainListTitleElement.classList.add(ClassNames.VISUALLY_HIDDEN);
    mainListTitleElement.innerText = MAIN_LIST_TITLE;
  }

  isEmptyMainListTextShown() {
    return !this._getMainListTitleElement().classList.contains(ClassNames.VISUALLY_HIDDEN);
  }

  // Геттеры элементов ↓↓↓

  getMainListElement() {
    return this.getElement().querySelector(`#${ListIds.MAIN}`);
  }

  _getMainListTitleElement() {
    return this.getMainListElement().querySelector(`.${ClassNames.FILMS_LIST_TITLE}`);
  }

  getMainListContainerElement() {
    return this.getMainListElement().querySelector(`.${ClassNames.FILMS_LIST_CONTAINER}`);
  }

  getTopRatedListElement() {
    if (!this._topRatedListElement) {
      this._topRatedListElement = createElement(this._getTopRatedListTemplate());
    }

    return this._topRatedListElement;
  }

  getMostCommentedListElement() {
    if (!this._mostCommentedListElement) {
      this._mostCommentedListElement = createElement(this._getMostCommentedListTemplate());
    }

    return this._mostCommentedListElement;
  }

  getTopRatedListContainerElement() {
    return this.getTopRatedListElement().querySelector(`.${ClassNames.FILMS_LIST_CONTAINER}`);
  }

  getMostCommentedListContainerElement() {
    return this.getMostCommentedListElement().querySelector(`.${ClassNames.FILMS_LIST_CONTAINER}`);
  }

  // Ремуверы элементов ↓↓↓

  removeTopRatedListElement() {
    this._topRatedListElement = null;
  }

  removeMostCommentedListElement() {
    this._mostCommentedListElement = null;
  }
}
