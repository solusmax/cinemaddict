import AbstractView from './abstract';
import { setActiveClass } from '../utils';

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

export default class SortMenu extends AbstractView {
  constructor(sortMethods) {
    super();

    this._sortMethods = sortMethods;
  }

  _getTemplate() {
    return createSortMenuTemplate(this._sortMethods);
  }
}
