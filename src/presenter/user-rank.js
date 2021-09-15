import UserRankView from '../view/user-rank.js';
import {
  FilterTypes
} from '../constants.js';
import {
  filter,
  getUserRank,
  renderElement,
  replaceElement,
  removeElement
} from '../utils';

export default class UserRank {
  constructor(userRankContainer, filmsModel) {
    this._userRankContainer = userRankContainer;

    this._filmsModel = filmsModel;

    this._userRankComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._getFilms();
    const watchedFilmsCount = this._getWatchedFilmsCountFilms(films);

    const previousUserRankComponent = this._userRankComponent;

    if (watchedFilmsCount === 0) {
      if (previousUserRankComponent) {
        removeElement(previousUserRankComponent);
      }

      this._userRankComponent = null;
      return;
    }

    const userRank = getUserRank(watchedFilmsCount);

    this._userRankComponent = new UserRankView(userRank);

    if (previousUserRankComponent === null) {
      renderElement(this._userRankContainer, this._userRankComponent);
      return;
    }

    replaceElement(this._userRankComponent, previousUserRankComponent);
    removeElement(previousUserRankComponent);
  }

  _getFilms() {
    return this._filmsModel.getFilms();
  }

  _getWatchedFilmsCountFilms(films) {
    return filter[FilterTypes.HISTORY](films).length;
  }

  // Хэндлеры и колбэки ↓↓↓

  _handleModelEvent() {
    this.init();
  }
}
