import UserRankView from '../view/user-rank.js';
import {
  FilterTypes,
  UserRanks,
  UserRanksRanges
} from '../constants.js';
import {
  filter,
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

    const userRank = this._getUserRank(watchedFilmsCount);

    this._userRankComponent = new UserRankView(userRank);

    if (previousUserRankComponent === null) {
      renderElement(this._userRankContainer, this._userRankComponent);
      return;
    }

    replaceElement(this._userRankComponent, previousUserRankComponent);
    removeElement(previousUserRankComponent);
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _getWatchedFilmsCountFilms(films) {
    return filter[FilterTypes.HISTORY](films).length;
  }

  _getUserRank (watchedFilmsCount) {
    for (const rank of Object.values(UserRanks)) {
      if (watchedFilmsCount >= UserRanksRanges[rank][0] && watchedFilmsCount <= UserRanksRanges[rank][1]) {
        return rank;
      }
    }

    return '';
  }

  // Хэндлеры и колбэки ↓↓↓

  _handleModelEvent() {
    this.init();
  }
}
