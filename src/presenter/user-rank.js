import UserRankView from '../view/user-rank.js';
import {
  filter,
  getUserRank,
  removeElement,
  renderElement,
  replaceElement
} from '../utils';
import {
  FilterType
} from '../constants.js';

export default class UserRank {
  constructor(containerElement, filmsModel) {
    this._containerElement = containerElement;

    this._filmsModel = filmsModel;

    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const watchedFilmsCount = this._getWatchedFilmsCountFilms(this._getFilms());

    const previousComponent = this._component;

    if (!watchedFilmsCount) {
      if (previousComponent) {
        removeElement(previousComponent);
      }

      this._component = null;
      return;
    }

    const userRank = getUserRank(watchedFilmsCount);

    this._component = new UserRankView(userRank);

    if (!previousComponent) {
      renderElement(this._containerElement, this._component);
      return;
    }

    replaceElement(this._component, previousComponent);
    removeElement(previousComponent);
  }

  _getFilms() {
    return this._filmsModel.getFilms();
  }

  _getWatchedFilmsCountFilms(films) {
    return filter[FilterType.HISTORY](films).length;
  }

  _handleModelEvent() {
    this.init();
  }
}
