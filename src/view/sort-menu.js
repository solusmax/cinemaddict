import { setActiveClass } from '../util.js';

const BUTTON_ACTIVE_STATE_CLASS_NAME = 'sort__button--active';

const createSortMethodTemplate = (sortMethods, { id: sortMethodId, title: sortMethodTitle }) => {
  const isDefaultSortMethod = sortMethodId === sortMethods[0].id;

  return `<li><a href="#${sortMethodId}" class="sort__button ${setActiveClass(isDefaultSortMethod, BUTTON_ACTIVE_STATE_CLASS_NAME)}">${sortMethodTitle}</a></li>`;
};

export const createSortMenuTemplate = (sortMethods) => (
  `<ul class="sort">
    ${sortMethods.map((sortMethod) => createSortMethodTemplate(sortMethods, sortMethod)).join(' ')}
  </ul>`
);
