import AbstractView from './abstract.js';
import { getActivityClass } from '../utils';
import { FilterType } from '../constants.js';

const CONTROL_ACTIVE_STATE_CLASS_NAME = 'main-navigation__item--active';

const createFilterTemplate = ({ type: filterType, title: filterTitle, count: filteredFilmsCount }, currentFilterType) => {
  const isAllFilmsFilter = filterType === FilterType.ALL_FILMS;
  const isCurrentFilter = filterType === currentFilterType;

  return (
    `<a href="#${filterType}" class="main-navigation__item ${getActivityClass(isCurrentFilter, CONTROL_ACTIVE_STATE_CLASS_NAME)}" data-filter-type="${filterType}">${filterTitle} ${!isAllFilmsFilter ? `<span class="main-navigation__item-count">${filteredFilmsCount}</span>` : ''}</a>`
  );
};

const createFiltersTemplate = (filters, currentFilterType) => (
  `<div class="main-navigation__items">
    ${filters.map((filter) => createFilterTemplate(filter, currentFilterType)).join(' ')}
  </div>`
);

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._onFiltersClick = this._onFiltersClick.bind(this);
  }

  _getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  setFiltersClickListener(cb) {
    this._callback.filterButtonClick = cb;
    this.getElement().addEventListener('click', this._onFiltersClick);
  }

  _onFiltersClick(evt) {
    if (!(evt.target.tagName === 'A' || evt.target.parentElement.tagName === 'A')) {
      return;
    }

    evt.preventDefault();

    const currentElement = evt.target.tagName === 'A' ? evt.target : evt.target.parentElement;

    this._callback.filterButtonClick(currentElement.dataset.filterType);
  }
}
