import {
  createElement,
  setActiveClass
} from '../utils';

const BUTTON_ACTIVE_STATE_CLASS_NAME = 'sort__button--active';

const createSortMethodTemplate = (sortMethods, { id: sortMethodId, title: sortMethodTitle }) => {
  const isDefaultSortMethod = sortMethodId === sortMethods[0].id;

  return `<li><a href="#${sortMethodId}" class="sort__button ${setActiveClass(isDefaultSortMethod, BUTTON_ACTIVE_STATE_CLASS_NAME)}">${sortMethodTitle}</a></li>`;
};

const createSortMenuTemplate = (sortMethods) => (
  `<ul class="sort">
    ${sortMethods.map((sortMethod) => createSortMethodTemplate(sortMethods, sortMethod)).join(' ')}
  </ul>`
);

export default class SortMenu {
  constructor(sortMethods) {
    this._element = null;
    this._sortMethods = sortMethods;
  }

  getTemplate() {
    return createSortMenuTemplate(this._sortMethods);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
