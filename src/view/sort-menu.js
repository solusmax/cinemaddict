import AbstractView from './abstract.js';
import { getActivityClass } from '../utils';
import { SortMethod } from '../constants.js';

const ClassName = {
  MAIN: 'sort',
  BUTTON_ACTIVE_STATE: 'sort__button--active',
};

const createSortMethodTemplate = (sortMethodName) => {
  const isDefaultSortMethod = sortMethodName === SortMethod.DEFAULT;

  return  `<li><a href="#" class="sort__button ${getActivityClass(isDefaultSortMethod, ClassName.BUTTON_ACTIVE_STATE)}" data-sort-method="${sortMethodName}">Sort by ${sortMethodName}</a></li>`;
};

const createSortMenuTemplate = () => (
  `<ul class="${ClassName.MAIN}">
    ${Object.values(SortMethod).map((sortMethodName) => createSortMethodTemplate(sortMethodName)).join(' ')}
  </ul>`
);

export default class SortMenu extends AbstractView {
  constructor() {
    super();

    this._onSortButtonClick = this._onSortButtonClick.bind(this);
  }

  _getTemplate() {
    return createSortMenuTemplate();
  }

  isElementRendered() {
    return Boolean(document.querySelector(`.${ClassName.MAIN}`));
  }

  _getActiveSortMethodElement() {
    return this.getElement().querySelector(`.${ClassName.BUTTON_ACTIVE_STATE}`);
  }

  _removeCurrentActiveClass() {
    this._getActiveSortMethodElement().classList.remove(ClassName.BUTTON_ACTIVE_STATE);
  }

  setDefaultSortMethod() {
    this._removeCurrentActiveClass();
    this.getElement().querySelector(`[data-sort-method="${SortMethod.DEFAULT}"]`).classList.add(ClassName.BUTTON_ACTIVE_STATE);
  }

  setSortButtonClickListener(cb) {
    this._callback.sortButtonClick = cb;
    this.getElement().addEventListener('click', this._onSortButtonClick);
  }

  removeSortButtonClickListener() {
    this.getElement().removeEventListener('click', this._onSortButtonClick);
  }

  _onSortButtonClick(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    const previousSortMethod = this._getActiveSortMethodElement().dataset.sortMethod;
    const newSortMethod = evt.target.dataset.sortMethod;

    if (previousSortMethod !== newSortMethod) {
      this._removeCurrentActiveClass();
      evt.target.classList.add(ClassName.BUTTON_ACTIVE_STATE);
    }

    this._callback.sortButtonClick(newSortMethod);
  }
}
