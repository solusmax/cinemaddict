import AbstractView from './abstract';
import { setActiveClass } from '../utils';

const CONTROL_ACTIVE_STATE_CLASS_NAME = 'main-navigation__item--active';

const createFilterTemplate = ({ id: filterId, title: filterTitle, filmsCount }, filters) => {
  const isDefaultFilter = filterId === filters[0].id;

  return (
    `<a href="#${filterId}" class="main-navigation__item ${setActiveClass(isDefaultFilter, CONTROL_ACTIVE_STATE_CLASS_NAME)}">${filterTitle} ${!isDefaultFilter ? `<span class="main-navigation__item-count">${filmsCount}</span>` : ''}</a>`
  );
};

const createSiteMenuTemplate = (filters) => (
  `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filters.map((filter) => createFilterTemplate(filter, filters)).join(' ')}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }
}
