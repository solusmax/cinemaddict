import AbstractView from './abstract.js';
import { createElement } from '../utils';
import {
  FilmsListType,
  FilterType,
  MainFilmsListTitleText
} from '../constants.js';

const ClassName = {
  FILMS_LIST: 'films-list',
  FILMS_LIST_INNER_CONTAINER: 'films-list__container',
  FILMS_LIST_TITLE: 'films-list__title',
  VISUALLY_HIDDEN: 'visually-hidden',
};

const createMainListInnerTemplate = (isEmpty) => (
  `<h2 class="${ClassName.FILMS_LIST_TITLE} ${isEmpty ? '' : ClassName.VISUALLY_HIDDEN}">${isEmpty ? MainFilmsListTitleText[FilterType.ALL_FILMS] : MainFilmsListTitleText.DEFAULT}</h2>

  ${isEmpty ? '' : `<div class="${ClassName.FILMS_LIST_INNER_CONTAINER}"></div>`}`
);

const createTopRatedListTemplate = () => (
  `<section class="${ClassName.FILMS_LIST} films-list--extra" id="${FilmsListType.TOP_RATED}">
    <h2 class="${ClassName.FILMS_LIST_TITLE}">Top rated</h2>

    <div class="${ClassName.FILMS_LIST_INNER_CONTAINER}">
    </div>
  </section>`
);

const createMostCommentedListTemplate = () => (
  `<section class="${ClassName.FILMS_LIST} films-list--extra" id="${FilmsListType.MOST_COMMENTED}">
    <h2 class="${ClassName.FILMS_LIST_TITLE}">Most commented</h2>

    <div class="${ClassName.FILMS_LIST_INNER_CONTAINER}">
    </div>
  </section>`
);

const createFilmsListTemplate = (isEmpty) => (
  `<section class="films">
    <section class="${ClassName.FILMS_LIST}" id="${FilmsListType.MAIN}">
      ${createMainListInnerTemplate(isEmpty)}
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

  isExtraListRendered(listType) {
    let selector;

    switch (listType) {
      case FilmsListType.TOP_RATED:
        selector = `#${FilmsListType.TOP_RATED}`;
        break;
      case FilmsListType.MOST_COMMENTED:
        selector = `#${FilmsListType.MOST_COMMENTED}`;
        break;
    }

    return Boolean(document.querySelector(selector));
  }

  setMainFilmsListTitleText(text) {
    this._getMainListTitleElement().innerText = text;
  }

  showMainFilmsListTitleText() {
    const mainListTitleElement = this._getMainListTitleElement();

    if (mainListTitleElement.classList.contains(ClassName.VISUALLY_HIDDEN)) {
      mainListTitleElement.classList.remove(ClassName.VISUALLY_HIDDEN);
    }
  }

  hideMainFilmsListTitleText() {
    const mainListTitleElement = this._getMainListTitleElement();

    if (!mainListTitleElement.classList.contains(ClassName.VISUALLY_HIDDEN)) {
      mainListTitleElement.classList.add(ClassName.VISUALLY_HIDDEN);
    }
  }

  isMainFilmsListTitleTextShown() {
    return !this._getMainListTitleElement().classList.contains(ClassName.VISUALLY_HIDDEN);
  }

  // Геттеры элементов ↓↓↓

  getMainListElement() {
    return this.getElement().querySelector(`#${FilmsListType.MAIN}`);
  }

  _getMainListTitleElement() {
    return this.getMainListElement().querySelector(`.${ClassName.FILMS_LIST_TITLE}`);
  }

  getMainListInnerContainerElement() {
    return this.getMainListElement().querySelector(`.${ClassName.FILMS_LIST_INNER_CONTAINER}`);
  }

  getExtraListElement(listType) {
    switch (listType) {
      case FilmsListType.TOP_RATED:
        if (!this._topRatedListElement) {
          this._topRatedListElement = createElement(this._getTopRatedListTemplate());
        }

        return this._topRatedListElement;

      case FilmsListType.MOST_COMMENTED:
        if (!this._mostCommentedListElement) {
          this._mostCommentedListElement = createElement(this._getMostCommentedListTemplate());
        }

        return this._mostCommentedListElement;
    }
  }

  getExtraListInnerContainerElement(listType) {
    return this.getExtraListElement(listType).querySelector(`.${ClassName.FILMS_LIST_INNER_CONTAINER}`);
  }

  // Ремуверы элементов ↓↓↓

  removeExtraListElement(listType) {
    if (!this.isExtraListRendered(listType)) {
      return;
    }

    switch (listType) {
      case FilmsListType.TOP_RATED:
        this._topRatedListElement.remove();
        this._topRatedListElement = null;
        break;

      case FilmsListType.MOST_COMMENTED:
        this._mostCommentedListElement.remove();
        this._mostCommentedListElement = null;
        break;
    }
  }
}
