import {
  MainListTitleText,
  FilterTypes
} from '../constants.js';
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

const createMainListInnerTemplate = () => (
  `<h2 class="${ClassNames.FILMS_LIST_TITLE} ${ClassNames.VISUALLY_HIDDEN}">${MainListTitleText.DEFAULT}</h2>

  <div class="${ClassNames.FILMS_LIST_CONTAINER}">
  </div>`
);

const createEmptyMainListInnerTemplate = () => `<h2 class="${ClassNames.FILMS_LIST_TITLE}">${MainListTitleText[FilterTypes.ALL_FILMS]}</h2>`;

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

  setMainListTitleText(text) {
    this._getMainListTitleElement().innerText = text;
  }

  showMainListTitleText() {
    const mainListTitleElement = this._getMainListTitleElement();

    if (mainListTitleElement.classList.contains(ClassNames.VISUALLY_HIDDEN)) {
      mainListTitleElement.classList.remove(ClassNames.VISUALLY_HIDDEN);
    }
  }

  hideMainListTitleText() {
    const mainListTitleElement = this._getMainListTitleElement();

    if (!mainListTitleElement.classList.contains(ClassNames.VISUALLY_HIDDEN)) {
      mainListTitleElement.classList.add(ClassNames.VISUALLY_HIDDEN);
    }
  }

  isMainListTitleTextShown() {
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
