import AbstractObserver from '../utils/abstract-observer.js';
import { FilterTypes } from '../constants.js';

export default class Filters extends AbstractObserver {
  constructor() {
    super();

    this._currentFilter = FilterTypes.ALL_FILMS;
  }

  setCurrentFilter(updateType, newFilter) {
    this._currentFilter = newFilter;

    this._notify(updateType, newFilter);
  }

  getCurrentFilter() {
    return this._currentFilter;
  }
}
