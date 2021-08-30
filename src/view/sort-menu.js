import AbstractView from './abstract';
import { setActiveClass } from '../utils';
import { SortMethods } from '../constants.js';

const BUTTON_ACTIVE_STATE_CLASS_NAME = 'sort__button--active';
const DEFAULT_SORT_METHOD_NAME = 'default';

const createSortMethodTemplate = (sortMethodName) => `<li><a href="#" class="sort__button ${setActiveClass(sortMethodName === DEFAULT_SORT_METHOD_NAME, BUTTON_ACTIVE_STATE_CLASS_NAME)}" data-sort-method="${sortMethodName}">Sort by ${sortMethodName}</a></li>`;

const createSortMenuTemplate = () => (
  `<ul class="sort">
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

  _onSortButtonClick(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    this.getElement().querySelector(`.${BUTTON_ACTIVE_STATE_CLASS_NAME}`).classList.remove(BUTTON_ACTIVE_STATE_CLASS_NAME);
    evt.target.classList.add(BUTTON_ACTIVE_STATE_CLASS_NAME);

    this._callback.sortButtonClick(evt.target.dataset.sortMethod);
  }

  setSortButtonClickListener(cb) {
    this._callback.sortButtonClick = cb;
    this.getElement().addEventListener('click', this._onSortButtonClick);
  }
}
