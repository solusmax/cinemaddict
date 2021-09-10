import AbstractView from './abstract.js';
import { setActiveClass } from '../utils';
import { SortMethods } from '../constants.js';

const BUTTON_ACTIVE_STATE_CLASS_NAME = 'sort__button--active';
const DEFAULT_SORT_METHOD_NAME = 'default';

const SORT_CLASS_NAME = 'sort';

const createSortMethodTemplate = (sortMethodName) => `<li><a href="#" class="sort__button ${setActiveClass(sortMethodName === DEFAULT_SORT_METHOD_NAME, BUTTON_ACTIVE_STATE_CLASS_NAME)}" data-sort-method="${sortMethodName}">Sort by ${sortMethodName}</a></li>`;

const createSortMenuTemplate = () => (
  `<ul class="${SORT_CLASS_NAME}">
    ${Object.values(SortMethods).map((sortMethodName) => createSortMethodTemplate(sortMethodName)).join(' ')}
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
    return Boolean(document.querySelector(`.${SORT_CLASS_NAME}`));
  }

  _removeCurrentActiveClass() {
    this.getElement().querySelector(`.${BUTTON_ACTIVE_STATE_CLASS_NAME}`).classList.remove(BUTTON_ACTIVE_STATE_CLASS_NAME);
  }

  setDefaultSortMethod() {
    this._removeCurrentActiveClass();
    this.getElement().querySelector(`[data-sort-method="${SortMethods.DEFAULT}"]`).classList.add(BUTTON_ACTIVE_STATE_CLASS_NAME);
  }

  _onSortButtonClick(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    this._removeCurrentActiveClass();
    evt.target.classList.add(BUTTON_ACTIVE_STATE_CLASS_NAME);

    this._callback.sortButtonClick(evt.target.dataset.sortMethod);
  }

  setSortButtonClickListener(cb) {
    this._callback.sortButtonClick = cb;
    this.getElement().addEventListener('click', this._onSortButtonClick);
  }

  removeSortButtonClickListener() {
    this.getElement().removeEventListener('click', this._onSortButtonClick);
  }
}
