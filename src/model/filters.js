import AbstractObserver from '../utils/abstract-observer.js';
import { FilterType } from '../constants.js';

export default class Filters extends AbstractObserver {
  constructor() {
    super();

    this._currentFilter = FilterType.ALL_FILMS;
  }

  getCurrentFilter() {
    return this._currentFilter;
  }

  setCurrentFilter(updateType, newFilter) {
    this._currentFilter = newFilter;

    this._notify(updateType, newFilter);
  }
}
